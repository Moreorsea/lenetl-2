import { join, extname } from 'node:path'
import { writeFileSync, mkdirSync, existsSync } from 'node:fs'
import { prisma } from '../utils/prisma'
import {
  isValidEmail,
  isValidPhone,
  normalizePhone,
  validateFormFiles,
} from '../../shared/utils/formValidation'

export default defineEventHandler(async (event) => {
  try {
    const multipartData = await readMultipartFormData(event)
    if (!multipartData) {
      throw createError({ statusCode: 400, message: 'Данные формы не получены' })
    }

    const body: Record<string, any> = {}
    const savedFiles: Array<{ name: string; path: string; type: string }> = []

    const uploadFields = multipartData.filter((field) => field.filename && field.data)
    const filesValidationError = validateFormFiles(
      uploadFields.map((field) => ({
        name: field.filename || 'файл',
        size: field.data.length,
      })),
    )
    if (filesValidationError) {
      throw createError({ statusCode: 400, message: filesValidationError })
    }

    // 1. Формируем понятную дату и время для названия папки (Формат: YYYY-MM-DD_HH-mm-ss)
    const now = new Date()
    const pad = (num: number) => String(num).padStart(2, '0')
    const formattedDate = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}_${pad(now.getHours())}-${pad(now.getMinutes())}-${pad(now.getSeconds())}`

    // Уникальный суффикс, чтобы папки не перезаписывались, если запросы пришли в одну секунду
    const uniqueSuffix = Math.random().toString(36).substring(2, 7)
    const submissionDirName = `${formattedDate}_${uniqueSuffix}`
    const submissionDir = join(process.cwd(), 'public', 'uploads', submissionDirName)

    for (const field of multipartData) {
      if (!field.name) continue

      if (field.filename) {
        // 1. Безопасное декодирование имени: проверяем, нужна ли перекодировка
        let originalName = field.filename;

        // Если имя закодировано как бинарная строка (latin1), восстанавливаем UTF-8
        if (/[^\x20-\x7E]/.test(originalName)) {
          try {
            originalName = Buffer.from(originalName, 'binary').toString('utf-8');
          } catch {
            originalName = field.filename;
          }
        }

        // 2. Гарантированно вырезаем расширение из оригинального filename (например, .pdf)
        // Ищем точку с символами на конце строки, игнорируя кракозябры
        const matchExt = field.filename.match(/\.[a-zA-Z0-9]+$/);
        const fileExt = matchExt ? matchExt[0].toLowerCase() : '.pdf';

        // 3. Очищаем имя от кавычек и запрещенных символов Windows, сохраняя буквы и пробелы
        let cleanName = originalName
          .replace(/[\x00-\x1F\x7F-\x9F\\\/:\*\?"<>\|]/g, '') // убираем системные спецсимволы
          .replace(/[«»"']/g, '') // убираем кавычки, которые могут ломать пути
          .trim();

        // Извлекаем имя без расширения, если оно там было
        if (cleanName.endsWith(fileExt)) {
          cleanName = cleanName.slice(0, -fileExt.length);
        }

        // Если имя стало пустым после очистки, даем дефолтное
        if (!cleanName) cleanName = 'uploaded_file';

        // 4. Собираем финальное имя: очищенное имя + точка + расширение
        const finalFilename = `${cleanName}${fileExt}`;

        // 5. Создаем подпапку, если она еще не создана
        if (!existsSync(submissionDir)) {
          mkdirSync(submissionDir, { recursive: true });
        }

        // 6. Записываем бинарный файл на диск
        const filePath = join(submissionDir, finalFilename);
        writeFileSync(filePath, field.data);

        savedFiles.push({
          name: finalFilename,
          path: `/uploads/${submissionDirName}/${finalFilename}`,
          type: field.type || 'application/octet-stream'
        })
      } else {
        body[field.name] = field.data.toString('utf-8');
      }
    }


    const name = body.name?.trim()
    const phoneRaw = body.phone?.trim()
    const email = body.email?.trim()
    const message = body.message?.trim()
    const consent = body.consent === 'true' || body.consent === true

    if (!name) {
      throw createError({ statusCode: 400, message: 'Пожалуйста, укажите ваше имя' })
    }

    if (!phoneRaw) {
      throw createError({ statusCode: 400, message: 'Пожалуйста, укажите номер телефона' })
    }

    if (!isValidPhone(phoneRaw)) {
      throw createError({
        statusCode: 400,
        message: 'Укажите корректный номер телефона в формате +7 (999) 123-45-67',
      })
    }

    if (!email) {
      throw createError({ statusCode: 400, message: 'Пожалуйста, укажите email' })
    }

    if (!isValidEmail(email)) {
      throw createError({ statusCode: 400, message: 'Пожалуйста, укажите корректный email' })
    }

    if (!message) {
      throw createError({
        statusCode: 400,
        message: 'Пожалуйста, опишите ваш вопрос или сообщение',
      })
    }

    if (!consent) {
      throw createError({ statusCode: 400, message: 'Необходимо согласие на обработку персональных данных' })
    }

    const phone = normalizePhone(phoneRaw)

    const submission = await prisma.formSubmission.create({
      data: {
        name,
        phone,
        email,
        message,
        consent,
        files: savedFiles
      }
    })

    return {
      success: true,
      data: submission,
      message: 'Заявка успешно отправлена'
    }

  } catch (error: unknown) {
    // Пробрасываем уже сформированные ошибки валидации (createError)
    if (error && typeof error === 'object' && 'statusCode' in error) {
      throw error
    }

    console.error('Submission error:', error)
    throw createError({
      statusCode: 500,
      message: 'Не удалось сохранить заявку. Попробуйте позже.',
    })
  }
})

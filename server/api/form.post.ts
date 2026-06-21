import { defineEventHandler, readMultipartFormData } from 'h3'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import { prisma } from '../utils/prisma'
import {
  isValidEmail,
  isValidPhone,
  normalizePhone,
  validateFormFiles,
} from '../../shared/utils/formValidation'

export default defineEventHandler(async (event) => {
  const formData = await readMultipartFormData(event)

  if (!formData) {
    return { success: false, message: 'Данные формы не получены' }
  }

  let textFields: Record<string, string> = {}
  let uploadedFiles: Array<{
    originalName: string
    savedName: string
    path: string
    size: number
  }> = []

  const uploadFields = formData.filter(
    (field) =>
      (field.name === 'files' || field.name === 'photo') &&
      field.filename &&
      field.data,
  )
  const filesValidationError = validateFormFiles(
    uploadFields.map((field) => ({
      name: field.filename || 'файл',
      size: field.data.length,
    })),
  )
  if (filesValidationError) {
    return { success: false, message: filesValidationError }
  }

  // --- 1. Обработка полей и файлов ---
  for (const field of formData) {
    // Обработка файлов (поле 'files' или 'photo')
    if ((field.name === 'files' || field.name === 'photo') && field.filename && field.data) {
      const uploadDir = path.join(process.cwd(), 'uploads')
      await mkdir(uploadDir, { recursive: true })

      const ext = field.filename.split('.').pop()
      const uniqueName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`
      const filePath = path.join(uploadDir, uniqueName)

      await writeFile(filePath, field.data)

      uploadedFiles.push({
        originalName: field.filename,
        savedName: uniqueName,
        path: filePath,
        size: field.data.length
      })
    }
    // Обработка текстовых полей
    else {
      textFields[field.name] = field.data?.toString() || ''
    }
  }

  // --- 2. Валидация обязательных полей ---
  if (!textFields.name?.trim()) {
    return { success: false, message: 'Пожалуйста, укажите ваше имя' }
  }

  if (!textFields.phone?.trim()) {
    return { success: false, message: 'Пожалуйста, укажите номер телефона' }
  }

  if (!isValidPhone(textFields.phone)) {
    return {
      success: false,
      message: 'Укажите корректный номер телефона в формате +7 (999) 123-45-67',
    }
  }

  if (!textFields.email?.trim()) {
    return { success: false, message: 'Пожалуйста, укажите email' }
  }

  if (!isValidEmail(textFields.email)) {
    return { success: false, message: 'Пожалуйста, укажите корректный email' }
  }

  if (!textFields.message?.trim()) {
    return { success: false, message: 'Пожалуйста, опишите ваш вопрос или сообщение' }
  }

  if (textFields.consent !== 'true') {
    return { success: false, message: 'Необходимо согласие на обработку персональных данных' }
  }

  // --- 3. Сохранение в базу данных через Prisma ---
  try {
    const savedRecord = await prisma.formSubmission.create({
      data: {
        name: textFields.name.trim(),
        phone: normalizePhone(textFields.phone),
        email: textFields.email.trim(),
        message: textFields.message.trim(),
        consent: textFields.consent === 'true',
        files: uploadedFiles.length > 0 ? uploadedFiles : null,
      }
    })

    console.log(`✅ Заявка сохранена в БД с ID: ${savedRecord.id}`)

    return {
      success: true,
      message: 'Заявка успешно отправлена! Мы свяжемся с вами в ближайшее время.',
      data: {
        id: savedRecord.id,
        filesCount: uploadedFiles.length
      }
    }

  } catch (dbError) {
    console.error('❌ Ошибка при сохранении в БД:', dbError)
    return {
      success: false,
      message: 'Произошла ошибка при сохранении. Пожалуйста, попробуйте позже.',
    }
  }
})
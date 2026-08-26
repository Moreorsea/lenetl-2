import { join } from 'node:path'
import { writeFileSync } from 'node:fs'
import { prisma } from '../utils/prisma'
import { ensureUploadsDir } from '../utils/uploads'
import { decodeUploadFilename, generateStoredFilename } from '../utils/filename'
import {
  getEmailValidationError,
  isValidPhone,
  normalizePhone,
  PHONE_MASK_ERROR,
  validateFormFiles,
} from '../../shared/utils/formValidation'
import { notifyNewSubmission } from '../utils/mail'

export default defineEventHandler(async (event) => {
  try {
    const multipartData = await readMultipartFormData(event)
    if (!multipartData) {
      throw createError({ statusCode: 400, message: 'Данные формы не получены' })
    }

    const body: Record<string, string> = {}
    const pendingFiles: Array<{
      originalName: string
      data: Buffer
      type: string
    }> = []

    const uploadFields = multipartData.filter((field) => field.filename && field.data)
    const filesValidationError = validateFormFiles(
      uploadFields.map((field) => ({
        name: decodeUploadFilename(field.filename),
        size: field.data.length,
        type: field.type,
      })),
    )
    if (filesValidationError) {
      throw createError({ statusCode: 400, message: filesValidationError })
    }

    const now = new Date()
    const pad = (num: number) => String(num).padStart(2, '0')
    const formattedDate = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}_${pad(now.getHours())}-${pad(now.getMinutes())}-${pad(now.getSeconds())}`
    const uniqueSuffix = Math.random().toString(36).substring(2, 7)
    const submissionDirName = `${formattedDate}_${uniqueSuffix}`
    const submissionDir = ensureUploadsDir(submissionDirName)

    for (const field of multipartData) {
      if (!field.name) continue

      if (field.filename && field.data) {
        pendingFiles.push({
          originalName: decodeUploadFilename(field.filename),
          data: field.data,
          type: field.type || 'application/octet-stream',
        })
      } else {
        body[field.name] = field.data.toString('utf-8')
      }
    }

    const name = body.name?.trim()
    const phoneRaw = body.phone?.trim()
    const email = body.email?.trim()
    const message = body.message?.trim()
    const consent = body.consent === 'true'

    if (!name) {
      throw createError({ statusCode: 400, message: 'Пожалуйста, укажите ваше имя' })
    }

    if (!phoneRaw) {
      throw createError({ statusCode: 400, message: 'Пожалуйста, укажите номер телефона' })
    }

    if (!isValidPhone(phoneRaw)) {
      throw createError({
        statusCode: 400,
        message: PHONE_MASK_ERROR,
      })
    }

    const emailValidationError = getEmailValidationError(email ?? '')
    if (emailValidationError) {
      throw createError({ statusCode: 400, message: emailValidationError })
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
        files: null,
      },
    })

    for (const file of pendingFiles) {
      const storedName = generateStoredFilename(file.originalName)
      const storagePath = `${submissionDirName}/${storedName}`.replace(/\\/g, '/')
      const filePath = join(submissionDir, storedName)

      writeFileSync(filePath, file.data)

      await prisma.submissionFile.create({
        data: {
          submissionId: submission.id,
          originalName: file.originalName,
          storedName,
          storagePath,
          mimeType: file.type,
          size: file.data.length,
        },
      })
    }

    notifyNewSubmission({
      id: submission.id,
      name: submission.name,
      phone: submission.phone,
      email: submission.email,
      message: submission.message,
      filesCount: pendingFiles.length,
    })

    return {
      success: true,
      data: submission,
      message: 'Заявка успешно отправлена',
    }
  } catch (error: unknown) {
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

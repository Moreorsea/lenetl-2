import { defineEventHandler, readMultipartFormData } from 'h3'
import { writeFile } from 'fs/promises'
import { join } from 'node:path'
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
  const formData = await readMultipartFormData(event)

  if (!formData) {
    return { success: false, message: 'Данные формы не получены' }
  }

  const textFields: Record<string, string> = {}
  const pendingFiles: Array<{
    originalName: string
    data: Buffer
    type: string
  }> = []

  const uploadFields = formData.filter(
    (field) =>
      (field.name === 'files' || field.name === 'photo') &&
      field.filename &&
      field.data,
  )
  const filesValidationError = validateFormFiles(
    uploadFields.map((field) => ({
      name: decodeUploadFilename(field.filename),
      size: field.data.length,
      type: field.type,
    })),
  )
  if (filesValidationError) {
    return { success: false, message: filesValidationError }
  }

  const now = new Date()
  const pad = (num: number) => String(num).padStart(2, '0')
  const formattedDate = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}_${pad(now.getHours())}-${pad(now.getMinutes())}-${pad(now.getSeconds())}`
  const uniqueSuffix = Math.random().toString(36).substring(2, 7)
  const submissionDirName = `${formattedDate}_${uniqueSuffix}`
  const submissionDir = ensureUploadsDir(submissionDirName)

  for (const field of formData) {
    if ((field.name === 'files' || field.name === 'photo') && field.filename && field.data) {
      pendingFiles.push({
        originalName: decodeUploadFilename(field.filename),
        data: field.data,
        type: field.type || 'application/octet-stream',
      })
    } else if (field.name) {
      textFields[field.name] = field.data?.toString() || ''
    }
  }

  if (!textFields.name?.trim()) {
    return { success: false, message: 'Пожалуйста, укажите ваше имя' }
  }

  if (!textFields.phone?.trim()) {
    return { success: false, message: 'Пожалуйста, укажите номер телефона' }
  }

  if (!isValidPhone(textFields.phone)) {
    return {
      success: false,
      message: PHONE_MASK_ERROR,
    }
  }

  const emailValidationError = getEmailValidationError(textFields.email ?? '')
  if (emailValidationError) {
    return { success: false, message: emailValidationError }
  }

  if (!textFields.message?.trim()) {
    return { success: false, message: 'Пожалуйста, опишите ваш вопрос или сообщение' }
  }

  if (textFields.consent !== 'true') {
    return { success: false, message: 'Необходимо согласие на обработку персональных данных' }
  }

  try {
    const savedRecord = await prisma.formSubmission.create({
      data: {
        name: textFields.name.trim(),
        phone: normalizePhone(textFields.phone),
        email: textFields.email.trim(),
        message: textFields.message.trim(),
        consent: textFields.consent === 'true',
        files: null,
      },
    })

    for (const file of pendingFiles) {
      const storedName = generateStoredFilename(file.originalName)
      const storagePath = `${submissionDirName}/${storedName}`.replace(/\\/g, '/')
      const filePath = join(submissionDir, storedName)

      await writeFile(filePath, file.data)

      await prisma.submissionFile.create({
        data: {
          submissionId: savedRecord.id,
          originalName: file.originalName,
          storedName,
          storagePath,
          mimeType: file.type,
          size: file.data.length,
        },
      })
    }

    console.log(`✅ Заявка сохранена в БД с ID: ${savedRecord.id}`)

    notifyNewSubmission({
      id: savedRecord.id,
      name: savedRecord.name,
      phone: savedRecord.phone,
      email: savedRecord.email,
      message: savedRecord.message,
      filesCount: pendingFiles.length,
    })

    return {
      success: true,
      message: 'Заявка успешно отправлена! Мы свяжемся с вами в ближайшее время.',
      data: {
        id: savedRecord.id,
        filesCount: pendingFiles.length,
      },
    }
  } catch (dbError) {
    console.error('❌ Ошибка при сохранении в БД:', dbError)
    return {
      success: false,
      message: 'Произошла ошибка при сохранении. Пожалуйста, попробуйте позже.',
    }
  }
})

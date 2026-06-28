import { defineEventHandler, readMultipartFormData } from 'h3'
import { writeFile } from 'fs/promises'
import { join } from 'node:path'
import { prisma } from '../utils/prisma'
import { ensureUploadsDir, getUploadPublicUrl } from '../utils/uploads'
import { decodeUploadFilename, sanitizeUploadFilename } from '../utils/filename'
import {
  getEmailValidationError,
  isValidPhone,
  normalizePhone,
  PHONE_MASK_ERROR,
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
      name: decodeUploadFilename(field.filename),
      size: field.data.length,
      type: field.type,
    })),
  )
  if (filesValidationError) {
    return { success: false, message: filesValidationError }
  }

  const uploadDir = ensureUploadsDir()

  for (const field of formData) {
    if ((field.name === 'files' || field.name === 'photo') && field.filename && field.data) {
      const decodedName = decodeUploadFilename(field.filename)
      const finalFilename = sanitizeUploadFilename(field.filename)
      const filePath = join(uploadDir, finalFilename)

      await writeFile(filePath, field.data)

      uploadedFiles.push({
        originalName: decodedName,
        savedName: finalFilename,
        path: getUploadPublicUrl(finalFilename),
        size: field.data.length,
      })
    } else {
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
        files: uploadedFiles.length > 0 ? uploadedFiles : null,
      },
    })

    console.log(`✅ Заявка сохранена в БД с ID: ${savedRecord.id}`)

    return {
      success: true,
      message: 'Заявка успешно отправлена! Мы свяжемся с вами в ближайшее время.',
      data: {
        id: savedRecord.id,
        filesCount: uploadedFiles.length,
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

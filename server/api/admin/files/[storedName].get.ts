import { createReadStream, existsSync, statSync } from 'node:fs'
import { extname } from 'node:path'
import { sendStream } from 'h3'
import { prisma } from '../../../utils/prisma'
import { requireAdminSession } from '../../../utils/adminAuth'
import { resolveUploadFilePath } from '../../../utils/uploads'

const MIME_TYPES: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.bmp': 'image/bmp',
  '.svg': 'image/svg+xml',
  '.pdf': 'application/pdf',
  '.doc': 'application/msword',
  '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  '.xls': 'application/vnd.ms-excel',
  '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  '.txt': 'text/plain',
}

export default defineEventHandler(async (event) => {
  requireAdminSession(event)

  const storedName = getRouterParam(event, 'storedName')
  if (!storedName) {
    throw createError({ statusCode: 404, message: 'Файл не найден' })
  }

  const fileRecord = await prisma.submissionFile.findUnique({
    where: { storedName },
  })

  if (!fileRecord) {
    throw createError({ statusCode: 404, message: 'Файл не найден' })
  }

  const filePath = resolveUploadFilePath(fileRecord.storagePath)

  if (!existsSync(filePath) || !statSync(filePath).isFile()) {
    throw createError({ statusCode: 404, message: 'Файл не найден на диске' })
  }

  const ext = extname(filePath).toLowerCase()
  const mime = fileRecord.mimeType || MIME_TYPES[ext] || 'application/octet-stream'
  const encodedName = encodeURIComponent(fileRecord.originalName)

  setResponseHeader(event, 'Content-Type', mime)
  setResponseHeader(event, 'Cache-Control', 'private, no-store')
  setResponseHeader(
    event,
    'Content-Disposition',
    `inline; filename*=UTF-8''${encodedName}`,
  )

  return sendStream(event, createReadStream(filePath))
})

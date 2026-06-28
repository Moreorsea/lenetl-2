import { createReadStream, existsSync, statSync } from 'node:fs'
import { extname } from 'node:path'
import { sendStream } from 'h3'
import { resolveUploadFilePath } from '../../utils/uploads'

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

export default defineEventHandler((event) => {
  const pathParam = getRouterParam(event, 'path')

  if (!pathParam) {
    throw createError({ statusCode: 404, message: 'Файл не найден' })
  }

  const filePath = resolveUploadFilePath(pathParam)

  if (!existsSync(filePath) || !statSync(filePath).isFile()) {
    throw createError({ statusCode: 404, message: 'Файл не найден' })
  }

  const ext = extname(filePath).toLowerCase()
  const mime = MIME_TYPES[ext] || 'application/octet-stream'

  setResponseHeader(event, 'Content-Type', mime)
  setResponseHeader(event, 'Cache-Control', 'private, max-age=3600')

  return sendStream(event, createReadStream(filePath))
})

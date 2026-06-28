import { existsSync, mkdirSync } from 'node:fs'
import { join } from 'node:path'

const UPLOADS_PUBLIC_PREFIX = '/uploads'

let cachedAppRoot: string | null = null

/**
 * Корень приложения / сайта.
 * На проде при запуске из .output/server поднимается на два уровня вверх.
 *
 * APP_ROOT  — явный путь (например /var/www/.../etl.spb.ru)
 * UPLOADS_DIR — явный путь к uploads (иначе {APP_ROOT}/uploads)
 */
export function getAppRoot(): string {
  if (process.env.APP_ROOT) {
    return process.env.APP_ROOT
  }

  if (cachedAppRoot) {
    return cachedAppRoot
  }

  const cwd = process.cwd().replace(/\\/g, '/')

  if (cwd.endsWith('.output/server')) {
    cachedAppRoot = join(process.cwd(), '..', '..')
    return cachedAppRoot
  }

  cachedAppRoot = process.cwd()
  return cachedAppRoot
}

export function getUploadsDir(): string {
  if (process.env.UPLOADS_DIR) {
    return process.env.UPLOADS_DIR
  }

  return join(getAppRoot(), 'uploads')
}

export function ensureUploadsDir(...subdirs: string[]): string {
  const dir = subdirs.length ? join(getUploadsDir(), ...subdirs) : getUploadsDir()

  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true })
  }

  return dir
}

export function getUploadPublicUrl(...segments: string[]): string {
  return `${UPLOADS_PUBLIC_PREFIX}/${segments.filter(Boolean).join('/')}`
}

function normalizeUploadRelativePath(input: string): string[] {
  const normalized = input.replace(/^\/+/, '').replace(/^uploads\//, '')
  const segments = normalized.split('/').filter(Boolean)

  if (segments.some((segment) => segment === '..' || segment === '.')) {
    throw createError({ statusCode: 400, message: 'Некорректный путь к файлу' })
  }

  return segments
}

function getLegacyUploadsDir(): string {
  return join(getAppRoot(), 'public', 'uploads')
}

/**
 * Абсолютный путь к файлу по URL вида /uploads/... или относительному пути.
 * Сначала ищет в {appRoot}/uploads, затем в legacy {appRoot}/public/uploads.
 */
export function resolveUploadFilePath(input: string): string {
  const segments = normalizeUploadRelativePath(input)
  const primaryPath = join(getUploadsDir(), ...segments)

  if (existsSync(primaryPath)) {
    return primaryPath
  }

  const legacyPath = join(getLegacyUploadsDir(), ...segments)

  if (existsSync(legacyPath)) {
    return legacyPath
  }

  return primaryPath
}

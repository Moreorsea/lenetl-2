/**
 * Декодирует имя файла из multipart/form-data.
 * Браузеры часто шлют UTF-8 имя, а сервер читает его как latin1 → кракозябры.
 */
export function decodeUploadFilename(raw: string | undefined): string {
  if (!raw?.trim()) {
    return 'uploaded_file'
  }

  const name = raw.trim()

  if (hasCyrillic(name)) {
    return name
  }

  const latin1Decoded = Buffer.from(name, 'latin1').toString('utf8')
  if (hasCyrillic(latin1Decoded)) {
    return latin1Decoded
  }

  if (/%[0-9A-Fa-f]{2}/.test(name)) {
    try {
      const uriDecoded = decodeURIComponent(name.replace(/\+/g, ' '))
      if (hasCyrillic(uriDecoded)) {
        return uriDecoded
      }

      const latin1FromUri = Buffer.from(uriDecoded, 'latin1').toString('utf8')
      if (hasCyrillic(latin1FromUri)) {
        return latin1FromUri
      }

      if (uriDecoded) {
        return uriDecoded
      }
    } catch {
      // ignore invalid URI encoding
    }
  }

  if (looksLikeMojibake(name)) {
    return latin1Decoded
  }

  return name
}

export function splitFilename(filename: string): { baseName: string; ext: string } {
  const match = filename.match(/(\.[^./\\]+)$/)
  const ext = match?.[1]?.toLowerCase() ?? ''
  const baseName = ext ? filename.slice(0, -ext.length) : filename

  return { baseName, ext }
}

export function sanitizeUploadFilename(raw: string | undefined): string {
  const decoded = decodeUploadFilename(raw)
  const { baseName, ext } = splitFilename(decoded)

  let cleanBase = baseName
    .replace(/[\x00-\x1F\x7F-\x9F\\/:*?"<>|]/g, '')
    .replace(/[«»"']/g, '')
    .trim()

  if (!cleanBase) {
    cleanBase = 'uploaded_file'
  }

  const safeExt = ext.match(/^\.[a-zA-Z0-9]+$/) ? ext : ''

  return `${cleanBase}${safeExt || '.bin'}`
}

function hasCyrillic(value: string): boolean {
  return /[\u0400-\u04FF]/.test(value)
}

function looksLikeMojibake(value: string): boolean {
  return /[ÃÐÑÂ]/.test(value) || /Ð[°-¿]/.test(value) || /ï¿½/.test(value)
}

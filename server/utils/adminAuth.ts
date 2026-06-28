import { createHmac, timingSafeEqual } from 'node:crypto'
import type { H3Event } from 'h3'

export const ADMIN_SESSION_COOKIE = 'admin_session'
const SESSION_TTL_MS = 24 * 60 * 60 * 1000

type SessionPayload = {
  login: string
  exp: number
}

function getSessionSecret(): string {
  const secret = process.env.ADMIN_SESSION_SECRET
  if (!secret) {
    throw createError({
      statusCode: 500,
      message: 'Админ-панель не настроена (ADMIN_SESSION_SECRET)',
    })
  }
  return secret
}

function getAdminCredentials() {
  const login = process.env.ADMIN_LOGIN
  const password = process.env.ADMIN_PASSWORD

  if (!login || !password) {
    throw createError({
      statusCode: 500,
      message: 'Админ-панель не настроена (ADMIN_LOGIN / ADMIN_PASSWORD)',
    })
  }

  return { login, password }
}

function signPayload(payload: SessionPayload): string {
  const data = Buffer.from(JSON.stringify(payload)).toString('base64url')
  const signature = createHmac('sha256', getSessionSecret()).update(data).digest('base64url')
  return `${data}.${signature}`
}

function verifySessionToken(token: string): SessionPayload | null {
  const [data, signature] = token.split('.')
  if (!data || !signature) return null

  const expected = createHmac('sha256', getSessionSecret()).update(data).digest('base64url')

  const sigBuffer = Buffer.from(signature)
  const expectedBuffer = Buffer.from(expected)
  if (sigBuffer.length !== expectedBuffer.length) return null
  if (!timingSafeEqual(sigBuffer, expectedBuffer)) return null

  try {
    const payload = JSON.parse(Buffer.from(data, 'base64url').toString()) as SessionPayload
    if (!payload.login || !payload.exp || payload.exp < Date.now()) return null
    return payload
  } catch {
    return null
  }
}

export function createAdminSession(login: string): string {
  return signPayload({
    login,
    exp: Date.now() + SESSION_TTL_MS,
  })
}

function safeCompare(a: string, b: string): boolean {
  const aBuf = Buffer.from(a)
  const bBuf = Buffer.from(b)

  if (aBuf.length !== bBuf.length) {
    timingSafeEqual(aBuf, aBuf)
    return false
  }

  return timingSafeEqual(aBuf, bBuf)
}

export function verifyAdminCredentials(login: string, password: string): boolean {
  const credentials = getAdminCredentials()
  return safeCompare(login, credentials.login) && safeCompare(password, credentials.password)
}

export function getAdminSession(event: H3Event): SessionPayload | null {
  const token = getCookie(event, ADMIN_SESSION_COOKIE)
  if (!token) return null
  return verifySessionToken(token)
}

export function requireAdminSession(event: H3Event): SessionPayload {
  const session = getAdminSession(event)
  if (!session) {
    throw createError({ statusCode: 401, message: 'Требуется авторизация' })
  }
  return session
}

export function setAdminSessionCookie(event: H3Event, token: string) {
  setCookie(event, ADMIN_SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: SESSION_TTL_MS / 1000,
  })
}

export function clearAdminSessionCookie(event: H3Event) {
  deleteCookie(event, ADMIN_SESSION_COOKIE, { path: '/' })
}

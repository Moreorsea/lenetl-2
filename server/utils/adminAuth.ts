import { createHmac, randomInt, timingSafeEqual } from 'node:crypto'
import { mkdir, readFile, writeFile, unlink } from 'node:fs/promises'
import { join } from 'node:path'
import type { H3Event } from 'h3'

export const ADMIN_SESSION_COOKIE = 'admin_session'
const SESSION_TTL_MS = 24 * 60 * 60 * 1000
const RESET_CODE_TTL_MS = 15 * 60 * 1000
const RESET_RESEND_COOLDOWN_MS = 60 * 1000
const MIN_PASSWORD_LENGTH = 6

type SessionPayload = {
  login: string
  exp: number
}

type CredentialsOverride = {
  password: string
}

type ResetChallenge = {
  login: string
  code: string
  exp: number
  sentAt: number
}

function getDataDir() {
  return join(process.cwd(), '.data')
}

function getCredentialsOverridePath() {
  return join(getDataDir(), 'admin-credentials.json')
}

function getResetChallengePath() {
  return join(getDataDir(), 'admin-reset.json')
}

async function ensureDataDir() {
  await mkdir(getDataDir(), { recursive: true })
}

async function readJsonFile<T>(path: string): Promise<T | null> {
  try {
    const raw = await readFile(path, 'utf8')
    return JSON.parse(raw) as T
  } catch {
    return null
  }
}

async function writeJsonFile(path: string, value: unknown) {
  await ensureDataDir()
  await writeFile(path, `${JSON.stringify(value, null, 2)}\n`, 'utf8')
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

async function getStoredPasswordOverride(): Promise<string | null> {
  const override = await readJsonFile<CredentialsOverride>(getCredentialsOverridePath())
  const password = override?.password?.trim()
  return password || null
}

function getAdminCredentialsFromEnv() {
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

export async function getAdminCredentials() {
  const fromEnv = getAdminCredentialsFromEnv()
  const overridePassword = await getStoredPasswordOverride()

  return {
    login: fromEnv.login,
    password: overridePassword || fromEnv.password,
  }
}

export async function updateAdminPassword(newPassword: string) {
  const password = newPassword.trim()

  if (password.length < MIN_PASSWORD_LENGTH) {
    throw createError({
      statusCode: 400,
      message: `Пароль должен быть не короче ${MIN_PASSWORD_LENGTH} символов`,
    })
  }

  await writeJsonFile(getCredentialsOverridePath(), { password } satisfies CredentialsOverride)
  process.env.ADMIN_PASSWORD = password
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

export async function verifyAdminCredentials(login: string, password: string): Promise<boolean> {
  const credentials = await getAdminCredentials()
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

function generateResetCode(): string {
  return String(randomInt(100000, 1000000))
}

export async function createAdminPasswordResetCode(login: string): Promise<string> {
  const credentials = await getAdminCredentials()

  if (!safeCompare(login.trim(), credentials.login)) {
    throw createError({ statusCode: 400, message: 'Неверный логин' })
  }

  const existing = await readJsonFile<ResetChallenge>(getResetChallengePath())
  const now = Date.now()

  if (existing && existing.sentAt + RESET_RESEND_COOLDOWN_MS > now) {
    const waitSec = Math.ceil((existing.sentAt + RESET_RESEND_COOLDOWN_MS - now) / 1000)
    throw createError({
      statusCode: 429,
      message: `Повторная отправка будет доступна через ${waitSec} сек.`,
    })
  }

  const code = generateResetCode()
  await writeJsonFile(getResetChallengePath(), {
    login: credentials.login,
    code,
    exp: now + RESET_CODE_TTL_MS,
    sentAt: now,
  } satisfies ResetChallenge)

  return code
}

export async function confirmAdminPasswordReset(params: {
  login: string
  code: string
  newPassword: string
  confirmPassword: string
}) {
  const login = params.login.trim()
  const code = params.code.trim()
  const newPassword = params.newPassword
  const confirmPassword = params.confirmPassword

  if (!login || !code || !newPassword || !confirmPassword) {
    throw createError({ statusCode: 400, message: 'Заполните все поля' })
  }

  if (newPassword !== confirmPassword) {
    throw createError({ statusCode: 400, message: 'Пароли не совпадают' })
  }

  const challenge = await readJsonFile<ResetChallenge>(getResetChallengePath())
  if (!challenge || challenge.exp < Date.now()) {
    throw createError({ statusCode: 400, message: 'Код истёк или не запрошен. Запросите новый.' })
  }

  if (!safeCompare(login, challenge.login) || !safeCompare(code, challenge.code)) {
    throw createError({ statusCode: 400, message: 'Неверный логин или код' })
  }

  await updateAdminPassword(newPassword)

  try {
    await unlink(getResetChallengePath())
  } catch {
    // ignore missing file
  }
}

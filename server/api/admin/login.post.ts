import {
  clearAdminSessionCookie,
  createAdminSession,
  setAdminSessionCookie,
  verifyAdminCredentials,
} from '../../utils/adminAuth'

export default defineEventHandler(async (event) => {
  const body = await readBody<{ login?: string; password?: string }>(event)

  const login = body.login?.trim()
  const password = body.password ?? ''

  if (!login || !password) {
    throw createError({ statusCode: 400, message: 'Укажите логин и пароль' })
  }

  if (!verifyAdminCredentials(login, password)) {
    throw createError({ statusCode: 401, message: 'Неверный логин или пароль' })
  }

  const token = createAdminSession(login)
  setAdminSessionCookie(event, token)

  return { success: true }
})

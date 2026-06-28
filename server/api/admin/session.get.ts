import { getAdminSession } from '../../utils/adminAuth'

export default defineEventHandler(async (event) => {
  const session = getAdminSession(event)

  if (!session) {
    throw createError({ statusCode: 401, message: 'Не авторизован' })
  }

  return {
    success: true,
    login: session.login,
  }
})

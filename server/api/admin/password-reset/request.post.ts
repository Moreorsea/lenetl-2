import { createAdminPasswordResetCode } from '../../../utils/adminAuth'
import { isMailConfigured, sendAdminPasswordResetEmail } from '../../../utils/mail'

export default defineEventHandler(async (event) => {
  const body = await readBody<{ login?: string }>(event)
  const login = body.login?.trim()

  if (!login) {
    throw createError({ statusCode: 400, message: 'Укажите логин' })
  }

  if (!isMailConfigured()) {
    throw createError({
      statusCode: 500,
      message: 'Почта не настроена. Сброс пароля временно недоступен.',
    })
  }

  const code = await createAdminPasswordResetCode(login)

  try {
    await sendAdminPasswordResetEmail(code)
  } catch (error) {
    console.error('[mail] Не удалось отправить код сброса пароля:', error)
    throw createError({
      statusCode: 500,
      message: 'Не удалось отправить код на почту. Попробуйте позже.',
    })
  }

  return {
    success: true,
    message: 'Код отправлен на почту администратора',
  }
})

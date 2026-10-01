import { confirmAdminPasswordReset } from '../../../utils/adminAuth'

export default defineEventHandler(async (event) => {
  const body = await readBody<{
    login?: string
    code?: string
    newPassword?: string
    confirmPassword?: string
  }>(event)

  await confirmAdminPasswordReset({
    login: body.login ?? '',
    code: body.code ?? '',
    newPassword: body.newPassword ?? '',
    confirmPassword: body.confirmPassword ?? '',
  })

  return {
    success: true,
    message: 'Пароль обновлён. Теперь можно войти.',
  }
})

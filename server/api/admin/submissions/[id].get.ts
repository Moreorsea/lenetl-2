import { prisma } from '../../../utils/prisma'
import { requireAdminSession } from '../../../utils/adminAuth'

export default defineEventHandler(async (event) => {
  requireAdminSession(event)

  const id = Number(getRouterParam(event, 'id'))
  if (!Number.isInteger(id) || id <= 0) {
    throw createError({ statusCode: 400, message: 'Некорректный ID заявки' })
  }

  const submission = await prisma.formSubmission.findUnique({
    where: { id },
  })

  if (!submission) {
    throw createError({ statusCode: 404, message: 'Заявка не найдена' })
  }

  return {
    success: true,
    data: submission,
  }
})

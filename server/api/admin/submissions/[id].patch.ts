import { prisma } from '../../../utils/prisma'
import { requireAdminSession } from '../../../utils/adminAuth'
import { resolveSubmissionFiles } from '../../../utils/submissionFiles'
import { isSubmissionStatus } from '../../../../shared/types/submissionStatus'

export default defineEventHandler(async (event) => {
  requireAdminSession(event)

  const id = Number(getRouterParam(event, 'id'))
  if (!Number.isInteger(id) || id <= 0) {
    throw createError({ statusCode: 400, message: 'Некорректный ID заявки' })
  }

  const body = await readBody<{ status?: unknown; managerComment?: unknown }>(event)

  const hasStatus = body.status !== undefined
  const hasComment = body.managerComment !== undefined

  if (!hasStatus && !hasComment) {
    throw createError({ statusCode: 400, message: 'Не указаны данные для обновления' })
  }

  if (hasStatus && !isSubmissionStatus(body.status)) {
    throw createError({ statusCode: 400, message: 'Некорректный статус заявки' })
  }

  if (hasComment && typeof body.managerComment !== 'string' && body.managerComment !== null) {
    throw createError({ statusCode: 400, message: 'Некорректный комментарий менеджера' })
  }

  const existing = await prisma.formSubmission.findUnique({ where: { id } })

  if (!existing) {
    throw createError({ statusCode: 404, message: 'Заявка не найдена' })
  }

  if (existing.deletedAt) {
    throw createError({ statusCode: 400, message: 'Нельзя изменить удалённую заявку' })
  }

  const data: {
    status?: typeof body.status & string
    managerComment?: string | null
  } = {}

  if (hasStatus && isSubmissionStatus(body.status)) {
    data.status = body.status
  }

  if (hasComment) {
    const comment = typeof body.managerComment === 'string' ? body.managerComment.trim() : null
    data.managerComment = comment || null
  }

  const submission = await prisma.formSubmission.update({
    where: { id },
    data,
    include: { attachments: true },
  })

  const { attachments: _attachments, ...rest } = submission

  return {
    success: true,
    data: {
      ...rest,
      files: resolveSubmissionFiles(submission),
    },
  }
})

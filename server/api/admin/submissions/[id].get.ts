import { prisma } from '../../../utils/prisma'
import { requireAdminSession } from '../../../utils/adminAuth'
import { resolveSubmissionFiles } from '../../../utils/submissionFiles'

export default defineEventHandler(async (event) => {
  requireAdminSession(event)

  const id = Number(getRouterParam(event, 'id'))
  if (!Number.isInteger(id) || id <= 0) {
    throw createError({ statusCode: 400, message: 'Некорректный ID заявки' })
  }

  const submission = await prisma.formSubmission.findUnique({
    where: { id },
    include: { attachments: true },
  })

  if (!submission) {
    throw createError({ statusCode: 404, message: 'Заявка не найдена' })
  }

  const { attachments: _attachments, ...rest } = submission

  return {
    success: true,
    data: {
      ...rest,
      files: resolveSubmissionFiles(submission),
    },
  }
})

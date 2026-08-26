import { prisma } from '../../utils/prisma'
import { requireAdminSession } from '../../utils/adminAuth'
import { isSubmissionStatus } from '../../../shared/types/submissionStatus'

export default defineEventHandler(async (event) => {
  requireAdminSession(event)

  const query = getQuery(event)
  const showDeleted = query.deleted === 'true' || query.deleted === '1'
  const statusFilter = typeof query.status === 'string' ? query.status : null

  if (statusFilter && !isSubmissionStatus(statusFilter)) {
    throw createError({ statusCode: 400, message: 'Некорректный статус фильтра' })
  }

  const submissions = await prisma.formSubmission.findMany({
    where: {
      deletedAt: showDeleted ? { not: null } : null,
      ...(statusFilter ? { status: statusFilter } : {}),
    },
    orderBy: showDeleted ? { deletedAt: 'desc' } : { createdAt: 'desc' },
  })

  return {
    success: true,
    data: submissions,
  }
})

import { prisma } from '../../../utils/prisma'
import { requireAdminSession } from '../../../utils/adminAuth'
import { isSubmissionStatus } from '../../../../shared/types/submissionStatus'

export default defineEventHandler(async (event) => {
  requireAdminSession(event)

  const query = getQuery(event)
  const statusFilter = typeof query.status === 'string' ? query.status : null

  if (statusFilter && !isSubmissionStatus(statusFilter)) {
    throw createError({ statusCode: 400, message: 'Некорректный статус фильтра' })
  }

  const history = await prisma.submissionHistory.findMany({
    where: {
      ...(statusFilter ? { status: statusFilter } : {}),
    },
    orderBy: { archivedAt: 'desc' },
  })

  return {
    success: true,
    data: history,
  }
})

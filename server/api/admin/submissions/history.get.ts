import { prisma } from '../../../utils/prisma'
import { requireAdminSession } from '../../../utils/adminAuth'

export default defineEventHandler(async (event) => {
  requireAdminSession(event)

  const history = await prisma.submissionHistory.findMany({
    orderBy: { archivedAt: 'desc' },
  })

  return {
    success: true,
    data: history,
  }
})

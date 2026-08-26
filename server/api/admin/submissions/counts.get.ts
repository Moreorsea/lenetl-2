import { prisma } from '../../../utils/prisma'
import { requireAdminSession } from '../../../utils/adminAuth'

export default defineEventHandler(async (event) => {
  requireAdminSession(event)

  const [active, deleted, history] = await Promise.all([
    prisma.formSubmission.count({ where: { deletedAt: null } }),
    prisma.formSubmission.count({ where: { deletedAt: { not: null } } }),
    prisma.submissionHistory.count(),
  ])

  return {
    success: true,
    data: { active, deleted, history },
  }
})

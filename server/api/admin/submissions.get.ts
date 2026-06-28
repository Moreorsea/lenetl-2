import { prisma } from '../../utils/prisma'
import { requireAdminSession } from '../../utils/adminAuth'

export default defineEventHandler(async (event) => {
  requireAdminSession(event)

  const submissions = await prisma.formSubmission.findMany({
    orderBy: { createdAt: 'desc' },
  })

  return {
    success: true,
    data: submissions,
  }
})

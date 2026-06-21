// server/api/submissions.get.ts
import { prisma } from '../utils/prisma'

export default defineEventHandler(async () => {
  const submissions = await prisma.formSubmission.findMany({
    orderBy: { createdAt: 'desc' }
  })

  return {
    success: true,
    data: submissions
  }
})
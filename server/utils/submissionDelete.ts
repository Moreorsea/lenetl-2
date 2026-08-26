import { rm } from 'node:fs/promises'
import { dirname } from 'node:path'
import { prisma } from './prisma'
import { getUploadsDir, resolveUploadFilePath } from './uploads'
import { resolveSubmissionFiles } from './submissionFiles'

export async function softDeleteSubmission(id: number) {
  const existing = await prisma.formSubmission.findUnique({ where: { id } })

  if (!existing) {
    throw createError({ statusCode: 404, message: 'Заявка не найдена' })
  }

  if (existing.deletedAt) {
    throw createError({ statusCode: 400, message: 'Заявка уже удалена' })
  }

  return prisma.formSubmission.update({
    where: { id },
    data: { deletedAt: new Date() },
  })
}

export async function permanentlyDeleteSubmission(id: number) {
  const existing = await prisma.formSubmission.findUnique({
    where: { id },
    include: { attachments: true },
  })

  if (!existing) {
    throw createError({ statusCode: 404, message: 'Заявка не найдена' })
  }

  if (!existing.deletedAt) {
    throw createError({
      statusCode: 400,
      message: 'Сначала переместите заявку в удалённые',
    })
  }

  const files = resolveSubmissionFiles(existing)
  const filesCount = files.length
  const deletedAt = existing.deletedAt

  await prisma.submissionHistory.create({
    data: {
      originalSubmissionId: existing.id,
      name: existing.name,
      phone: existing.phone,
      email: existing.email,
      message: existing.message,
      consent: existing.consent,
      status: existing.status,
      managerComment: existing.managerComment,
      filesCount,
      submittedAt: existing.createdAt,
      deletedAt,
    },
  })

  const storagePaths = new Set<string>()

  for (const file of existing.attachments) {
    storagePaths.add(file.storagePath)
  }

  for (const file of files) {
    if (file.path.startsWith('/uploads/')) {
      storagePaths.add(file.path.replace(/^\/uploads\//, ''))
    }
  }

  for (const storagePath of storagePaths) {
    try {
      const absolutePath = resolveUploadFilePath(storagePath)
      await rm(absolutePath, { force: true })

      const parentDir = dirname(absolutePath)
      const uploadsDir = getUploadsDir().replace(/[/\\]+$/, '')

      if (parentDir !== uploadsDir && parentDir.startsWith(uploadsDir)) {
        await rm(parentDir, { recursive: true, force: true }).catch(() => undefined)
      }
    } catch {
      // файл уже отсутствует — продолжаем
    }
  }

  await prisma.formSubmission.delete({ where: { id } })

  return { id, filesCount }
}

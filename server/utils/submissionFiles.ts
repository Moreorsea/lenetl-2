import type { SubmissionFile as PrismaSubmissionFile } from '../../prisma/generated/client'
import type { Submission, SubmissionFile } from '../../shared/types/submission'
import { parseSubmissionFiles } from '../../shared/types/submission'

export function getAdminFileUrl(storedName: string): string {
  return `/api/admin/files/${encodeURIComponent(storedName)}`
}

export function mapSubmissionFileRecord(file: PrismaSubmissionFile): SubmissionFile {
  return {
    id: file.id,
    originalName: file.originalName,
    storedName: file.storedName,
    name: file.originalName,
    path: getAdminFileUrl(file.storedName),
    type: file.mimeType,
    size: file.size,
  }
}

export function mapSubmissionFileRecords(files: PrismaSubmissionFile[]): SubmissionFile[] {
  return files.map(mapSubmissionFileRecord)
}

type SubmissionWithAttachments = Submission & {
  attachments?: PrismaSubmissionFile[]
}

export function resolveSubmissionFiles(submission: SubmissionWithAttachments): SubmissionFile[] {
  if (submission.attachments?.length) {
    return mapSubmissionFileRecords(submission.attachments)
  }

  return parseSubmissionFiles(submission.files)
}

export async function isProtectedUploadPath(relativePath: string): Promise<boolean> {
  const { prisma } = await import('./prisma')
  const normalized = relativePath.replace(/^\/+/, '').replace(/\\/g, '/')

  const file = await prisma.submissionFile.findFirst({
    where: { storagePath: normalized },
    select: { id: true },
  })

  return Boolean(file)
}

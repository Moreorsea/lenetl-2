import type { SubmissionStatus } from './submissionStatus'

export type SubmissionFile = {
  id?: number
  originalName: string
  storedName?: string
  /** Отображаемое имя (обычно originalName) */
  name: string
  path: string
  type?: string
  size?: number
}

export type Submission = {
  id: number
  name: string
  phone: string
  email: string
  message: string
  consent: boolean
  status: SubmissionStatus
  managerComment: string | null
  deletedAt: string | null
  files: SubmissionFile[] | null
  createdAt: string
  updatedAt: string
}

export function parseSubmissionFiles(files: Submission['files']): SubmissionFile[] {
  if (!files || !Array.isArray(files)) return []

  return files.map((file, index) => ({
    id: file.id ?? index,
    originalName: file.originalName ?? file.name,
    storedName: file.storedName,
    name: file.originalName ?? file.name,
    path: file.path,
    type: file.type,
    size: file.size,
  }))
}

export function isImageFile(file: SubmissionFile): boolean {
  if (file.type?.startsWith('image/')) return true
  const name = file.originalName || file.name
  return /\.(jpe?g|png|gif|webp|bmp|svg)$/i.test(name)
}

export function isPdfFile(file: SubmissionFile): boolean {
  if (file.type === 'application/pdf') return true
  const name = file.originalName || file.name
  return /\.pdf$/i.test(name)
}

export function formatSubmissionDate(value: string): string {
  return new Intl.DateTimeFormat('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value))
}

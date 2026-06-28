export type SubmissionFile = {
  name: string
  path: string
  type?: string
}

export type Submission = {
  id: number
  name: string
  phone: string
  email: string
  message: string
  consent: boolean
  files: SubmissionFile[] | null
  createdAt: string
  updatedAt: string
}

export function parseSubmissionFiles(files: Submission['files']): SubmissionFile[] {
  if (!files || !Array.isArray(files)) return []
  return files
}

export function isImageFile(file: SubmissionFile): boolean {
  if (file.type?.startsWith('image/')) return true
  return /\.(jpe?g|png|gif|webp|bmp|svg)$/i.test(file.name)
}

export function isPdfFile(file: SubmissionFile): boolean {
  if (file.type === 'application/pdf') return true
  return /\.pdf$/i.test(file.name)
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

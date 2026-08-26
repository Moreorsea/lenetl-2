export const SUBMISSION_STATUSES = [
  'NEW',
  'WAITING_CLARIFICATION',
  'PROCESSED',
  'CLOSED',
] as const

export type SubmissionStatus = (typeof SUBMISSION_STATUSES)[number]

export const SUBMISSION_STATUS_LABELS: Record<SubmissionStatus, string> = {
  NEW: 'Новая',
  WAITING_CLARIFICATION: 'Жду уточнения',
  PROCESSED: 'Обработано',
  CLOSED: 'Закрыто',
}

export type SubmissionStatusStyle = {
  bg: string
  text: string
  border: string
}

export const SUBMISSION_STATUS_STYLES: Record<SubmissionStatus, SubmissionStatusStyle> = {
  NEW: {
    bg: '#e3f2fd',
    text: '#0d47a1',
    border: '#90caf9',
  },
  WAITING_CLARIFICATION: {
    bg: '#fffde7',
    text: '#d4a017',
    border: '#ffca28',
  },
  PROCESSED: {
    bg: '#e8f5e9',
    text: '#2e7d32',
    border: '#81c784',
  },
  CLOSED: {
    bg: '#ffebee',
    text: '#c62828',
    border: '#ef9a9a',
  },
}

export function isSubmissionStatus(value: unknown): value is SubmissionStatus {
  return typeof value === 'string' && SUBMISSION_STATUSES.includes(value as SubmissionStatus)
}

export function getSubmissionStatusLabel(status: SubmissionStatus): string {
  return SUBMISSION_STATUS_LABELS[status]
}

export function getSubmissionStatusStyle(status: SubmissionStatus): SubmissionStatusStyle {
  return SUBMISSION_STATUS_STYLES[status]
}

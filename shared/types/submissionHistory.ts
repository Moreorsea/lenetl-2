import type { SubmissionStatus } from './submissionStatus'

export type SubmissionHistoryItem = {
  id: number
  originalSubmissionId: number
  name: string
  phone: string
  email: string
  message: string
  consent: boolean
  status: SubmissionStatus
  managerComment: string | null
  filesCount: number
  submittedAt: string
  deletedAt: string
  archivedAt: string
}

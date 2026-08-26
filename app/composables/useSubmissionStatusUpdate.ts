import type { Submission } from '#shared/types/submission'
import type { SubmissionStatus } from '#shared/types/submissionStatus'

type SubmissionPatch = {
  status?: SubmissionStatus
  managerComment?: string | null
}

export function useSubmissionStatusUpdate() {
  const savingIds = ref<Set<number>>(new Set())

  const isSaving = (id: number) => savingIds.value.has(id)

  const updateSubmission = async (id: number, patch: SubmissionPatch) => {
    savingIds.value = new Set([...savingIds.value, id])

    try {
      const response = await $fetch<{ success: boolean; data: Submission }>(
        `/api/admin/submissions/${id}`,
        {
          method: 'PATCH',
          body: patch,
        },
      )

      return response.data
    } finally {
      const next = new Set(savingIds.value)
      next.delete(id)
      savingIds.value = next
    }
  }

  const updateSubmissionStatus = (id: number, status: SubmissionStatus) =>
    updateSubmission(id, { status })

  const updateManagerComment = (id: number, managerComment: string | null) =>
    updateSubmission(id, { managerComment })

  return {
    isSaving,
    updateSubmission,
    updateSubmissionStatus,
    updateManagerComment,
  }
}

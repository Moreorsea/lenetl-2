export function useDeleteSubmission() {
  const deletingIds = ref<Set<number>>(new Set())
  const { refreshSubmissionCounts } = useSubmissionCounts()

  const isDeleting = (id: number) => deletingIds.value.has(id)

  const runDelete = async (id: number, permanent: boolean) => {
    deletingIds.value = new Set([...deletingIds.value, id])

    try {
      const query = permanent ? '?permanent=true' : ''
      await $fetch(`/api/admin/submissions/${id}${query}`, { method: 'DELETE' })
      await refreshSubmissionCounts()
      return true
    } finally {
      const next = new Set(deletingIds.value)
      next.delete(id)
      deletingIds.value = next
    }
  }

  /** Мягкое удаление: в раздел «Удалённые», без подтверждения */
  const softDeleteSubmission = (id: number) => runDelete(id, false)

  /** Окончательное удаление: файлы удаляются, запись уходит в историю */
  const permanentlyDeleteSubmission = (id: number) => runDelete(id, true)

  return {
    isDeleting,
    softDeleteSubmission,
    permanentlyDeleteSubmission,
  }
}

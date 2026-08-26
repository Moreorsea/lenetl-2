type SubmissionCounts = {
  active: number
  deleted: number
  history: number
}

type CountsResponse = {
  success: boolean
  data: SubmissionCounts
}

export function useSubmissionCounts() {
  const counts = useState<SubmissionCounts>('admin-submission-counts', () => ({
    active: 0,
    deleted: 0,
    history: 0,
  }))

  const refreshSubmissionCounts = async (fetcher: typeof $fetch = $fetch) => {
    const response = await fetcher<CountsResponse>('/api/admin/submissions/counts')
    counts.value = response.data
    return counts.value
  }

  return {
    counts,
    refreshSubmissionCounts,
  }
}

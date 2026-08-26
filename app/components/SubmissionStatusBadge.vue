<template>
  <span
    class="submission-status-text"
    :style="{ color: statusColor }">
    {{ getSubmissionStatusLabel(status) }}
  </span>
</template>

<script lang="ts" setup>
import {
  getSubmissionStatusLabel,
  getSubmissionStatusStyle,
  type SubmissionStatus,
} from '#shared/types/submissionStatus'

const props = defineProps<{
  status: SubmissionStatus
}>()

const statusColor = computed(() => getSubmissionStatusStyle(props.status).text)
</script>

<style lang="scss" scoped>
.submission-status-text {
  font-size: inherit;
  font-weight: 700;
  white-space: nowrap;
}
</style>

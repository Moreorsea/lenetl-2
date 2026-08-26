<template>
  <AdminSubmissionsList
    title="Удалённые"
    subtitle="Заявки, перемещённые в удалённые"
    empty-text="Удалённых заявок нет"
    deleted />
</template>

<script lang="ts" setup>
definePageMeta({
  layout: 'admin',
  middleware: 'admin',
  pageTransition: false,
})
</script>

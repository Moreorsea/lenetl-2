<template>
  <div class="submission-detail">
    <NuxtLink
      :to="backLink"
      class="submission-detail__back">
      <i class="fas fa-arrow-left"></i>
      {{ backLabel }}
    </NuxtLink>

    <div
      v-if="pending"
      class="submission-detail__state">
      Загрузка...
    </div>

    <div
      v-else-if="error || !submission"
      class="submission-detail__state submission-detail__state--error">
      {{ errorMessage }}
    </div>

    <template v-else>
      <p
        v-if="submission.deletedAt"
        class="submission-detail__deleted-banner">
        Заявка удалена {{ formatSubmissionDate(submission.deletedAt) }}
      </p>

      <header class="submission-detail__header">
        <div class="submission-detail__header-main">
          <h1>Заявка № {{ submission.id }}</h1>
          <p>от {{ formatSubmissionDate(submission.createdAt) }}</p>
        </div>
        <SubmissionStatusSelect
          v-if="!submission.deletedAt"
          :model-value="submission.status"
          :saving="isSaving(submission.id)"
          @update:model-value="changeStatus" />
        <SubmissionStatusBadge
          v-else
          :status="submission.status" />
      </header>

      <div class="submission-detail__grid">
        <section class="submission-detail__card">
          <h2>Контактные данные</h2>
          <dl class="submission-detail__fields">
            <div class="submission-detail__field">
              <dt>Имя</dt>
              <dd>{{ submission.name }}</dd>
            </div>
            <div class="submission-detail__field">
              <dt>Телефон</dt>
              <dd>
                <a :href="`tel:${submission.phone}`">{{ submission.phone }}</a>
              </dd>
            </div>
            <div class="submission-detail__field">
              <dt>Email</dt>
              <dd>
                <a :href="`mailto:${submission.email}`">{{ submission.email }}</a>
              </dd>
            </div>
            <div class="submission-detail__field">
              <dt>Согласие на обработку ПД</dt>
              <dd>{{ submission.consent ? 'Да' : 'Нет' }}</dd>
            </div>
          </dl>
        </section>

        <section class="submission-detail__card submission-detail__card--wide">
          <h2>Сообщение</h2>
          <p class="submission-detail__message">{{ submission.message }}</p>
        </section>
      </div>

      <section class="submission-detail__card">
        <div class="submission-detail__comment-header">
          <h2>Комментарий менеджера</h2>
          <span
            v-if="commentSavedFlash"
            class="submission-detail__comment-saved">
            Сохранено
          </span>
        </div>

        <template v-if="submission.deletedAt">
          <p
            v-if="submission.managerComment"
            class="submission-detail__message">
            {{ submission.managerComment }}
          </p>
          <p
            v-else
            class="submission-detail__empty">
            Комментарий не указан
          </p>
        </template>

        <template v-else>
          <textarea
            v-model="managerCommentDraft"
            class="submission-detail__comment-input"
            rows="5"
            placeholder="Внутренний комментарий по заявке..."
            :disabled="isSaving(submission.id)" />
          <div class="submission-detail__comment-actions">
            <button
              type="button"
              class="submission-detail__comment-save"
              :disabled="!commentDirty || isSaving(submission.id)"
              @click="saveManagerComment">
              <i
                v-if="isSaving(submission.id)"
                class="fas fa-spinner fa-spin" />
              {{ isSaving(submission.id) ? 'Сохранение...' : 'Сохранить комментарий' }}
            </button>
          </div>
        </template>
      </section>

      <section class="submission-detail__card">
        <h2>
          Файлы
          <span
            v-if="files.length"
            class="submission-detail__count">
            ({{ files.length }})
          </span>
        </h2>

        <p
          v-if="!files.length"
          class="submission-detail__empty">
          Файлы не прикреплены
        </p>

        <div
          v-else
          class="submission-detail__files">
          <article
            v-for="file in files"
            :key="file.id ?? file.storedName ?? file.path"
            class="submission-file">
            <header class="submission-file__header">
              <span class="submission-file__name">{{ file.originalName || file.name }}</span>
              <a
                :href="file.path"
                target="_blank"
                rel="noopener noreferrer"
                class="submission-file__download">
                <i class="fas fa-external-link-alt"></i>
                Открыть
              </a>
            </header>

            <div
              v-if="isImageFile(file)"
              class="submission-file__preview">
              <img
                :src="file.path"
                :alt="file.originalName || file.name"
                loading="lazy" />
            </div>

            <div
              v-else-if="isPdfFile(file)"
              class="submission-file__preview submission-file__preview--pdf">
              <iframe
                :src="file.path"
                :title="file.originalName || file.name" />
            </div>

            <div
              v-else
              class="submission-file__fallback">
              <i class="fas fa-file-alt"></i>
              <span>Предпросмотр недоступен</span>
              <a
                :href="file.path"
                target="_blank"
                rel="noopener noreferrer">
                Скачать файл
              </a>
            </div>
          </article>
        </div>
      </section>
    </template>
  </div>
</template>

<script lang="ts" setup>
import {
  formatSubmissionDate,
  isImageFile,
  isPdfFile,
  parseSubmissionFiles,
  type Submission,
} from '#shared/types/submission'
import type { SubmissionStatus } from '#shared/types/submissionStatus'

definePageMeta({
  layout: 'admin',
  middleware: 'admin',
  pageTransition: false,
})

const route = useRoute()
const submissionId = computed(() => String(route.params.id))

const { data, pending, error } = await useFetch<{ success: boolean; data: Submission }>(
  () => `/api/admin/submissions/${submissionId.value}`,
)

const submission = computed(() => data.value?.data ?? null)
const files = computed(() => parseSubmissionFiles(submission.value?.files ?? null))
const { isSaving, updateSubmissionStatus, updateManagerComment } = useSubmissionStatusUpdate()

const managerCommentDraft = ref('')
const commentSavedFlash = ref(false)
let commentFlashTimer: ReturnType<typeof setTimeout> | undefined

watch(
  submission,
  (value) => {
    managerCommentDraft.value = value?.managerComment ?? ''
  },
  { immediate: true },
)

const commentDirty = computed(() => {
  const current = submission.value?.managerComment ?? ''
  return managerCommentDraft.value.trim() !== current.trim()
})

const backLink = computed(() =>
  submission.value?.deletedAt ? '/admin/submissions/deleted' : '/admin/submissions',
)

const backLabel = computed(() =>
  submission.value?.deletedAt ? 'К удалённым' : 'К списку заявок',
)

const changeStatus = async (status: SubmissionStatus) => {
  if (!submission.value) return

  const updated = await updateSubmissionStatus(submission.value.id, status)

  if (!data.value) return

  data.value = {
    ...data.value,
    data: updated,
  }
}

const saveManagerComment = async () => {
  if (!submission.value || !commentDirty.value) return

  const updated = await updateManagerComment(
    submission.value.id,
    managerCommentDraft.value.trim() || null,
  )

  if (!data.value) return

  data.value = {
    ...data.value,
    data: updated,
  }

  commentSavedFlash.value = true
  if (commentFlashTimer) clearTimeout(commentFlashTimer)
  commentFlashTimer = setTimeout(() => {
    commentSavedFlash.value = false
  }, 2000)
}

onUnmounted(() => {
  if (commentFlashTimer) clearTimeout(commentFlashTimer)
})

const errorMessage = computed(() => {
  if (error.value) {
    const fetchError = error.value as { data?: { message?: string } }
    return fetchError.data?.message ?? 'Не удалось загрузить заявку'
  }
  return 'Заявка не найдена'
})
</script>

<style lang="scss" scoped>
.submission-detail {
  > .submission-detail__card {
    margin-bottom: 20px;

    @media (max-width: 768px) {
      margin-bottom: 12px;
    }
  }

  &__deleted-banner {
    margin: 0 0 16px;
    padding: 12px 16px;
    background: rgba(198, 40, 40, 0.06);
    border: 1px solid rgba(198, 40, 40, 0.18);
    color: #c62828;
    font-size: 0.92rem;
    font-weight: 600;
  }

  &__back {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 24px;
    color: var(--lenet-body-text);
    text-decoration: none;
    font-size: 0.95rem;
    font-weight: 600;
    transition: color 0.2s ease;

    &:hover {
      color: var(--lenet-accent);
    }

    @media (max-width: 768px) {
      margin-bottom: 16px;
      font-size: 0.9rem;
    }
  }

  &__header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 16px;
    margin-bottom: 24px;

    @media (max-width: 768px) {
      flex-direction: column;
      align-items: stretch;
      margin-bottom: 16px;
    }
  }

  &__header-main {
    h1 {
      margin: 0 0 6px;
      font-size: 1.75rem;
      font-weight: 700;
      color: var(--lenet-body-text);
    }

    p {
      margin: 0;
      color: var(--lenet-text-muted);
    }

    @media (max-width: 768px) {
      h1 {
        font-size: 1.35rem;
      }

      p {
        font-size: 0.9rem;
      }
    }
  }

  &__state {
    padding: 48px;
    text-align: center;
    color: var(--lenet-text-muted);
    background: #fff;
    border: 1px solid rgba(13, 27, 42, 0.08);
    box-shadow: 0 10px 24px -10px rgba(13, 27, 42, 0.1);

    &--error {
      color: #c62828;
      background: rgba(198, 40, 40, 0.04);
      border-color: rgba(198, 40, 40, 0.18);
    }

    @media (max-width: 768px) {
      padding: 32px 20px;
      font-size: 0.95rem;
    }
  }

  &__grid {
    display: grid;
    grid-template-columns: minmax(280px, 360px) 1fr;
    gap: 20px;
    margin-bottom: 20px;

    @media (max-width: 900px) {
      grid-template-columns: 1fr;
    }

    @media (max-width: 768px) {
      gap: 12px;
      margin-bottom: 12px;
    }
  }

  &__card {
    padding: 24px;
    background: #fff;
    border: 1px solid rgba(13, 27, 42, 0.08);
    box-shadow: 0 10px 24px -10px rgba(13, 27, 42, 0.1);

    &--wide {
      min-width: 0;
    }

    h2 {
      margin: 0 0 16px;
      font-size: 1.1rem;
      font-weight: 700;
      color: var(--lenet-body-text);
    }

    @media (max-width: 768px) {
      padding: 16px;

      h2 {
        margin-bottom: 12px;
        font-size: 1rem;
      }
    }
  }

  &__count {
    color: var(--lenet-text-muted);
    font-weight: 400;
    font-size: 0.95rem;
  }

  &__fields {
    margin: 0;
  }

  &__field {
    & + & {
      margin-top: 14px;
      padding-top: 14px;
      border-top: 1px solid rgba(13, 27, 42, 0.08);
    }

    dt {
      margin-bottom: 4px;
      font-size: 0.78rem;
      color: rgba(13, 27, 42, 0.55);
      text-transform: uppercase;
      letter-spacing: 0.04em;
      font-weight: 700;
    }

    dd {
      margin: 0;
      color: var(--lenet-body-text);
      word-break: break-word;

      a {
        color: var(--lenet-primary);
        text-decoration: none;

        &:hover {
          color: var(--lenet-accent);
        }
      }
    }
  }

  &__message {
    margin: 0;
    white-space: pre-wrap;
    word-break: break-word;
    line-height: 1.6;
    color: var(--lenet-text-muted);
  }

  &__comment-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    margin-bottom: 16px;

    h2 {
      margin: 0;
    }
  }

  &__comment-saved {
    font-size: 0.85rem;
    font-weight: 600;
    color: #2e7d32;
  }

  &__comment-input {
    width: 100%;
    min-height: 120px;
    padding: 12px 14px;
    border: 1px solid rgba(13, 27, 42, 0.12);
    border-radius: 8px;
    background: #f5f7f9;
    color: var(--lenet-body-text);
    font-size: 0.95rem;
    line-height: 1.5;
    resize: vertical;
    font-family: inherit;
    transition:
      border-color 0.2s ease,
      background 0.2s ease,
      box-shadow 0.2s ease;

    &:focus {
      outline: none;
      border-color: var(--lenet-accent);
      background: #fff;
      box-shadow: 0 0 0 3px rgba(255, 183, 3, 0.18);
    }

    &:disabled {
      opacity: 0.7;
      cursor: wait;
    }
  }

  &__comment-actions {
    display: flex;
    justify-content: flex-end;
    margin-top: 12px;
  }

  &__comment-save {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 10px 16px;
    border: none;
    border-radius: 8px;
    background: var(--lenet-accent);
    color: #1a1a1a;
    font-size: 0.9rem;
    font-weight: 700;
    cursor: pointer;
    transition: filter 0.2s ease, opacity 0.2s ease;

    &:hover:not(:disabled) {
      filter: brightness(0.96);
    }

    &:disabled {
      opacity: 0.55;
      cursor: not-allowed;
    }
  }

  &__empty {
    margin: 0;
    color: var(--lenet-text-muted);
  }

  &__files {
    display: grid;
    gap: 20px;
  }
}

.submission-file {
  border: 1px solid rgba(13, 27, 42, 0.08);
  overflow: hidden;
  background: #fff;
  box-shadow: 0 8px 20px -10px rgba(13, 27, 42, 0.1);

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 12px 16px;
    background: var(--lenet-header-bg);
    border-bottom: 1px solid rgba(13, 27, 42, 0.08);

    @media (max-width: 768px) {
      flex-direction: column;
      align-items: flex-start;
    }
  }

  &__name {
    color: var(--lenet-body-text);
    font-size: 0.95rem;
    font-weight: 600;
    word-break: break-all;
  }

  &__download {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    color: var(--lenet-body-text);
    text-decoration: none;
    white-space: nowrap;
    font-size: 0.9rem;
    font-weight: 600;
    transition: color 0.2s ease;

    &:hover {
      color: var(--lenet-accent);
    }
  }

  &__preview {
    padding: 12px;
    background: #fff;

    img {
      display: block;
      max-width: 100%;
      max-height: 480px;
      margin: 0 auto;
    }

    &--pdf iframe {
      display: block;
      width: 100%;
      height: 560px;
      border: none;
      background: #fff;

      @media (max-width: 768px) {
        height: 320px;
      }
    }
  }

  &__fallback {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    padding: 32px 16px;
    color: var(--lenet-text-muted);

    i {
      font-size: 2rem;
      color: var(--lenet-accent);
    }

    a {
      color: var(--lenet-primary);
      text-decoration: none;
      font-weight: 600;

      &:hover {
        color: var(--lenet-accent);
      }
    }
  }
}
</style>

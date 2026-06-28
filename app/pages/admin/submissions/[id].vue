<template>
  <div class="submission-detail">
    <NuxtLink
      to="/admin/submissions"
      class="submission-detail__back">
      <i class="fas fa-arrow-left"></i>
      К списку заявок
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
      <header class="submission-detail__header">
        <h1>Заявка № {{ submission.id }}</h1>
        <p>от {{ formatSubmissionDate(submission.createdAt) }}</p>
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
            v-for="(file, index) in files"
            :key="index"
            class="submission-file">
            <header class="submission-file__header">
              <span class="submission-file__name">{{ file.name }}</span>
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
                :alt="file.name"
                loading="lazy" />
            </div>

            <div
              v-else-if="isPdfFile(file)"
              class="submission-file__preview submission-file__preview--pdf">
              <iframe
                :src="file.path"
                :title="file.name" />
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

definePageMeta({
  layout: 'admin',
  middleware: 'admin',
})

const route = useRoute()
const submissionId = computed(() => String(route.params.id))

const { data, pending, error } = await useFetch<{ success: boolean; data: Submission }>(
  () => `/api/admin/submissions/${submissionId.value}`,
)

const submission = computed(() => data.value?.data ?? null)
const files = computed(() => parseSubmissionFiles(submission.value?.files ?? null))

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
  &__back {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 24px;
    color: #64b5f6;
    text-decoration: none;
    font-size: 0.95rem;

    &:hover {
      text-decoration: underline;
    }

    @media (max-width: 768px) {
      margin-bottom: 16px;
      font-size: 0.9rem;
    }
  }

  &__header {
    margin-bottom: 24px;

    h1 {
      margin: 0 0 6px;
      font-size: 1.75rem;
      color: #e3f2fd;
    }

    p {
      margin: 0;
      color: #94a3b8;
    }

    @media (max-width: 768px) {
      margin-bottom: 16px;

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
    color: #94a3b8;
    background: rgba(30, 41, 59, 0.5);
    border-radius: 12px;
    border: 1px solid rgba(255, 255, 255, 0.06);

    &--error {
      color: #fca5a5;
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
    padding: 20px;
    border-radius: 12px;
    background: rgba(30, 41, 59, 0.6);
    border: 1px solid rgba(255, 255, 255, 0.08);

    &--wide {
      min-width: 0;
    }

    h2 {
      margin: 0 0 16px;
      font-size: 1.1rem;
      color: #e3f2fd;
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
    color: #94a3b8;
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
      border-top: 1px solid rgba(255, 255, 255, 0.06);
    }

    dt {
      margin-bottom: 4px;
      font-size: 0.8rem;
      color: #94a3b8;
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }

    dd {
      margin: 0;
      color: #e2e8f0;
      word-break: break-word;

      a {
        color: #64b5f6;
        text-decoration: none;

        &:hover {
          text-decoration: underline;
        }
      }
    }
  }

  &__message {
    margin: 0;
    white-space: pre-wrap;
    word-break: break-word;
    line-height: 1.6;
    color: #e2e8f0;
  }

  &__empty {
    margin: 0;
    color: #94a3b8;
  }

  &__files {
    display: grid;
    gap: 20px;
  }
}

.submission-file {
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 10px;
  overflow: hidden;
  background: rgba(15, 23, 42, 0.5);

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 12px 16px;
    background: rgba(15, 23, 42, 0.8);
    border-bottom: 1px solid rgba(255, 255, 255, 0.06);

    @media (max-width: 768px) {
      flex-direction: column;
      align-items: flex-start;
    }
  }

  &__name {
    color: #e2e8f0;
    font-size: 0.95rem;
    word-break: break-all;
  }

  &__download {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    color: #64b5f6;
    text-decoration: none;
    white-space: nowrap;
    font-size: 0.9rem;

    &:hover {
      text-decoration: underline;
    }
  }

  &__preview {
    padding: 12px;
    background: rgba(0, 0, 0, 0.2);

    img {
      display: block;
      max-width: 100%;
      max-height: 480px;
      margin: 0 auto;
      border-radius: 6px;
    }

    &--pdf iframe {
      display: block;
      width: 100%;
      height: 560px;
      border: none;
      border-radius: 6px;
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
    color: #94a3b8;

    i {
      font-size: 2rem;
    }

    a {
      color: #64b5f6;
      text-decoration: none;

      &:hover {
        text-decoration: underline;
      }
    }
  }
}
</style>

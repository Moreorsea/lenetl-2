<template>
  <div class="submissions-page">
    <header class="submissions-page__header">
      <div class="submissions-page__header-main">
        <h1>{{ title }}</h1>
        <p>{{ subtitle }}</p>
      </div>
      <SubmissionStatusFilter v-model="statusFilter" />
    </header>

    <div
      v-if="pending"
      class="submissions-page__state">
      Загрузка...
    </div>

    <div
      v-else-if="error"
      class="submissions-page__state submissions-page__state--error">
      Не удалось загрузить заявки
    </div>

    <div
      v-else-if="!submissions.length"
      class="submissions-page__state">
      {{ statusFilter ? 'Нет заявок с выбранным статусом' : emptyText }}
    </div>

    <div
      v-else
      class="submissions-table-wrap submissions-table-wrap--desktop">
      <table class="submissions-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Дата</th>
            <th v-if="deleted">Удалена</th>
            <th>Статус</th>
            <th>Имя</th>
            <th>Телефон</th>
            <th>Email</th>
            <th>Сообщение</th>
            <th>Файлы</th>
            <th />
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="item in submissions"
            :key="item.id"
            class="submissions-table__row"
            @click="openSubmission(item.id)">
            <td>
              <NuxtLink
                :to="`/admin/submissions/${item.id}`"
                class="submissions-table__link"
                @click.stop>
                #{{ item.id }}
              </NuxtLink>
            </td>
            <td>{{ formatSubmissionDate(item.createdAt) }}</td>
            <td v-if="deleted">
              {{ item.deletedAt ? formatSubmissionDate(item.deletedAt) : '—' }}
            </td>
            <td>
              <SubmissionStatusBadge :status="item.status" />
            </td>
            <td>{{ item.name }}</td>
            <td>
              <a
                :href="`tel:${item.phone}`"
                @click.stop>
                {{ item.phone }}
              </a>
            </td>
            <td>
              <a
                :href="`mailto:${item.email}`"
                @click.stop>
                {{ item.email }}
              </a>
            </td>
            <td class="submissions-table__message">{{ item.message }}</td>
            <td>
              <span v-if="getFiles(item.files).length">
                {{ getFiles(item.files).length }}
              </span>
              <span v-else>—</span>
            </td>
            <td
              class="submissions-table__actions"
              @click.stop>
              <button
                type="button"
                class="submissions-table__delete"
                :disabled="isDeleting(item.id) || permanentDeleting"
                aria-label="Удалить заявку"
                @click="handleDelete(item.id)">
                <i
                  class="fas"
                  :class="isDeleting(item.id) ? 'fa-spinner fa-spin' : 'fa-trash-alt'" />
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <ul
      v-if="!pending && !error && submissions.length"
      class="submissions-cards">
      <li
        v-for="item in submissions"
        :key="item.id">
        <article class="submissions-card">
          <div class="submissions-card__top">
            <NuxtLink
              :to="`/admin/submissions/${item.id}`"
              class="submissions-card__id">
              #{{ item.id }}
            </NuxtLink>
            <div class="submissions-card__top-actions">
              <SubmissionStatusBadge :status="item.status" />
              <button
                type="button"
                class="submissions-card__delete"
                :disabled="isDeleting(item.id) || permanentDeleting"
                aria-label="Удалить заявку"
                @click="handleDelete(item.id)">
                <i
                  class="fas"
                  :class="isDeleting(item.id) ? 'fa-spinner fa-spin' : 'fa-trash-alt'" />
              </button>
            </div>
          </div>
          <NuxtLink
            :to="`/admin/submissions/${item.id}`"
            class="submissions-card__link">
            <p class="submissions-card__date">
              {{ formatSubmissionDate(item.createdAt) }}
              <span v-if="deleted && item.deletedAt">
                · удалена {{ formatSubmissionDate(item.deletedAt) }}
              </span>
            </p>
            <p class="submissions-card__name">{{ item.name }}</p>
            <p class="submissions-card__message">{{ item.message }}</p>
            <div class="submissions-card__meta">
              <a
                :href="`tel:${item.phone}`"
                @click.stop>
                <i class="fas fa-phone" />
                {{ item.phone }}
              </a>
              <a
                :href="`mailto:${item.email}`"
                @click.stop>
                <i class="fas fa-envelope" />
                {{ item.email }}
              </a>
              <span v-if="getFiles(item.files).length">
                <i class="fas fa-paperclip" />
                {{ getFiles(item.files).length }}
              </span>
            </div>
          </NuxtLink>
        </article>
      </li>
    </ul>

    <UiConfirmDialog
      :open="confirmOpen"
      title="Вы точно хотите удалить?"
      text="Заявка и её файлы будут удалены навсегда. Но общая информация по заявке сохранится в истории заявок."
      confirm-label="Удалить навсегда"
      :loading="permanentDeleting"
      @confirm="confirmPermanentDelete"
      @cancel="closeConfirm" />
  </div>
</template>

<script lang="ts" setup>
import {
  formatSubmissionDate,
  parseSubmissionFiles,
  type Submission,
} from '#shared/types/submission'
import type { SubmissionStatus } from '#shared/types/submissionStatus'

const props = withDefaults(
  defineProps<{
    title?: string
    subtitle?: string
    emptyText?: string
    deleted?: boolean
  }>(),
  {
    title: 'Заявки',
    subtitle: 'Все заявки с формы обратной связи',
    emptyText: 'Заявок пока нет',
    deleted: false,
  },
)

const statusFilter = ref<SubmissionStatus | null>(null)

const apiUrl = computed(() => {
  const params = new URLSearchParams()
  if (props.deleted) params.set('deleted', 'true')
  if (statusFilter.value) params.set('status', statusFilter.value)
  const query = params.toString()
  return query ? `/api/admin/submissions?${query}` : '/api/admin/submissions'
})

const { data, pending, error } = await useFetch<{ success: boolean; data: Submission[] }>(
  apiUrl,
  { watch: [apiUrl] },
)

const submissions = computed(() => data.value?.data ?? [])
const { isDeleting, softDeleteSubmission, permanentlyDeleteSubmission } = useDeleteSubmission()

const confirmOpen = ref(false)
const permanentDeleting = ref(false)
const pendingPermanentId = ref<number | null>(null)

const getFiles = (files: Submission['files']) => parseSubmissionFiles(files)

const openSubmission = (id: number) => {
  navigateTo(`/admin/submissions/${id}`)
}

const removeFromList = (id: number) => {
  if (!data.value?.data) return

  data.value = {
    ...data.value,
    data: data.value.data.filter((item) => item.id !== id),
  }
}

const handleDelete = async (id: number) => {
  if (props.deleted) {
    pendingPermanentId.value = id
    confirmOpen.value = true
    return
  }

  const removed = await softDeleteSubmission(id)
  if (removed) removeFromList(id)
}

const closeConfirm = () => {
  if (permanentDeleting.value) return
  confirmOpen.value = false
  pendingPermanentId.value = null
}

const confirmPermanentDelete = async () => {
  const id = pendingPermanentId.value
  if (!id) return

  permanentDeleting.value = true

  try {
    const removed = await permanentlyDeleteSubmission(id)
    if (removed) removeFromList(id)
    confirmOpen.value = false
    pendingPermanentId.value = null
  } finally {
    permanentDeleting.value = false
  }
}
</script>

<style lang="scss" scoped>
.submissions-page {
  &__header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 16px;
    margin-bottom: 24px;

    @media (max-width: 768px) {
      flex-direction: column;
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
}

.submissions-table-wrap {
  overflow-x: auto;
  border: 1px solid rgba(13, 27, 42, 0.1);
  background: #fff;
  box-shadow: 0 12px 28px -8px rgba(13, 27, 42, 0.14);

  &--desktop {
    @media (max-width: 768px) {
      display: none;
    }
  }
}

.submissions-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;

  th,
  td {
    padding: 14px 16px;
    text-align: left;
    border-bottom: 1px solid rgba(13, 27, 42, 0.07);
    vertical-align: top;
  }

  th {
    background: var(--lenet-header-bg);
    color: rgba(13, 27, 42, 0.55);
    font-size: 0.82rem;
    font-weight: 700;
    letter-spacing: 0.03em;
    text-transform: uppercase;
    white-space: nowrap;
  }

  td {
    color: var(--lenet-body-text);
  }

  tbody tr:hover,
  &__row:hover {
    background: #fff8e7;
    cursor: pointer;
  }

  &__row {
    transition: background 0.15s ease;
  }

  &__link {
    color: var(--lenet-body-text);
    font-weight: 700;
    text-decoration: none;

    &:hover {
      color: var(--lenet-accent);
    }
  }

  a {
    color: var(--lenet-primary);
    text-decoration: none;

    &:hover {
      color: var(--lenet-accent);
    }
  }

  &__message {
    max-width: 280px;
    white-space: pre-wrap;
    word-break: break-word;
    color: var(--lenet-text-muted);
  }

  &__actions {
    width: 52px;
    text-align: center;
  }

  &__delete {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: auto;
    height: auto;
    padding: 4px;
    border: none;
    background: transparent;
    color: var(--lenet-body-text);
    font-size: 0.95rem;
    cursor: pointer;
    transition: color 0.2s ease, opacity 0.2s ease;

    &:hover:not(:disabled) {
      color: rgba(13, 27, 42, 0.55);
    }

    &:disabled {
      opacity: 0.65;
      cursor: wait;
    }
  }
}

.submissions-cards {
  display: none;
  list-style: none;
  margin: 0;
  padding: 0;

  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
}

.submissions-card {
  background: #fff;
  border: 1px solid rgba(13, 27, 42, 0.08);
  box-shadow: 0 8px 20px -10px rgba(13, 27, 42, 0.12);

  &__top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 14px 16px 0;
  }

  &__link {
    display: block;
    padding: 8px 16px 14px;
    text-decoration: none;
    transition: background 0.15s ease;

    &:active {
      background: #fff8e7;
    }
  }

  &__top-actions {
    display: inline-flex;
    align-items: center;
    gap: 10px;
  }

  &__id {
    font-weight: 700;
    color: var(--lenet-body-text);
    text-decoration: none;

    &:hover {
      color: var(--lenet-accent);
    }
  }

  &__date {
    margin: 0 0 8px;
    font-size: 0.8rem;
    color: var(--lenet-text-muted);
  }

  &__name {
    margin: 0 0 6px;
    font-size: 1rem;
    font-weight: 600;
    color: var(--lenet-body-text);
  }

  &__message {
    margin: 0 0 12px;
    font-size: 0.9rem;
    line-height: 1.45;
    color: var(--lenet-text-muted);
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  &__meta {
    display: flex;
    flex-direction: column;
    gap: 6px;
    font-size: 0.85rem;
    color: var(--lenet-text-muted);

    a,
    span {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      color: var(--lenet-primary);
      text-decoration: none;
      word-break: break-all;
    }

    i {
      width: 14px;
      flex-shrink: 0;
      text-align: center;
    }
  }

  &__delete {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 4px;
    border: none;
    background: transparent;
    color: var(--lenet-body-text);
    font-size: 0.95rem;
    cursor: pointer;
    transition: color 0.2s ease, opacity 0.2s ease;

    &:hover:not(:disabled) {
      color: rgba(13, 27, 42, 0.55);
    }

    &:disabled {
      opacity: 0.65;
      cursor: wait;
    }
  }
}
</style>

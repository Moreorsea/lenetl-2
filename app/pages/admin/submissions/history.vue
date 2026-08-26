<template>
  <div class="history-page">
    <header class="history-page__header">
      <h1>История заявок</h1>
      <p>Общие сведения по заявкам, удалённым навсегда</p>
    </header>

    <div
      v-if="pending"
      class="history-page__state">
      Загрузка...
    </div>

    <div
      v-else-if="error"
      class="history-page__state history-page__state--error">
      Не удалось загрузить историю
    </div>

    <div
      v-else-if="!items.length"
      class="history-page__state">
      История пока пуста
    </div>

    <div
      v-else
      class="history-table-wrap history-table-wrap--desktop">
      <table class="history-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Создана</th>
            <th>Удалена</th>
            <th>Статус</th>
            <th>Имя</th>
            <th>Телефон</th>
            <th>Email</th>
            <th>Сообщение</th>
            <th>Комментарий</th>
            <th>Файлы</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="item in items"
            :key="item.id">
            <td class="history-table__id">#{{ item.originalSubmissionId }}</td>
            <td>{{ formatSubmissionDate(item.submittedAt) }}</td>
            <td>{{ formatSubmissionDate(item.deletedAt) }}</td>
            <td>
              <SubmissionStatusBadge :status="item.status" />
            </td>
            <td>{{ item.name }}</td>
            <td>{{ item.phone }}</td>
            <td>{{ item.email }}</td>
            <td class="history-table__message">{{ item.message }}</td>
            <td class="history-table__message">{{ item.managerComment || '—' }}</td>
            <td>{{ item.filesCount }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <ul
      v-if="!pending && !error && items.length"
      class="history-cards">
      <li
        v-for="item in items"
        :key="item.id"
        class="history-card">
        <div class="history-card__top">
          <span class="history-card__id">#{{ item.originalSubmissionId }}</span>
          <SubmissionStatusBadge :status="item.status" />
        </div>
        <p class="history-card__meta-line">
          Создана {{ formatSubmissionDate(item.submittedAt) }}
        </p>
        <p class="history-card__meta-line">
          Удалена {{ formatSubmissionDate(item.deletedAt) }}
        </p>
        <p class="history-card__name">{{ item.name }}</p>
        <p class="history-card__message">{{ item.message }}</p>
        <p
          v-if="item.managerComment"
          class="history-card__message">
          Комментарий: {{ item.managerComment }}
        </p>
        <p class="history-card__contacts">
          {{ item.phone }} · {{ item.email }}
        </p>
        <p class="history-card__files">
          Файлов было: {{ item.filesCount }}
        </p>
      </li>
    </ul>
  </div>
</template>

<script lang="ts" setup>
import { formatSubmissionDate } from '#shared/types/submission'
import type { SubmissionHistoryItem } from '#shared/types/submissionHistory'

definePageMeta({
  layout: 'admin',
  middleware: 'admin',
  pageTransition: false,
})

const { data, pending, error } = await useFetch<{
  success: boolean
  data: SubmissionHistoryItem[]
}>('/api/admin/submissions/history')

const items = computed(() => data.value?.data ?? [])
</script>

<style lang="scss" scoped>
.history-page {
  &__header {
    margin-bottom: 24px;

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
      margin-bottom: 16px;

      h1 {
        font-size: 1.35rem;
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
  }
}

.history-table-wrap {
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

.history-table {
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

  &__id {
    font-weight: 700;
  }

  &__message {
    max-width: 280px;
    white-space: pre-wrap;
    word-break: break-word;
    color: var(--lenet-text-muted);
  }
}

.history-cards {
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

.history-card {
  padding: 14px 16px;
  background: #fff;
  border: 1px solid rgba(13, 27, 42, 0.08);
  box-shadow: 0 8px 20px -10px rgba(13, 27, 42, 0.12);

  &__top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    margin-bottom: 6px;
  }

  &__id {
    font-weight: 700;
    color: var(--lenet-body-text);
  }

  &__meta-line {
    margin: 0 0 4px;
    font-size: 0.8rem;
    color: var(--lenet-text-muted);
  }

  &__name {
    margin: 10px 0 6px;
    font-size: 1rem;
    font-weight: 600;
    color: var(--lenet-body-text);
  }

  &__message {
    margin: 0 0 10px;
    font-size: 0.9rem;
    line-height: 1.45;
    color: var(--lenet-text-muted);
  }

  &__contacts,
  &__files {
    margin: 0 0 4px;
    font-size: 0.85rem;
    color: var(--lenet-text-muted);
  }
}
</style>

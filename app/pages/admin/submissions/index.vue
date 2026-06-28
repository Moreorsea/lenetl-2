<template>
  <div class="submissions-page">
    <header class="submissions-page__header">
      <h1>Заявки</h1>
      <p>Все заявки с формы обратной связи</p>
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
      Заявок пока нет
    </div>

    <div
      v-else
      class="submissions-table-wrap submissions-table-wrap--desktop">
      <table class="submissions-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Дата</th>
            <th>Имя</th>
            <th>Телефон</th>
            <th>Email</th>
            <th>Сообщение</th>
            <th>Файлы</th>
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
        <NuxtLink
          :to="`/admin/submissions/${item.id}`"
          class="submissions-card">
          <div class="submissions-card__top">
            <span class="submissions-card__id">#{{ item.id }}</span>
            <span class="submissions-card__date">{{ formatSubmissionDate(item.createdAt) }}</span>
          </div>
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
      </li>
    </ul>
  </div>
</template>

<script lang="ts" setup>
import {
  formatSubmissionDate,
  parseSubmissionFiles,
  type Submission,
} from '#shared/types/submission'

definePageMeta({
  layout: 'admin',
  middleware: 'admin',
})

const { data, pending, error } = await useFetch<{ success: boolean; data: Submission[] }>(
  '/api/admin/submissions',
)

const submissions = computed(() => data.value?.data ?? [])

const getFiles = (files: Submission['files']) => parseSubmissionFiles(files)

const openSubmission = (id: number) => {
  navigateTo(`/admin/submissions/${id}`)
}
</script>

<style lang="scss" scoped>
.submissions-page {
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
}

.submissions-table-wrap {
  overflow-x: auto;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(30, 41, 59, 0.6);

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
    padding: 12px 14px;
    text-align: left;
    border-bottom: 1px solid rgba(255, 255, 255, 0.06);
    vertical-align: top;
  }

  th {
    background: rgba(15, 23, 42, 0.8);
    color: #94a3b8;
    font-weight: 600;
    white-space: nowrap;
  }

  td {
    color: #e2e8f0;
  }

  tbody tr:hover,
  &__row:hover {
    background: rgba(100, 181, 246, 0.05);
    cursor: pointer;
  }

  &__row {
    transition: background 0.15s ease;
  }

  &__link {
    color: #64b5f6;
    font-weight: 600;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }

  a {
    color: #64b5f6;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }

  &__message {
    max-width: 280px;
    white-space: pre-wrap;
    word-break: break-word;
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
  display: block;
  padding: 14px 16px;
  border-radius: 12px;
  background: rgba(30, 41, 59, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.08);
  text-decoration: none;
  transition: background 0.15s ease, border-color 0.15s ease;

  &:active {
    background: rgba(100, 181, 246, 0.08);
    border-color: rgba(100, 181, 246, 0.25);
  }

  &__top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    margin-bottom: 8px;
  }

  &__id {
    font-weight: 700;
    color: #64b5f6;
  }

  &__date {
    font-size: 0.8rem;
    color: #94a3b8;
    white-space: nowrap;
  }

  &__name {
    margin: 0 0 6px;
    font-size: 1rem;
    font-weight: 600;
    color: #e3f2fd;
  }

  &__message {
    margin: 0 0 12px;
    font-size: 0.9rem;
    line-height: 1.45;
    color: #cbd5e1;
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
    color: #94a3b8;

    a,
    span {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      color: #64b5f6;
      text-decoration: none;
      word-break: break-all;
    }

    i {
      width: 14px;
      flex-shrink: 0;
      text-align: center;
    }
  }
}
</style>

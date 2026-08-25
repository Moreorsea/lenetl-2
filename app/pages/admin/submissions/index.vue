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
  pageTransition: false,
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
    border-radius: 0;
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
  background: #fff;
  border: 1px solid rgba(13, 27, 42, 0.08);
  box-shadow: 0 8px 20px -10px rgba(13, 27, 42, 0.12);
  text-decoration: none;
  transition: background 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease;

  &:active {
    background: #fff8e7;
    border-color: rgba(255, 183, 3, 0.35);
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
    color: var(--lenet-body-text);
  }

  &__date {
    font-size: 0.8rem;
    color: var(--lenet-text-muted);
    white-space: nowrap;
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
}
</style>

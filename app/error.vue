<template>
  <NuxtLayout name="default">
    <section class="error-page">
      <p class="error-page__code">{{ displayCode }}</p>
      <h1 class="error-page__title">{{ title }}</h1>
      <p class="error-page__lead">{{ lead }}</p>

      <div class="error-page__actions">
        <button
          type="button"
          class="error-page__btn error-page__btn--primary"
          @click="goHome">
          На главную
        </button>
        <NuxtLink
          to="/services"
          class="error-page__btn error-page__btn--ghost"
          @click="clearPageError">
          Смотреть услуги
        </NuxtLink>
      </div>
    </section>
  </NuxtLayout>
</template>

<script lang="ts" setup>
import type { NuxtError } from '#app'

const props = defineProps<{
  error: NuxtError
}>()

const isNotFound = computed(() => props.error?.statusCode === 404)

const displayCode = computed(() => props.error?.statusCode || 404)

const title = computed(() =>
  isNotFound.value ? 'Коротнуло — страницы нет' : 'Что-то пошло не так',
)

const lead = computed(() =>
  isNotFound.value
    ? 'Автомат сработал на несуществующий URL. Главная и услуги на месте — можно идти туда.'
    : 'Произошла ошибка при загрузке. Попробуйте открыть главную или заглянуть в услуги.',
)

const clearPageError = () => {
  clearError()
}

const goHome = () => {
  clearError({ redirect: '/' })
}
</script>

<style lang="scss" scoped>
.error-page {
  --error-font-display: 'Unbounded', 'Segoe UI', sans-serif;
  --error-font-body: 'Manrope', 'Segoe UI', sans-serif;

  position: relative;
  min-height: min(70vh, 640px);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  padding: 48px 0 64px;
  max-width: 640px;

  @media (max-width: 768px) {
    min-height: min(60vh, 520px);
    padding: 28px 0 48px;
  }
}

.error-page__code {
  margin: 0 0 12px;
  font-family: var(--error-font-display);
  font-size: clamp(4.5rem, 14vw, 7.5rem);
  font-weight: 800;
  line-height: 0.9;
  letter-spacing: -0.06em;
  color: var(--lenet-accent);
}

.error-page__title {
  margin: 0 0 14px;
  font-family: var(--error-font-display);
  font-size: clamp(1.6rem, 3.2vw, 2.35rem);
  font-weight: 700;
  line-height: 1.15;
  letter-spacing: -0.03em;
  color: var(--lenet-body-text);
}

.error-page__lead {
  margin: 0 0 32px;
  font-family: var(--error-font-body);
  font-size: clamp(1rem, 1.5vw, 1.12rem);
  font-weight: 500;
  line-height: 1.55;
  color: var(--lenet-text-muted);
}

.error-page__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.error-page__btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 48px;
  padding: 12px 22px;
  font-family: var(--error-font-body);
  font-size: 0.88rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  text-decoration: none;
  border: none;
  cursor: pointer;
  transition:
    transform 0.2s ease,
    filter 0.2s ease,
    background 0.2s ease,
    border-color 0.2s ease,
    color 0.2s ease;

  &--primary {
    background: var(--lenet-accent);
    color: #1a1a1a;

    &:hover {
      filter: brightness(0.96);
      transform: translateY(-1px);
    }
  }

  &--ghost {
    background: transparent;
    color: var(--lenet-body-text);
    border: 1.5px solid rgba(13, 27, 42, 0.22);

    &:hover {
      border-color: rgba(13, 27, 42, 0.45);
      background: rgba(13, 27, 42, 0.04);
      transform: translateY(-1px);
    }
  }

  @media (max-width: 480px) {
    width: 100%;
  }
}
</style>

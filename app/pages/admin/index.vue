<template>
  <div class="admin-login">
    <form
      class="admin-login__card"
      :class="{ 'admin-login__card--loading': isLoading }"
      :aria-busy="isLoading"
      @submit.prevent="handleLogin">
      <h1 class="admin-login__title">Вход в админку</h1>
      <p class="admin-login__subtitle">ЛенЭТЛ — панель управления</p>

      <label class="admin-login__field">
        <span>Логин</span>
        <input
          v-model="login"
          type="text"
          autocomplete="username"
          :disabled="isLoading"
          required />
      </label>

      <div class="admin-login__field">
        <label
          class="admin-login__label"
          for="admin-password">
          Пароль
        </label>
        <div class="admin-login__password">
          <input
            id="admin-password"
            v-model="password"
            :type="isPasswordVisible ? 'text' : 'password'"
            autocomplete="current-password"
            :disabled="isLoading"
            required
            @keydown.enter.prevent="handleLogin" />
          <button
            type="button"
            class="admin-login__password-toggle"
            :disabled="isLoading"
            :aria-label="isPasswordVisible ? 'Скрыть пароль' : 'Показать пароль'"
            @click="isPasswordVisible = !isPasswordVisible">
            <i
              class="fas"
              :class="isPasswordVisible ? 'fa-eye-slash' : 'fa-eye'" />
          </button>
        </div>
      </div>

      <p
        v-if="errorMessage"
        class="admin-login__error">
        {{ errorMessage }}
      </p>

      <button
        type="submit"
        class="admin-login__submit"
        :disabled="isLoading">
        <span
          v-if="isLoading"
          class="admin-login__submit-loading">
          <i class="fas fa-spinner fa-spin" />
          {{ loadingMessage }}
        </span>
        <span v-else>Войти</span>
      </button>

      <div
        v-if="isLoading"
        class="admin-login__overlay"
        aria-live="polite">
        <div class="admin-login__overlay-content">
          <i class="fas fa-spinner fa-spin" />
          <p>{{ loadingMessage }}</p>
        </div>
      </div>
    </form>
  </div>
</template>

<script lang="ts" setup>
definePageMeta({
  layout: false,
})

const login = ref('')
const password = ref('')
const isPasswordVisible = ref(false)
const errorMessage = ref('')
const isLoading = ref(false)
const loadingMessage = ref('Проверяем данные...')

onMounted(async () => {
  try {
    await $fetch('/api/admin/session')
    await navigateTo('/admin/submissions')
  } catch {
    // not logged in
  }
})

const handleLogin = async () => {
  if (isLoading.value) return

  errorMessage.value = ''
  loadingMessage.value = 'Проверяем данные...'
  isLoading.value = true

  try {
    await $fetch('/api/admin/login', {
      method: 'POST',
      body: {
        login: login.value.trim(),
        password: password.value,
      },
    })
    loadingMessage.value = 'Вход выполнен, перенаправляем...'
    await navigateTo('/admin/submissions')
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'data' in error) {
      const data = (error as { data?: { message?: string } }).data
      errorMessage.value = data?.message ?? 'Неверный логин или пароль'
    } else {
      errorMessage.value = 'Не удалось выполнить вход'
    }
    isLoading.value = false
  }
}
</script>

<style lang="scss" scoped>
.admin-login {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: #0f172a;

  @media (max-width: 768px) {
    padding: 16px;
    align-items: flex-start;
    padding-top: 48px;
  }

  &__card {
    position: relative;
    width: 100%;
    max-width: 400px;
    padding: 32px;
    border-radius: 16px;
    background: rgba(30, 41, 59, 0.85);
    border: 1px solid rgba(100, 181, 246, 0.25);
    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.4);
    transition: border-color 0.2s ease;

    &--loading {
      border-color: rgba(100, 181, 246, 0.45);
      pointer-events: none;
    }

    @media (max-width: 768px) {
      padding: 24px 20px;
      border-radius: 14px;
    }
  }

  &__title {
    margin: 0 0 8px;
    font-size: 1.5rem;
    color: #e3f2fd;

    @media (max-width: 768px) {
      font-size: 1.3rem;
    }
  }

  &__subtitle {
    margin: 0 0 28px;
    color: #94a3b8;
    font-size: 0.95rem;

    @media (max-width: 768px) {
      margin-bottom: 22px;
      font-size: 0.9rem;
    }
  }

  &__field {
    display: flex;
    flex-direction: column;
    gap: 6px;
    margin-bottom: 16px;

    span,
    .admin-login__label {
      font-size: 0.85rem;
      color: #cbd5e1;
    }

    input {
      width: 100%;
      padding: 12px 14px;
      border-radius: 10px;
      border: 1px solid rgba(255, 255, 255, 0.12);
      background: rgba(15, 23, 42, 0.8);
      color: #fff;
      font-size: 1rem;

      &:focus {
        outline: none;
        border-color: rgba(100, 181, 246, 0.6);
      }

      &:disabled {
        opacity: 0.65;
        cursor: not-allowed;
      }
    }
  }

  &__label {
    cursor: pointer;
  }

  &__password {
    position: relative;

    input {
      position: relative;
      z-index: 0;
      padding-right: 44px;
    }
  }

  &__password-toggle {
    position: absolute;
    top: 50%;
    right: 10px;
    z-index: 2;
    transform: translateY(-50%);
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border: none;
    border-radius: 8px;
    background: transparent;
    color: #94a3b8;
    cursor: pointer;
    transition: color 0.2s ease, background-color 0.2s ease;

    .fas {
      pointer-events: none;
      font-size: 1rem;
      line-height: 1;
    }

    &:hover {
      color: #e3f2fd;
      background-color: rgba(255, 255, 255, 0.08);
    }

    &:disabled {
      opacity: 0.45;
      cursor: not-allowed;
    }
  }

  &__error {
    margin: 0 0 16px;
    color: #fca5a5;
    font-size: 0.9rem;
  }

  &__submit {
    width: 100%;
    padding: 12px;
    border: none;
    border-radius: 10px;
    background: linear-gradient(135deg, #1976d2, #1565c0);
    color: #fff;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: opacity 0.2s ease, transform 0.2s ease;

    &:hover:not(:disabled) {
      opacity: 0.9;
    }

    &:disabled {
      opacity: 0.85;
      cursor: wait;
    }
  }

  &__submit-loading {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
  }

  &__overlay {
    position: absolute;
    inset: 0;
    z-index: 2;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: inherit;
    background: rgba(15, 23, 42, 0.72);
    backdrop-filter: blur(2px);
    -webkit-backdrop-filter: blur(2px);
  }

  &__overlay-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    padding: 0 24px;
    text-align: center;

    i {
      font-size: 1.75rem;
      color: #64b5f6;
    }

    p {
      margin: 0;
      font-size: 0.95rem;
      font-weight: 500;
      color: #e3f2fd;
      line-height: 1.4;
    }
  }
}
</style>

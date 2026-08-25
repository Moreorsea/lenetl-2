<template>
  <div class="admin-login">
    <AdminLoginNikitosEasterEgg
      :visible="showNikitosEasterEgg"
      :session-key="nikitosSessionKey" />

    <div
      v-if="checkingSession"
      class="admin-login__checking"
      aria-live="polite">
      <i class="fas fa-spinner fa-spin" />
    </div>

    <form
      v-else
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
  pageTransition: false,
})

const login = ref('')
const password = ref('')
const isPasswordVisible = ref(false)
const errorMessage = ref('')
const isLoading = ref(false)
const loadingMessage = ref('Проверяем данные...')
const failedAttempts = ref(0)
const showNikitosEasterEgg = ref(false)
const nikitosSessionKey = ref(0)
const checkingSession = ref(true)

const requestFetch = useRequestFetch()

try {
  await requestFetch('/api/admin/session')
  await navigateTo('/admin/submissions')
} catch {
  checkingSession.value = false
}

let nikitosHideTimer: ReturnType<typeof setTimeout> | undefined

const triggerNikitosEasterEgg = () => {
  nikitosSessionKey.value += 1
  showNikitosEasterEgg.value = true

  if (nikitosHideTimer) {
    clearTimeout(nikitosHideTimer)
  }

  nikitosHideTimer = setTimeout(() => {
    showNikitosEasterEgg.value = false
  }, 7000)
}

onUnmounted(() => {
  if (nikitosHideTimer) {
    clearTimeout(nikitosHideTimer)
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
    failedAttempts.value += 1

    if (failedAttempts.value >= 3) {
      triggerNikitosEasterEgg()
    }

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
  background: var(--lenet-header-bg);

  @media (max-width: 768px) {
    min-height: 100dvh;
    padding: 16px;
  }

  &__checking {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 120px;
    color: var(--lenet-text-muted);

    i {
      font-size: 1.75rem;
      color: var(--lenet-accent);
    }
  }

  &__card {
    position: relative;
    width: 100%;
    max-width: 420px;
    padding: 36px 32px;
    border-radius: 0;
    background: #fff;
    border: 1px solid rgba(13, 27, 42, 0.08);
    box-shadow: 0 12px 28px -8px rgba(13, 27, 42, 0.14);
    transition: border-color 0.2s ease;

    &--loading {
      border-color: rgba(255, 183, 3, 0.45);
      pointer-events: none;
    }

    @media (max-width: 768px) {
      padding: 24px 20px;
    }
  }

  &__title {
    margin: 0 0 8px;
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--lenet-body-text);

    @media (max-width: 768px) {
      font-size: 1.3rem;
    }
  }

  &__subtitle {
    margin: 0 0 28px;
    color: var(--lenet-text-muted);
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
      font-weight: 600;
      color: var(--lenet-body-text);
    }

    input {
      width: 100%;
      padding: 12px 14px;
      border-radius: 6px;
      border: 1px solid rgba(13, 27, 42, 0.12);
      background: #f5f7f9;
      color: var(--lenet-body-text);
      font-size: 1rem;
      transition: border-color 0.2s ease, background 0.2s ease, box-shadow 0.2s ease;

      &:focus {
        outline: none;
        border-color: var(--lenet-accent);
        background: #fff;
        box-shadow: 0 0 0 3px rgba(255, 183, 3, 0.18);
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
    border-radius: 6px;
    background: transparent;
    color: var(--lenet-text-muted);
    cursor: pointer;
    transition: color 0.2s ease, background-color 0.2s ease;

    .fas {
      pointer-events: none;
      font-size: 1rem;
      line-height: 1;
    }

    &:hover {
      color: var(--lenet-body-text);
      background-color: rgba(13, 27, 42, 0.06);
    }

    &:disabled {
      opacity: 0.45;
      cursor: not-allowed;
    }
  }

  &__error {
    margin: 0 0 16px;
    padding: 10px 12px;
    color: #c62828;
    font-size: 0.9rem;
    background: rgba(198, 40, 40, 0.08);
    border: 1px solid rgba(198, 40, 40, 0.18);
    border-radius: 6px;
  }

  &__submit {
    width: 100%;
    padding: 12px;
    border: none;
    border-radius: 6px;
    background: var(--lenet-accent);
    color: #1a1a1a;
    font-size: 0.95rem;
    font-weight: 700;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    cursor: pointer;
    transition: filter 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease;

    &:hover:not(:disabled) {
      filter: brightness(0.96);
      box-shadow: 0 8px 20px rgba(255, 183, 3, 0.35);
      transform: translateY(-1px);
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
    background: rgba(255, 255, 255, 0.72);
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
      color: var(--lenet-accent);
    }

    p {
      margin: 0;
      font-size: 0.95rem;
      font-weight: 500;
      color: var(--lenet-body-text);
      line-height: 1.4;
    }
  }
}
</style>

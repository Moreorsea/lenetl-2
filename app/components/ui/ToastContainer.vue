<template>
  <Teleport to="body">
    <div
      class="toast-container"
      aria-live="polite"
      aria-atomic="true">
      <TransitionGroup name="toast">
        <div
          v-for="toast in toasts"
          :key="toast.id"
          class="toast"
          :class="`toast--${toast.type}`"
          role="status">
          <i
            class="fas toast__icon"
            :class="iconClass(toast.type)" />
          <p class="toast__message">{{ toast.message }}</p>
          <button
            type="button"
            class="toast__close"
            aria-label="Закрыть"
            @click="dismissToast(toast.id)">
            <i class="fas fa-times"></i>
          </button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script lang="ts" setup>
import type { ToastType } from '../composables/useToast'

const { toasts, dismissToast } = useToast()

const iconClass = (type: ToastType) => {
  if (type === 'success') return 'fa-check-circle'
  if (type === 'error') return 'fa-exclamation-circle'
  return 'fa-info-circle'
}
</script>

<style lang="scss" scoped>
.toast-container {
  position: fixed;
  top: 24px;
  right: 24px;
  z-index: 2000;
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: min(420px, calc(100vw - 32px));
  pointer-events: none;
}

.toast {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 14px 16px;
  border-radius: 12px;
  pointer-events: auto;
  background: rgba(40, 40, 60, 0.22);
  backdrop-filter: blur(20px) saturate(160%);
  -webkit-backdrop-filter: blur(20px) saturate(160%);
  border: 1px solid rgba(255, 255, 255, 0.14);
  box-shadow:
    0 12px 40px rgba(0, 0, 0, 0.35),
    inset 0 0 0 1px rgba(255, 255, 255, 0.06);
  color: #e3f2fd;

  &--success {
    border-color: rgba(100, 181, 246, 0.45);

    .toast__icon {
      color: #81c784;
    }
  }

  &--error {
    border-color: rgba(239, 83, 80, 0.45);

    .toast__icon {
      color: #ef5350;
    }
  }

  &--info {
    border-color: rgba(100, 181, 246, 0.35);

    .toast__icon {
      color: #64b5f6;
    }
  }

  &__icon {
    margin-top: 2px;
    font-size: 1.1rem;
    flex-shrink: 0;
  }

  &__message {
    flex: 1;
    margin: 0;
    line-height: 1.45;
    font-size: 0.95rem;
  }

  &__close {
    flex-shrink: 0;
    width: 28px;
    height: 28px;
    border: none;
    border-radius: 8px;
    background: transparent;
    color: #94a3b8;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
      color: #e3f2fd;
      background: rgba(255, 255, 255, 0.08);
    }
  }
}

.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateX(24px);
}

.toast-move {
  transition: transform 0.3s ease;
}
</style>

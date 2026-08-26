<template>
  <Teleport to="body">
    <Transition name="confirm-fade">
      <div
        v-if="open"
        class="confirm-dialog"
        role="dialog"
        aria-modal="true"
        :aria-labelledby="titleId"
        @click.self="onCancel">
        <div class="confirm-dialog__card">
          <div class="confirm-dialog__icon">
            <i class="fas fa-exclamation-triangle" />
          </div>
          <h2
            :id="titleId"
            class="confirm-dialog__title">
            {{ title }}
          </h2>
          <p class="confirm-dialog__text">
            {{ text }}
          </p>
          <div class="confirm-dialog__actions">
            <button
              type="button"
              class="confirm-dialog__btn confirm-dialog__btn--danger"
              :disabled="loading"
              @click="onConfirm">
              <i
                v-if="loading"
                class="fas fa-spinner fa-spin" />
              {{ confirmLabel }}
            </button>
            <button
              type="button"
              class="confirm-dialog__btn confirm-dialog__btn--ghost"
              :disabled="loading"
              @click="onCancel">
              Отмена
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script lang="ts" setup>
const props = withDefaults(
  defineProps<{
    open: boolean
    title?: string
    text: string
    confirmLabel?: string
    loading?: boolean
  }>(),
  {
    title: 'Подтвердите действие',
    confirmLabel: 'Удалить',
    loading: false,
  },
)

const emit = defineEmits<{
  confirm: []
  cancel: []
}>()

const titleId = `confirm-dialog-title-${Math.random().toString(36).slice(2, 8)}`

const onConfirm = () => {
  if (props.loading) return
  emit('confirm')
}

const onCancel = () => {
  if (props.loading) return
  emit('cancel')
}

const onKeydown = (event: KeyboardEvent) => {
  if (!props.open) return
  if (event.key === 'Escape') onCancel()
}

onMounted(() => {
  document.addEventListener('keydown', onKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', onKeydown)
})
</script>

<style lang="scss" scoped>
.confirm-dialog {
  position: fixed;
  inset: 0;
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: rgba(13, 27, 42, 0.45);
  backdrop-filter: blur(3px);
  -webkit-backdrop-filter: blur(3px);
}

.confirm-dialog__card {
  width: min(100%, 440px);
  padding: 28px 24px 22px;
  background: #fff;
  border: 1px solid rgba(13, 27, 42, 0.08);
  box-shadow: 0 24px 60px -20px rgba(13, 27, 42, 0.45);
  text-align: center;
}

.confirm-dialog__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 52px;
  height: 52px;
  margin-bottom: 16px;
  border-radius: 50%;
  background: rgba(198, 40, 40, 0.08);
  color: #c62828;
  font-size: 1.35rem;
}

.confirm-dialog__title {
  margin: 0 0 10px;
  font-size: 1.2rem;
  font-weight: 800;
  color: var(--lenet-body-text);
}

.confirm-dialog__text {
  margin: 0 0 24px;
  color: var(--lenet-text-muted);
  font-size: 0.95rem;
  line-height: 1.55;
}

.confirm-dialog__actions {
  display: flex;
  gap: 10px;
  justify-content: center;
  flex-wrap: wrap;
}

.confirm-dialog__btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-width: 120px;
  padding: 11px 18px;
  border-radius: 8px;
  border: 1px solid transparent;
  font-size: 0.9rem;
  font-weight: 700;
  cursor: pointer;
  transition:
    background 0.2s ease,
    border-color 0.2s ease,
    color 0.2s ease,
    opacity 0.2s ease;

  &:disabled {
    opacity: 0.7;
    cursor: wait;
  }

  &--ghost {
    background: #fff;
    border-color: rgba(13, 27, 42, 0.12);
    color: var(--lenet-body-text);

    &:hover:not(:disabled) {
      background: var(--lenet-header-bg);
    }
  }

  &--danger {
    background: #c62828;
    color: #fff;

    &:hover:not(:disabled) {
      background: #b71c1c;
    }
  }
}

.confirm-fade-enter-active,
.confirm-fade-leave-active {
  transition: opacity 0.2s ease;

  .confirm-dialog__card {
    transition: transform 0.2s ease, opacity 0.2s ease;
  }
}

.confirm-fade-enter-from,
.confirm-fade-leave-to {
  opacity: 0;

  .confirm-dialog__card {
    opacity: 0;
    transform: translateY(8px) scale(0.98);
  }
}
</style>

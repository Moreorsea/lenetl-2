<template>
  <div
    ref="rootRef"
    class="submission-status-select"
    :class="{ 'submission-status-select--open': isOpen, 'submission-status-select--saving': saving }">
    <button
      type="button"
      class="submission-status-select__trigger"
      :disabled="disabled || saving"
      :aria-expanded="isOpen"
      aria-haspopup="listbox"
      @click.stop="toggle">
      <span
        class="submission-status-select__dot"
        :style="{ background: currentStyle.text }" />
      <span class="submission-status-select__label">
        {{ SUBMISSION_STATUS_LABELS[modelValue] }}
      </span>
      <i
        class="fas submission-status-select__chevron"
        :class="saving ? 'fa-spinner fa-spin' : 'fa-chevron-down'"
        aria-hidden="true" />
    </button>

    <Transition name="status-menu">
      <ul
        v-if="isOpen"
        class="submission-status-select__menu"
        role="listbox"
        @click.stop>
        <li
          v-for="status in SUBMISSION_STATUSES"
          :key="status"
          role="option"
          :aria-selected="status === modelValue">
          <button
            type="button"
            class="submission-status-select__option"
            :class="{ 'submission-status-select__option--active': status === modelValue }"
            @click="select(status)">
            <span
              class="submission-status-select__dot"
              :style="{ background: getSubmissionStatusStyle(status).text }" />
            <span class="submission-status-select__option-label">
              {{ SUBMISSION_STATUS_LABELS[status] }}
            </span>
            <i
              v-if="status === modelValue"
              class="fas fa-check submission-status-select__check"
              aria-hidden="true" />
          </button>
        </li>
      </ul>
    </Transition>
  </div>
</template>

<script lang="ts" setup>
import {
  SUBMISSION_STATUSES,
  SUBMISSION_STATUS_LABELS,
  getSubmissionStatusStyle,
  type SubmissionStatus,
} from '#shared/types/submissionStatus'

const props = defineProps<{
  modelValue: SubmissionStatus
  disabled?: boolean
  saving?: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: SubmissionStatus]
}>()

const isOpen = ref(false)
const rootRef = ref<HTMLElement | null>(null)

const currentStyle = computed(() => getSubmissionStatusStyle(props.modelValue))
const currentTextColor = computed(() => currentStyle.value.text)

const toggle = () => {
  if (props.disabled || props.saving) return
  isOpen.value = !isOpen.value
}

const close = () => {
  isOpen.value = false
}

const select = (status: SubmissionStatus) => {
  if (status !== props.modelValue) {
    emit('update:modelValue', status)
  }
  close()
}

const onDocumentClick = (event: MouseEvent) => {
  if (!rootRef.value?.contains(event.target as Node)) {
    close()
  }
}

const onDocumentKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    close()
  }
}

onMounted(() => {
  document.addEventListener('click', onDocumentClick)
  document.addEventListener('keydown', onDocumentKeydown)
})

onUnmounted(() => {
  document.removeEventListener('click', onDocumentClick)
  document.removeEventListener('keydown', onDocumentKeydown)
})

watch(
  () => props.saving,
  (saving) => {
    if (saving) close()
  },
)
</script>

<style lang="scss" scoped>
.submission-status-select {
  position: relative;
  min-width: 210px;
  max-width: 100%;

  &--open {
    .submission-status-select__trigger {
      border-color: rgba(255, 183, 3, 0.55);
      box-shadow: 0 0 0 3px rgba(255, 183, 3, 0.16);
    }

    .submission-status-select__chevron {
      transform: rotate(180deg);
    }
  }

  &--saving {
    .submission-status-select__trigger {
      opacity: 0.85;
    }
  }

  &__trigger {
    display: flex;
    align-items: center;
    gap: 10px;
    width: 100%;
    padding: 10px 14px;
    border: 1px solid rgba(13, 27, 42, 0.12);
    border-radius: 8px;
    background: #fff;
    color: var(--lenet-body-text);
    font-size: 0.92rem;
    font-weight: 600;
    cursor: pointer;
    transition:
      border-color 0.2s ease,
      box-shadow 0.2s ease,
      background 0.2s ease;

    &:hover:not(:disabled) {
      border-color: rgba(13, 27, 42, 0.2);
      background: #fafbfc;
    }

    &:focus-visible {
      outline: none;
      border-color: rgba(255, 183, 3, 0.55);
      box-shadow: 0 0 0 3px rgba(255, 183, 3, 0.16);
    }

    &:disabled {
      cursor: wait;
    }
  }

  &__label {
    flex: 1;
    text-align: left;
    color: v-bind(currentTextColor);
  }

  &__dot {
    width: 9px;
    height: 9px;
    border-radius: 50%;
    flex-shrink: 0;
  }

  &__chevron {
    font-size: 0.72rem;
    color: var(--lenet-text-muted);
    transition: transform 0.2s ease;
  }

  &__menu {
    position: absolute;
    top: calc(100% + 8px);
    left: 0;
    right: 0;
    z-index: 20;
    margin: 0;
    padding: 6px;
    list-style: none;
    background: #fff;
    border: 1px solid rgba(13, 27, 42, 0.1);
    border-radius: 10px;
    box-shadow: 0 16px 36px -12px rgba(13, 27, 42, 0.22);
  }

  &__option {
    display: flex;
    align-items: center;
    gap: 10px;
    width: 100%;
    padding: 10px 12px;
    border: none;
    border-radius: 7px;
    background: transparent;
    cursor: pointer;
    transition: background 0.15s ease;

    &:hover {
      background: var(--lenet-header-bg);
    }

    &--active {
      background: #fff8e7;
    }
  }

  &__option-label {
    flex: 1;
    text-align: left;
    font-size: 0.9rem;
    font-weight: 600;
    color: var(--lenet-body-text);
  }

  &__check {
    font-size: 0.78rem;
    color: var(--lenet-accent);
  }

  @media (max-width: 768px) {
    min-width: 100%;

    &__trigger {
      padding: 9px 12px;
      font-size: 0.88rem;
    }
  }
}

.status-menu-enter-active,
.status-menu-leave-active {
  transition:
    opacity 0.18s ease,
    transform 0.18s ease;
}

.status-menu-enter-from,
.status-menu-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
</style>

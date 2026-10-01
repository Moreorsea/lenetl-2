<template>
  <div
    ref="rootRef"
    class="status-filter"
    :class="{ 'status-filter--open': isOpen, 'status-filter--active': Boolean(modelValue) }">
    <button
      type="button"
      class="status-filter__trigger"
      :aria-expanded="isOpen"
      aria-haspopup="listbox"
      @click="toggle">
      <i class="fas fa-filter" aria-hidden="true" />
      <span>{{ triggerLabel }}</span>
      <i
        class="fas fa-chevron-down status-filter__chevron"
        aria-hidden="true" />
    </button>

    <Transition name="status-filter-menu">
      <ul
        v-if="isOpen"
        class="status-filter__menu"
        role="listbox">
        <li role="option">
          <button
            type="button"
            class="status-filter__option"
            :class="{ 'status-filter__option--active': !modelValue }"
            @click="select(null)">
            Все статусы
          </button>
        </li>
        <li
          v-for="status in SUBMISSION_STATUSES"
          :key="status"
          role="option">
          <button
            type="button"
            class="status-filter__option"
            :class="{ 'status-filter__option--active': modelValue === status }"
            @click="select(status)">
            <span
              class="status-filter__dot"
              :style="{ background: getSubmissionStatusStyle(status).text }" />
            {{ SUBMISSION_STATUS_LABELS[status] }}
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
  modelValue: SubmissionStatus | null
}>()

const emit = defineEmits<{
  'update:modelValue': [value: SubmissionStatus | null]
}>()

const isOpen = ref(false)
const rootRef = ref<HTMLElement | null>(null)

const triggerLabel = computed(() =>
  props.modelValue ? SUBMISSION_STATUS_LABELS[props.modelValue] : 'Фильтр по статусу',
)

const toggle = () => {
  isOpen.value = !isOpen.value
}

const select = (status: SubmissionStatus | null) => {
  emit('update:modelValue', status)
  isOpen.value = false
}

const onDocumentClick = (event: MouseEvent) => {
  if (!rootRef.value?.contains(event.target as Node)) {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', onDocumentClick)
})

onUnmounted(() => {
  document.removeEventListener('click', onDocumentClick)
})
</script>

<style lang="scss" scoped>
.status-filter {
  position: relative;
  min-width: 210px;

  &--open,
  &--active {
    .status-filter__trigger {
      border-color: rgba(255, 183, 3, 0.55);
      box-shadow: 0 0 0 3px rgba(255, 183, 3, 0.14);
    }
  }

  &--open .status-filter__chevron {
    transform: rotate(180deg);
  }

  &__trigger {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    width: 100%;
    padding: 10px 14px;
    border: 1px solid rgba(13, 27, 42, 0.12);
    border-radius: 8px;
    background: #fff;
    color: var(--lenet-body-text);
    font-size: 0.9rem;
    font-weight: 600;
    cursor: pointer;
    transition:
      border-color 0.2s ease,
      box-shadow 0.2s ease,
      background 0.2s ease;

    &:hover {
      background: #fafbfc;
      border-color: rgba(13, 27, 42, 0.2);
    }

    span {
      flex: 1;
      text-align: left;
    }
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
    z-index: 30;
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
    color: var(--lenet-body-text);
    font-size: 0.9rem;
    font-weight: 600;
    cursor: pointer;
    text-align: left;
    transition: background 0.15s ease;

    &:hover {
      background: var(--lenet-header-bg);
    }

    &--active {
      background: #fff8e7;
    }
  }

  &__dot {
    width: 9px;
    height: 9px;
    border-radius: 50%;
    flex-shrink: 0;
  }

  @media (max-width: 768px) {
    width: 100%;
    min-width: 0;
  }
}

.status-filter-menu-enter-active,
.status-filter-menu-leave-active {
  transition: opacity 0.18s ease, transform 0.18s ease;
}

.status-filter-menu-enter-from,
.status-filter-menu-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
</style>

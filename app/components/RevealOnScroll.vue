<template>
  <div
    ref="root"
    class="reveal"
    :class="{ 'reveal--visible': isVisible }"
    :style="delayStyle">
    <slot />
  </div>
</template>

<script lang="ts" setup>
const props = withDefaults(
  defineProps<{
    delay?: number;
    once?: boolean;
  }>(),
  {
    delay: 0,
    once: true,
  },
);

const root = ref<HTMLElement | null>(null);
const isVisible = ref(false);

const delayStyle = computed(() =>
  props.delay > 0 ? { transitionDelay: `${props.delay}ms` } : undefined,
);

onMounted(() => {
  const node = root.value;
  if (!node || typeof window === 'undefined') return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    isVisible.value = true;
    return;
  }

  const observer = new IntersectionObserver(
    ([entry]) => {
      if (!entry?.isIntersecting) return;
      isVisible.value = true;
      if (props.once) observer.unobserve(node);
    },
    {
      threshold: 0.14,
      rootMargin: '0px 0px -8% 0px',
    },
  );

  observer.observe(node);
  onBeforeUnmount(() => observer.disconnect());
});
</script>

<style lang="scss" scoped>
.reveal {
  opacity: 0;
  transform: translateY(28px);
  transition:
    opacity 0.7s cubic-bezier(0.22, 1, 0.36, 1),
    transform 0.7s cubic-bezier(0.22, 1, 0.36, 1);
  will-change: opacity, transform;

  &--visible {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (prefers-reduced-motion: reduce) {
  .reveal {
    opacity: 1;
    transform: none;
    transition: none;
  }
}
</style>

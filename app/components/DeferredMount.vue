<template>
  <div
    ref="root"
    class="deferred-mount"
    :style="rootStyle">
    <slot v-if="isActive" />
    <div
      v-else
      class="deferred-mount__placeholder"
      aria-hidden="true" />
  </div>
</template>

<script lang="ts" setup>
const props = withDefaults(
  defineProps<{
    /** Минимальная высота плейсхолдера до подгрузки */
    minHeight?: string
    /** Заранее подгружать при приближении к вьюпорту */
    rootMargin?: string
    /** Если hash совпадает — сразу монтировать (для /#form и т.п.) */
    hash?: string
  }>(),
  {
    minHeight: '320px',
    rootMargin: '280px 0px',
    hash: undefined,
  },
)

const route = useRoute()
const root = ref<HTMLElement | null>(null)
const isActive = ref(false)

const rootStyle = computed(() =>
  isActive.value || !props.minHeight ? undefined : { minHeight: props.minHeight },
)

const activate = async (scrollToHash = false) => {
  if (isActive.value) {
    if (scrollToHash && props.hash) {
      await nextTick()
      document.querySelector(props.hash)?.scrollIntoView()
    }
    return
  }

  isActive.value = true

  if (scrollToHash && props.hash) {
    await nextTick()
    // Дать Lazy-компоненту дорендериться
    requestAnimationFrame(() => {
      document.querySelector(props.hash!)?.scrollIntoView({ behavior: 'smooth' })
    })
  }
}

const shouldActivateByHash = () => {
  if (!props.hash || typeof window === 'undefined') return false
  return route.hash === props.hash || window.location.hash === props.hash
}

onMounted(() => {
  if (shouldActivateByHash()) {
    void activate(true)
    return
  }

  const node = root.value
  if (!node) return

  const observer = new IntersectionObserver(
    ([entry]) => {
      if (!entry?.isIntersecting) return
      void activate()
      observer.disconnect()
    },
    {
      root: null,
      rootMargin: props.rootMargin,
      threshold: 0.01,
    },
  )

  observer.observe(node)
  onBeforeUnmount(() => observer.disconnect())
})

watch(
  () => route.hash,
  (hash) => {
    if (props.hash && hash === props.hash) void activate(true)
  },
)
</script>

<style lang="scss" scoped>
.deferred-mount {
  width: 100%;
}

.deferred-mount__placeholder {
  width: 100%;
  min-height: inherit;
}
</style>

<template>
  <section
    class="equipment-slider"
    :class="{
      'equipment-slider--ready': isReady,
      'equipment-slider--loading': !isReady,
    }">
    <div
      v-if="!isReady"
      class="equipment-slider__skeleton"
      aria-hidden="true">
      <div class="equipment-slider__skeleton-card" />
      <div class="equipment-slider__skeleton-card equipment-slider__skeleton-card--side" />
      <div class="equipment-slider__skeleton-card equipment-slider__skeleton-card--side" />
    </div>

    <button
      v-if="isReady && !isMobile"
      type="button"
      class="equipment-slider__nav equipment-slider__nav--prev"
      aria-label="Предыдущий слайд"
      @click="prev">
      <i class="fas fa-chevron-left"></i>
    </button>

    <div
      ref="stageRef"
      class="equipment-slider__stage">
      <div
        class="equipment-slider__viewport"
        :aria-hidden="!isReady"
        @touchstart.passive="onTouchStart"
        @touchmove.passive="onTouchMove"
        @touchend="onTouchEnd"
        @touchcancel="onTouchEnd">
      <div
        class="equipment-slider__track"
        :class="{ 'equipment-slider__track--instant': !isTransitionEnabled }"
        :style="trackStyle"
        @transitionend="onTransitionEnd">
        <div
          v-for="(card, index) in extendedCards"
          :key="`equipment-slide-${index}-${card.name}`"
          class="equipment-slider__slide"
          :style="slideStyle">
          <article class="equipment-card">
            <div class="card-image">
              <NuxtImg
                :src="card.src"
                :alt="card.alt"
                format="webp" />
            </div>
            <div class="card-content">
              <div class="card-description">{{ card.description }}</div>
              <div class="card-name">{{ card.name }}</div>
            </div>
          </article>
        </div>
      </div>
      </div>
    </div>

    <button
      v-if="isReady && !isMobile"
      type="button"
      class="equipment-slider__nav equipment-slider__nav--next"
      aria-label="Следующий слайд"
      @click="next">
      <i class="fas fa-chevron-right"></i>
    </button>
  </section>
</template>

<script lang="ts" setup>
type EquipmentCard = {
  name: string
  src: string
  alt: string
  description: string
}

const props = defineProps<{
  cards: EquipmentCard[]
}>()

const CLONE_COUNT = 3
const GAP = 24
const SWIPE_THRESHOLD = 50
const DESKTOP_BREAKPOINT = 769

const stageRef = ref<HTMLElement | null>(null)
const viewportWidth = ref(0)
const slidesPerView = ref(
  import.meta.client && window.innerWidth >= DESKTOP_BREAKPOINT ? 3 : 1,
)
const currentIndex = ref(CLONE_COUNT)
const isTransitionEnabled = ref(true)
const isReady = ref(false)
const isMobile = ref(
  import.meta.client ? window.innerWidth < DESKTOP_BREAKPOINT : false,
)
const dragOffset = ref(0)

let touchStartX = 0
let touchDeltaX = 0
let isTouching = false

const extendedCards = computed(() => {
  const items = props.cards
  if (!items.length) return []

  const cloneCount = Math.min(CLONE_COUNT, items.length)
  const before = items.slice(-cloneCount)
  const after = items.slice(0, cloneCount)

  return [...before, ...items, ...after]
})

const slideWidth = computed(() => {
  if (!viewportWidth.value) return 0
  const spv = slidesPerView.value
  return (viewportWidth.value - GAP * (spv - 1)) / spv
})

const step = computed(() => slideWidth.value + GAP)

const trackStyle = computed(() => {
  if (!isReady.value || !slideWidth.value) {
    return { gap: `${GAP}px`, transform: 'translateX(0)' }
  }

  const baseOffset = currentIndex.value * step.value
  const dragPx = isTouching ? dragOffset.value : 0

  return {
    gap: `${GAP}px`,
    transform: `translateX(${dragPx - baseOffset}px)`,
  }
})

const slideStyle = computed(() => {
  if (!slideWidth.value) return undefined
  return { width: `${slideWidth.value}px` }
})

const markReady = () => {
  if (isReady.value || viewportWidth.value <= 0) return
  normalizeIndex()
  isReady.value = true
}

const initSlider = () => {
  updateSlidesPerView()
  updateViewportWidth()
  markReady()
}

const updateSlidesPerView = () => {
  const mobile = window.innerWidth < DESKTOP_BREAKPOINT
  isMobile.value = mobile
  slidesPerView.value = mobile ? 1 : 3
}

const normalizeIndex = () => {
  const total = props.cards.length
  if (!total) return

  const cloneCount = Math.min(CLONE_COUNT, total)
  const minIndex = cloneCount
  const maxIndex = cloneCount + total - 1

  if (currentIndex.value > maxIndex) {
    currentIndex.value = minIndex
  } else if (currentIndex.value < minIndex) {
    currentIndex.value = maxIndex
  }
}

const updateViewportWidth = () => {
  const width = stageRef.value?.clientWidth ?? 0
  viewportWidth.value = width > 0 ? width : 0
}

const disableTransition = () => {
  isTransitionEnabled.value = false
}

const enableTransition = () => {
  requestAnimationFrame(() => {
    isTransitionEnabled.value = true
  })
}

const onTransitionEnd = () => {
  const total = props.cards.length
  if (!total) return

  const cloneCount = Math.min(CLONE_COUNT, total)
  const minIndex = cloneCount
  const maxIndex = cloneCount + total

  if (currentIndex.value >= maxIndex) {
    disableTransition()
    currentIndex.value = minIndex
    enableTransition()
  } else if (currentIndex.value < minIndex) {
    disableTransition()
    currentIndex.value = maxIndex - 1
    enableTransition()
  }
}

const next = () => {
  if (!props.cards.length) return
  currentIndex.value += 1
}

const prev = () => {
  if (!props.cards.length) return
  currentIndex.value -= 1
}

const onTouchStart = (event: TouchEvent) => {
  if (!isMobile.value) return

  isTouching = true
  touchStartX = event.touches[0]?.clientX ?? 0
  touchDeltaX = 0
  dragOffset.value = 0
  disableTransition()
}

const onTouchMove = (event: TouchEvent) => {
  if (!isMobile.value || !isTouching) return

  const currentX = event.touches[0]?.clientX ?? touchStartX
  touchDeltaX = currentX - touchStartX
  dragOffset.value = touchDeltaX
}

const onTouchEnd = () => {
  if (!isMobile.value || !isTouching) return

  const delta = touchDeltaX
  isTouching = false
  dragOffset.value = 0
  touchStartX = 0
  touchDeltaX = 0

  if (delta > SWIPE_THRESHOLD) {
    enableTransition()
    prev()
  } else if (delta < -SWIPE_THRESHOLD) {
    enableTransition()
    next()
  } else {
    enableTransition()
  }
}

let resizeObserver: ResizeObserver | null = null

const onWindowResize = () => {
  updateSlidesPerView()
  updateViewportWidth()
  normalizeIndex()
}

onMounted(() => {
  nextTick(() => {
    initSlider()
    requestAnimationFrame(initSlider)
  })

  resizeObserver = new ResizeObserver(() => {
    updateSlidesPerView()
    updateViewportWidth()
    markReady()
  })

  if (stageRef.value) {
    resizeObserver.observe(stageRef.value)
  }

  window.addEventListener('resize', onWindowResize)
})

onUnmounted(() => {
  resizeObserver?.disconnect()
  window.removeEventListener('resize', onWindowResize)
})
</script>

<style lang="scss" scoped>
.equipment-slider {
  position: relative;
  width: 100%;
  min-width: 0;
  margin-bottom: 60px;

  &--loading {
    display: block;
    min-height: 400px;
  }

  &--ready {
    display: flex;
    align-items: center;
    gap: 12px;

    @media (max-width: 768px) {
      display: block;
    }
  }

  &__skeleton {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 24px;
    width: 100%;

    @media (max-width: 768px) {
      grid-template-columns: minmax(0, 1fr);
    }
  }

  &__skeleton-card {
    min-height: 380px;
    border-radius: 15px;
    border: 1px solid rgba(100, 181, 246, 0.2);
    background: linear-gradient(
      110deg,
      rgba(13, 20, 70, 0.55) 25%,
      rgba(25, 118, 210, 0.2) 50%,
      rgba(13, 20, 70, 0.55) 75%
    );
    background-size: 200% 100%;
    animation: equipment-slider-shimmer 1.4s ease-in-out infinite;

    &--side {
      @media (max-width: 768px) {
        display: none;
      }
    }
  }

  &--loading &__stage {
    position: absolute;
    width: 100%;
    height: 0;
    overflow: hidden;
    visibility: hidden;
    pointer-events: none;
  }

  &__stage {
    position: relative;
    flex: 1;
    min-width: 0;
  }

  &__viewport {
    width: 100%;
    min-width: 0;
    overflow-x: hidden;
    overflow-y: visible;
    touch-action: pan-y pinch-zoom;
    opacity: 0;
    visibility: hidden;
    transition: opacity 0.3s ease, visibility 0.3s ease;

    @media (max-width: 768px) {
      touch-action: pan-y;
      cursor: grab;
      user-select: none;

      &:active {
        cursor: grabbing;
      }
    }
  }

  &--ready &__viewport {
    opacity: 1;
    visibility: visible;
  }

  &__track {
    display: flex;
    transition: transform 0.45s ease;

    &--instant {
      transition: none;
    }
  }

  &__slide {
    flex: 0 0 auto;
    flex-shrink: 0;
    min-width: 0;
    max-width: 100%;
    box-sizing: border-box;
    border-radius: 15px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.28);
  }

  &__nav {
    flex-shrink: 0;
    width: 44px;
    height: 44px;
    border: 1px solid rgba(100, 181, 246, 0.35);
    border-radius: 50%;
    background: rgba(13, 20, 70, 0.75);
    color: #e3f2fd;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
      border-color: rgba(100, 181, 246, 0.7);
      background: rgba(25, 118, 210, 0.35);
      transform: scale(1.05);
    }

    &:disabled {
      opacity: 0.45;
      cursor: not-allowed;
      transform: none;
    }

    @media (max-width: 768px) {
      width: 38px;
      height: 38px;
    }
  }
}

.equipment-card {
  height: 100%;
  background: rgba(13, 20, 70, 0.92);
  border-radius: 15px;
  // overflow: hidden;
  border: none;
  box-shadow: inset 0 0 0 1px rgba(100, 181, 246, 0.3);
  transition: box-shadow 0.4s ease;

  @media (hover: hover) {
    &:hover {
      box-shadow: inset 0 0 0 1px rgba(100, 181, 246, 0.6);

      .card-image img {
        transform: scale(1.05);
      }
    }
  }

  .card-image {
    height: 220px;
    width: 100%;
    overflow: hidden;
    background: #fff;

    img {
      display: block;
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.5s ease;
    }
  }

  .card-content {
    padding: 20px;
    background: rgba(13, 20, 70, 0.92);

    .card-description {
      font-size: 0.95rem;
      color: #e3f2fd;
      margin-bottom: 12px;
      line-height: 1.5;
    }

    .card-name {
      font-size: 1.25rem;
      font-weight: 700;
      color: #64b5f6;
      margin-top: 8px;
      text-shadow: 0 0 10px rgba(100, 181, 246, 0.5);
      border-top: 1px solid rgba(100, 181, 246, 0.3);
      padding-top: 12px;
    }
  }
}

@keyframes equipment-slider-shimmer {
  0% {
    background-position: 200% 0;
  }

  100% {
    background-position: -200% 0;
  }
}
</style>

<template>
  <Teleport to="body">
    <Transition name="nikitos-fade">
      <div
        v-if="visible"
        class="nikitos-easter-egg"
        aria-hidden="true">
        <img
          v-for="(figure, index) in figures"
          :key="`${sessionKey}-${index}`"
          :src="engineerCutout"
          alt=""
          class="nikitos-easter-egg__figure"
          :class="[
            `nikitos-easter-egg__figure--${figure.zone}`,
            { 'nikitos-easter-egg__figure--mirrored': figure.mirrored },
          ]"
          :style="figureStyle(figure)" />

        <div
          class="nikitos-easter-egg__toast"
          role="status">
          <p class="nikitos-easter-egg__toast-text">соберись, никитос</p>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script lang="ts" setup>
import engineerCutout from '~/assets/images/engineer-cutout.png'

type Zone = 'left' | 'right' | 'bottom'

type FigurePlacement = {
  zone: Zone
  offset: number
  lift: number
  horizontal: number
  size: number
  mirrored: boolean
  delay: number
}

const props = defineProps<{
  visible: boolean
  sessionKey: number
}>()

const figures = ref<FigurePlacement[]>([])

const randomBetween = (min: number, max: number) => min + Math.random() * (max - min)

const isMobileView = () =>
  import.meta.client && window.matchMedia('(max-width: 768px)').matches

const buildBottomRow = (count: number, lift: number): FigurePlacement[] => {
  const slots = Array.from({ length: count }, (_, index) => {
    const base = 3 + (index / Math.max(count - 1, 1)) * 94
    return Math.min(97, Math.max(3, base + randomBetween(-5, 5)))
  }).sort((a, b) => a - b)

  return slots.map((horizontal, index) => ({
    zone: 'bottom' as const,
    horizontal,
    offset: -(lift + randomBetween(0, 6)),
    lift: 0,
    size: randomBetween(0.5, 1.4),
    mirrored: Math.random() > 0.4,
    delay: 0.08 + index * 0.11 + randomBetween(0, 0.3),
  }))
}

const buildBottomCrowd = (mobile: boolean): FigurePlacement[] => {
  if (mobile) {
    return buildBottomRow(4 + Math.floor(Math.random() * 3), randomBetween(0, 4))
  }

  return [
    ...buildBottomRow(10 + Math.floor(Math.random() * 4), randomBetween(0, 3)),
    ...buildBottomRow(8 + Math.floor(Math.random() * 4), randomBetween(14, 24)),
  ]
}

const buildSideStack = (zone: 'left' | 'right', mobile: boolean): FigurePlacement[] => {
  const count = mobile ? 1 : 2 + Math.floor(Math.random() * 2)

  return Array.from({ length: count }, (_, index) => ({
    zone,
    horizontal: zone === 'left' ? 0 : 100,
    offset: randomBetween(2, 12) + index * randomBetween(2, 6),
    lift: index * randomBetween(10, 18),
    size: randomBetween(0.75, 1.3),
    mirrored: zone === 'right',
    delay: index * 0.2 + randomBetween(0, 0.15),
  }))
}

const buildPlacements = (): FigurePlacement[] => {
  const mobile = isMobileView()

  return [
    ...buildSideStack('left', mobile),
    ...buildSideStack('right', mobile),
    ...buildBottomCrowd(mobile),
  ]
}

watch(
  () => props.sessionKey,
  () => {
    figures.value = buildPlacements()
  },
  { immediate: true },
)

const figureStyle = (figure: FigurePlacement) => ({
  '--nikitos-delay': `${figure.delay}s`,
  '--nikitos-size': String(figure.size),
  '--nikitos-horizontal': `${figure.horizontal}%`,
  '--nikitos-offset': `${figure.offset}%`,
  '--nikitos-lift': `${figure.lift}%`,
})
</script>

<style lang="scss" scoped>
.nikitos-easter-egg {
  position: fixed;
  inset: 0;
  z-index: 9998;
  pointer-events: none;
  overflow: hidden;

  &__figure {
    position: absolute;
    bottom: 0;
    width: calc(min(30vw, 300px) * var(--nikitos-size, 1));
    max-height: calc(72vh * var(--nikitos-size, 1));
    object-fit: contain;
    object-position: center bottom;
    animation: nikitos-blink 2.2s ease-in-out infinite;
    animation-delay: var(--nikitos-delay, 0s);
    filter: brightness(0);

    &--left {
      left: 0;
      object-position: left bottom;
      transform-origin: left bottom;
      translate: calc(-1 * var(--nikitos-offset, 4%)) calc(-1 * var(--nikitos-lift, 0%));
    }

    &--right {
      right: 0;
      object-position: right bottom;
      transform-origin: right bottom;
      translate: var(--nikitos-offset, 4%) calc(-1 * var(--nikitos-lift, 0%));
    }

    &--bottom {
      left: var(--nikitos-horizontal, 50%);
      transform-origin: center bottom;
      translate: -50% var(--nikitos-offset, 0%);
    }

    &--mirrored {
      scale: -1 1;
    }

    @media (max-width: 768px) {
      width: calc(min(26vw, 140px) * var(--nikitos-size, 1));
      max-height: calc(48vh * var(--nikitos-size, 1));
    }
  }

  &__toast {
    position: fixed;
    top: 24px;
    right: 24px;
    z-index: 9999;
    padding: 16px 22px;
    background: #0d1b2a;
    border: 3px solid var(--lenet-accent);
    box-shadow:
      0 20px 50px rgba(13, 27, 42, 0.45),
      0 0 0 6px rgba(255, 183, 3, 0.18);
    animation: nikitos-toast-pulse 2.2s ease-in-out infinite;
    pointer-events: none;

    @media (max-width: 768px) {
      top: 16px;
      right: 16px;
      left: auto;
      width: auto;
      max-width: min(calc(100vw - 32px), 360px);
      padding: 14px 18px;
      text-align: left;
    }
  }

  &__toast-text {
    margin: 0;
    color: #fff;
    font-size: clamp(1.1rem, 2.2vw, 1.45rem);
    font-weight: 800;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    line-height: 1.2;
    text-shadow: 0 2px 0 rgba(0, 0, 0, 0.25);
  }
}

@keyframes nikitos-blink {
  0%,
  100% {
    opacity: 1;
    filter: brightness(0);
  }

  50% {
    opacity: 0.2;
    filter: brightness(0);
  }
}

@keyframes nikitos-toast-pulse {
  0%,
  100% {
    opacity: 1;
    transform: translateX(0);
  }

  50% {
    opacity: 0.92;
    transform: translateX(-2px);
  }
}

.nikitos-fade-enter-active,
.nikitos-fade-leave-active {
  transition: opacity 0.45s ease;
}

.nikitos-fade-enter-from,
.nikitos-fade-leave-to {
  opacity: 0;
}
</style>

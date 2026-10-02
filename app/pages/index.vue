<template>
  <section
    class="hero"
    :class="{ 'hero--ready': heroReady, 'hero--photo-ready': heroPhotoReady }">
    <div class="hero__media">
      <img
        ref="heroPhotoRef"
        class="hero__photo"
        :src="heroImage"
        alt="Лес и опоры ЛЭП"
        width="1920"
        height="1080"
        fetchpriority="high"
        decoding="async"
        @load="heroPhotoReady = true" />
      <div
        class="hero__gradient"
        aria-hidden="true" />

      <div class="hero__inner">
        <div class="hero__copy">
          <p class="hero__brand">ЛенЭТЛ</p>
          <h1 class="hero__slogan">
            Проверим —
            <span class="hero__slogan-accent">и спите спокойно</span>
          </h1>
          <p class="hero__lead">
            Лицензированная электролаборатория до&nbsp;10&nbsp;кВ — испытания,
            протоколы и выезд по&nbsp;Петербургу и&nbsp;Ленобласти.
          </p>
          <div class="hero__actions">
            <NuxtLink
              to="/#form"
              class="hero__btn hero__btn--primary">
              Оставить заявку
            </NuxtLink>
            <NuxtLink
              to="/services"
              class="hero__btn hero__btn--ghost">
              Смотреть прайс
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </section>

  <DeferredMount min-height="720px">
    <LazyHomeServicesSection />
  </DeferredMount>

  <DeferredMount
    min-height="520px"
    hash="#equipment">
    <LazyEquipmentBlock />
  </DeferredMount>

  <DeferredMount
    min-height="520px"
    hash="#about">
    <LazyAboutCompanyBlock />
  </DeferredMount>

  <DeferredMount
    min-height="640px"
    hash="#form">
    <LazyApplicationFormBlock />
  </DeferredMount>
</template>

<script lang="ts" setup>
import heroImage from '~/assets/images/hero-forest-pylons.avif'

const heroReady = ref(false)
const heroPhotoReady = ref(false)
const heroPhotoRef = ref<HTMLImageElement | null>(null)

useHead({
  link: [
    {
      rel: 'preload',
      as: 'image',
      href: heroImage,
      type: 'image/avif',
      fetchpriority: 'high',
    } as Record<string, string>,
  ],
})

onMounted(() => {
  if (heroPhotoRef.value?.complete && heroPhotoRef.value.naturalWidth > 0) {
    heroPhotoReady.value = true
  }

  requestAnimationFrame(() => {
    heroReady.value = true
  })
})
</script>

<style lang="scss" scoped>
.hero {
  --hero-font-display: 'Unbounded', 'Segoe UI', sans-serif;
  --hero-font-body: 'Manrope', 'Segoe UI', sans-serif;

  position: relative;
  width: 100vw;
  max-width: 100vw;
  margin: -20px 0 56px;
  left: 50%;
  right: auto;
  translate: -50% 0;
  overflow: hidden;
  color: #fff;
  background: transparent;

  @media (min-width: 769px) {
    margin-top: -100px;
  }

  @media (max-width: 768px) {
    margin-top: -12px;
    margin-bottom: 40px;
  }
}

.hero__media {
  position: relative;
  width: 100vw;
  max-width: 100vw;
  height: 100vh;
  height: 100dvh;
  overflow: hidden;
  /* Близко к тону фото, чтобы не мигал синий */
  background: #24352c;
  display: flex;
  align-items: flex-end;
}

.hero__photo {
  position: absolute;
  inset: 0;
  z-index: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center center;
  opacity: 0;
  transform: scale(1.04);
  transition:
    opacity 1s cubic-bezier(0.22, 1, 0.36, 1),
    transform 1.2s cubic-bezier(0.22, 1, 0.36, 1);
}

.hero--photo-ready .hero__photo {
  opacity: 1;
  transform: scale(1);
}

.hero__gradient {
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
  background:
    linear-gradient(
      105deg,
      rgba(13, 27, 42, 0.88) 0%,
      rgba(13, 27, 42, 0.7) 36%,
      rgba(13, 27, 42, 0.28) 66%,
      rgba(13, 27, 42, 0.16) 100%
    ),
    linear-gradient(
      180deg,
      rgba(13, 27, 42, 0.42) 0%,
      transparent 34%,
      rgba(13, 27, 42, 0.58) 100%
    );
}

.hero__inner {
  position: relative;
  z-index: 2;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 48px 20px 56px;
  box-sizing: border-box;

  @media (min-width: 769px) {
    padding-top: 120px;
  }

  @media (max-width: 768px) {
    padding: 36px 16px 40px;
  }
}

.hero__copy {
  max-width: 560px;
}

.hero__brand,
.hero__slogan,
.hero__lead,
.hero__actions {
  opacity: 0;
  transform: translateY(22px);
  transition:
    opacity 0.75s cubic-bezier(0.22, 1, 0.36, 1),
    transform 0.75s cubic-bezier(0.22, 1, 0.36, 1);
}

.hero--ready {
  .hero__brand,
  .hero__slogan,
  .hero__lead,
  .hero__actions {
    opacity: 1;
    transform: translateY(0);
  }

  .hero__slogan {
    transition-delay: 0.08s;
  }

  .hero__lead {
    transition-delay: 0.16s;
  }

  .hero__actions {
    transition-delay: 0.24s;
  }
}

.hero__brand {
  margin: 0 0 14px;
  font-family: var(--hero-font-display);
  font-size: clamp(2.4rem, 5.2vw, 4rem);
  font-weight: 800;
  line-height: 0.95;
  letter-spacing: -0.04em;
  text-transform: uppercase;
  color: #fff;
}

.hero__slogan {
  margin: 0 0 18px;
  font-family: var(--hero-font-display);
  font-size: clamp(1.55rem, 3.2vw, 2.35rem);
  font-weight: 700;
  line-height: 1.15;
  letter-spacing: -0.03em;
  color: #fff;
}

.hero__slogan-accent {
  display: inline-block;
  color: var(--lenet-accent);
  position: relative;

  &::after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0.08em;
    height: 0.28em;
    background: rgba(255, 183, 3, 0.35);
    z-index: -1;
    transform-origin: left center;
    transform: scaleX(0);
    transition: transform 0.7s cubic-bezier(0.22, 1, 0.36, 1) 0.35s;
  }
}

.hero--ready .hero__slogan-accent::after {
  transform: scaleX(1);
}

.hero__lead {
  margin: 0 0 28px;
  max-width: 34rem;
  font-family: var(--hero-font-body);
  font-size: clamp(1rem, 1.5vw, 1.12rem);
  font-weight: 500;
  line-height: 1.55;
  color: rgba(255, 255, 255, 0.84);
}

.hero__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.hero__btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 48px;
  padding: 12px 22px;
  font-family: var(--hero-font-body);
  font-size: 0.88rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  text-decoration: none;
  transition:
    transform 0.2s ease,
    filter 0.2s ease,
    background 0.2s ease,
    border-color 0.2s ease,
    color 0.2s ease;

  &--primary {
    background: var(--lenet-accent);
    color: #1a1a1a;

    &:hover {
      filter: brightness(0.96);
      transform: translateY(-1px);
    }
  }

  &--ghost {
    background: transparent;
    color: #fff;
    border: 1.5px solid rgba(255, 255, 255, 0.55);

    &:hover {
      border-color: #fff;
      background: rgba(255, 255, 255, 0.1);
      transform: translateY(-1px);
    }
  }

  @media (max-width: 480px) {
    width: 100%;
  }
}

@media (prefers-reduced-motion: reduce) {
  .hero__brand,
  .hero__slogan,
  .hero__lead,
  .hero__actions,
  .hero__photo,
  .hero__slogan-accent::after {
    opacity: 1 !important;
    transform: none !important;
    transition: none !important;
  }
}
</style>

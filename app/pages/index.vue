<template>
  <section
    class="hero"
    :class="{ 'hero--ready': heroReady }">
    <div class="hero__media">
      <img
        class="hero__photo"
        :src="heroImage"
        alt="Лес и опоры ЛЭП"
        width="1920"
        height="1080" />
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

  <section class="home-services-section">
    <RevealOnScroll>
      <div class="home-services-section__head">
        <h2 class="home-services-section__title">Ключевые измерения</h2>
        <p class="home-services-section__desc">
          Основные виды испытаний, которые мы выполняем на объектах.
        </p>
      </div>
    </RevealOnScroll>

    <div class="home-services">
      <RevealOnScroll
        v-for="(slide, index) in homeSlides"
        :key="slide.title"
        :delay="index * 70">
        <NuxtLink
          :to="slide.to"
          class="home-services__card">
          <div class="home-services__media">
            <img
              class="home-services__image"
              :src="slide.image"
              :alt="slide.title" />
            <p class="home-services__desc">{{ slide.description }}</p>
          </div>
          <div class="home-services__body">
            <h3 class="home-services__name">{{ slide.title }}</h3>
          </div>
        </NuxtLink>
      </RevealOnScroll>
    </div>

    <RevealOnScroll :delay="80">
      <div class="home-services-section__cta">
        <p class="home-services-section__cta-text">Все услуги и актуальные цены</p>
        <NuxtLink
          to="/services"
          class="home-services-section__cta-btn">
          Смотреть прайс
        </NuxtLink>
      </div>
    </RevealOnScroll>
  </section>

  <RevealOnScroll>
    <EquipmentBlock />
  </RevealOnScroll>

  <RevealOnScroll>
    <AboutCompanyBlock />
  </RevealOnScroll>

  <RevealOnScroll>
    <ApplicationFormBlock />
  </RevealOnScroll>
</template>

<script lang="ts" setup>
import heroImage from '~/assets/images/hero-forest-pylons.jpg'
import servicePhaseZero from '~/assets/images/services/service-phase-zero.webp'
import serviceUzo from '~/assets/images/services/service-uzo.webp'
import serviceBreaker from '~/assets/images/services/service-breaker.webp'
import serviceInsulation from '~/assets/images/services/service-insulation.webp'
import serviceGrounding from '~/assets/images/services/service-grounding.webp'
import serviceBonding from '~/assets/images/services/service-bonding.webp'

type HomeSlide = {
  title: string
  description: string
  image: string
  to: string
}

const heroReady = ref(false)

onMounted(() => {
  requestAnimationFrame(() => {
    heroReady.value = true
  })
})

const homeSlides: HomeSlide[] = [
  {
    title: 'Измерение цепи "фаза-ноль"',
    description:
      'Данная процедура защитит ваше оборудование и поможет выявить неисправности. Измерение цепи фаза-ноль — важный этап проверки.',
    image: servicePhaseZero,
    to: '/services#low-voltage',
  },
  {
    title: 'Проверка УЗО',
    description:
      'Наши специалисты проводят детальную проверку УЗО с использованием современных приборов.',
    image: serviceUzo,
    to: '/services#low-voltage',
  },
  {
    title: 'Проверка автоматических выключателей',
    description:
      'Проверка производится при наличии требуемых условий, а также с использованием специального оборудования.',
    image: serviceBreaker,
    to: '/services#low-voltage',
  },
  {
    title: 'Измерение сопротивления изоляции',
    description:
      'Эта процедура важна в первую очередь для проверки всего оборудования на крупных предприятиях.',
    image: serviceInsulation,
    to: '/services#low-voltage',
  },
  {
    title: 'Проверка контуров заземления',
    description:
      'Наши специалисты выполняют проверки абсолютно всех требуемых электрических элементов.',
    image: serviceGrounding,
    to: '/services#low-voltage',
  },
  {
    title: 'Проверка металлосвязи',
    description:
      'Мы проверим сопротивление и механическую надежность всех соединений, обеспечивающих заземление.',
    image: serviceBonding,
    to: '/services#low-voltage',
  },
]
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
  background: #0d1b2a;
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
  .hero__photo {
    opacity: 1;
    transform: scale(1);
  }

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

.home-services-section {
  margin-bottom: 48px;
}

.home-services-section__head {
  margin-bottom: 28px;
  max-width: 560px;
}

.home-services-section__title {
  margin: 0 0 8px;
  font-size: clamp(1.4rem, 2.4vw, 1.85rem);
  font-weight: 700;
  color: var(--lenet-body-text);
}

.home-services-section__desc {
  margin: 0;
  font-size: 1rem;
  line-height: 1.5;
  color: var(--lenet-text-muted);
}

.home-services {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0;
  margin-bottom: 40px;
  padding: 0;
  box-sizing: border-box;

  > :deep(.reveal) {
    min-width: 0;
    height: 100%;

    &:not(:nth-child(3n)) {
      border-right: 1px solid rgba(13, 27, 42, 0.12);
    }

    &:nth-child(-n + 3) {
      border-bottom: 1px solid rgba(13, 27, 42, 0.12);
    }
  }
}

.home-services__card {
  display: flex;
  flex-direction: column;
  min-width: 0;
  height: 100%;
  text-decoration: none;
  color: inherit;
  background: #fff;
  border: none;
  box-shadow: none;

  &:hover,
  &:focus-visible {
    .home-services__desc {
      opacity: 1;
      transform: translateY(0);
      pointer-events: auto;
    }
  }
}

.home-services__media {
  position: relative;
  aspect-ratio: 16 / 10;
  overflow: hidden;
  background: #fff;
}

.home-services__image {
  width: 100%;
  height: 100%;
  object-fit: contain;
  object-position: center;
  display: block;
  padding: 10px;
  box-sizing: border-box;
  transition: transform 0.4s ease;

  .home-services__card:hover & {
    transform: scale(1.04);
  }
}

.home-services__body {
  padding: 14px 14px 16px;
  display: flex;
  flex-direction: column;
  flex: 1;
}

.home-services__name {
  margin: 0;
  font-size: 0.92rem;
  font-weight: 700;
  line-height: 1.3;
  color: var(--lenet-body-text);
}

.home-services__desc {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  margin: 0;
  padding: 10px 12px;
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.92) 0%,
    rgba(255, 255, 255, 0.98) 100%
  );
  font-size: 0.8rem;
  line-height: 1.4;
  color: var(--lenet-text-muted);
  opacity: 0;
  transform: translateY(10px);
  pointer-events: none;
  transition: opacity 0.28s ease, transform 0.28s ease;
}

.home-services-section__cta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  padding-top: 8px;
}

.home-services-section__cta-text {
  margin: 0;
  font-size: 1.15rem;
  font-weight: 700;
  color: var(--lenet-body-text);
}

.home-services-section__cta-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 14px 28px;
  background: var(--lenet-accent);
  color: #1a1a1a;
  text-decoration: none;
  font-size: 0.85rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  transition: filter 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    filter: brightness(0.96);
    box-shadow: 0 8px 20px rgba(255, 183, 3, 0.35);
    transform: translateY(-1px);
  }
}

@media (max-width: 900px) {
  .home-services {
    grid-template-columns: 1fr;

    > :deep(.reveal) {
      border-right: none !important;
      border-bottom: 1px solid rgba(13, 27, 42, 0.12);

      &:last-child {
        border-bottom: none;
      }
    }
  }

  .home-services__desc {
    opacity: 1;
    transform: none;
    pointer-events: auto;
  }
}

@media (max-width: 700px) {
  .home-services-section__cta {
    flex-direction: column;
    align-items: stretch;
    text-align: left;
  }

  .home-services-section__cta-btn {
    width: 100%;
  }
}

@media (min-width: 701px) and (max-width: 900px) {
  .home-services {
    grid-template-columns: repeat(2, minmax(0, 1fr));

    > :deep(.reveal) {
      border-right: none;
      border-bottom: none;

      &:not(:nth-child(2n)) {
        border-right: 1px solid rgba(13, 27, 42, 0.12);
      }

      &:not(:nth-last-child(-n + 2)) {
        border-bottom: 1px solid rgba(13, 27, 42, 0.12);
      }
    }
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

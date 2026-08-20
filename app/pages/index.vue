<template>
  <section class="hero">
    <RevealOnScroll>
      <div class="hero__header">
        <div class="hero__intro">
          <h1 class="hero__title">
            Электролаборатория
            <span class="hero__title-line">до 10 кВ</span>
          </h1>
          <p class="hero__lead">
            Полный комплекс услуг по испытаниям и измерениям электроустановок и средств защиты.
          </p>
        </div>
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
      <div class="hero__cta">
        <p class="hero__cta-text">Все услуги и актуальные цены</p>
        <NuxtLink
          to="/services"
          class="hero__cta-btn">
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
import servicePhaseZero from '~/assets/images/services/service-phase-zero.png'
import serviceUzo from '~/assets/images/services/service-uzo.png'
import serviceBreaker from '~/assets/images/services/service-breaker.png'
import serviceInsulation from '~/assets/images/services/service-insulation.png'
import serviceGrounding from '~/assets/images/services/service-grounding.png'
import serviceBonding from '~/assets/images/services/service-bonding.png'

type HomeSlide = {
  title: string;
  description: string;
  image: string;
  to: string;
};

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
];
</script>

<style lang="scss" scoped>
.hero {
  padding: 36px 0 48px;
  margin-bottom: 48px;
}

.hero__header {
  margin-bottom: 36px;
}

.hero__intro {
  max-width: 640px;
}

.hero__title {
  margin: 0 0 14px;
  font-size: clamp(1.85rem, 3.4vw, 2.75rem);
  font-weight: 700;
  line-height: 1.15;
  color: var(--lenet-body-text);
  text-align: left;
}

.hero__title-line {
  display: block;
}

.hero__lead {
  margin: 0;
  font-size: clamp(1rem, 1.6vw, 1.15rem);
  line-height: 1.55;
  color: var(--lenet-text-muted);
  text-align: left;
}

.home-services {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0;
  margin-bottom: 56px;
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

.hero__cta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  padding-top: 8px;
}

.hero__cta-text {
  margin: 0;
  font-size: 1.15rem;
  font-weight: 700;
  color: var(--lenet-body-text);
}

.hero__cta-btn {
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
    gap: 0;
    padding: 0;

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
  .hero {
    padding: 24px 0 36px;
  }

  .hero__header {
    margin-bottom: 24px;
  }

  .hero__cta {
    flex-direction: column;
    align-items: stretch;
    text-align: left;
  }

  .hero__cta-btn {
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
</style>

<template>
  <section
    id="about"
    class="about">
    <div class="about__grid">
      <div class="about__media">
        <img
          class="about__image"
          :src="aboutImage"
          alt="Схема проезда к ЛенЭТЛ от метро Выборгская" />
        <p class="about__map-hint">
          От м. Выборгская по Большому Сампсониевскому пр., ориентиры: «ВПитереБыт» и Fitness House. Мы здесь — 29Б.
        </p>
      </div>

      <div class="about__content">
        <h2 class="about__title">О компании</h2>
        <ul class="about__list">
          <li
            v-for="item in points"
            :key="item">
            <span
              class="about__check"
              aria-hidden="true">
              <i class="fas fa-check"></i>
            </span>
            <span>{{ item }}</span>
          </li>
        </ul>

        <div class="about__meta">
          <p>
            ООО «ЛенЭТЛ» · ИНН 7802961435 · ОГРН 1257800007684
          </p>
          <a
            :href="licenseImage"
            target="_blank"
            rel="noopener noreferrer"
            class="about__license">
            Посмотреть лицензию № 06-68/ЭЛ-25
            <span aria-hidden="true">→</span>
          </a>
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts" setup>
import aboutImage from '~/assets/images/about-map-vyborgskaya.png';
import licenseImage from '~/assets/images/license.jpg';

const points = [
  'Лицензированная электролаборатория до 10 кВ',
  'Поверенное высокоточное измерительное оборудование',
  'Полный комплекс испытаний электроустановок и СИЗ',
  'Оформление протоколов по нормативным требованиям',
  'Выезд по Санкт-Петербургу и Ленинградской области',
  'Оперативное рассмотрение заявок в течение рабочего дня',
];
</script>

<style lang="scss" scoped>
.about {
  position: relative;
  z-index: 0;
  scroll-margin-top: 96px;
  margin: 0 0 48px;
  padding: 48px 0;

  // Серый фон на всю ширину экрана
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    left: 50%;
    width: 100vw;
    transform: translateX(-50%);
    background: var(--lenet-header-bg);
    z-index: -1;
  }

  @media (max-width: 768px) {
    margin-bottom: 40px;
    padding: 36px 0;
  }
}

.about__grid {
  display: grid;
  grid-template-columns: minmax(0, 0.95fr) minmax(0, 1.05fr);
  gap: 40px;
  align-items: center;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    gap: 28px;
  }
}

.about__media {
  min-width: 0;
  overflow: hidden;
  background: #fff;
}

.about__image {
  display: block;
  width: 100%;
  height: 100%;
  min-height: 320px;
  max-height: 460px;
  object-fit: cover;
  object-position: center;

  @media (max-width: 900px) {
    min-height: 220px;
    max-height: 300px;
  }
}

.about__map-hint {
  margin: 0;
  padding: 12px 14px;
  font-size: 0.88rem;
  line-height: 1.45;
  color: var(--lenet-text-muted);
  background: #fff;
  border-top: 1px solid rgba(13, 27, 42, 0.08);
}

.about__content {
  min-width: 0;
}

.about__title {
  margin: 0 0 28px;
  font-size: clamp(1.7rem, 3vw, 2.35rem);
  font-weight: 700;
  line-height: 1.15;
  color: var(--lenet-body-text);
}

.about__list {
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.about__list li {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  font-size: 1.02rem;
  line-height: 1.45;
  color: var(--lenet-text-muted);
}

.about__check {
  flex-shrink: 0;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: var(--lenet-accent);
  color: #fff;
  font-size: 0.75rem;
  margin-top: 1px;
}

.about__meta {
  margin-top: 28px;
  padding-top: 20px;
  border-top: 1px solid rgba(13, 27, 42, 0.1);
  display: flex;
  flex-direction: column;
  gap: 10px;

  p {
    margin: 0;
    font-size: 0.9rem;
    line-height: 1.45;
    color: rgba(13, 27, 42, 0.55);
  }
}

.about__license {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  width: fit-content;
  font-size: 0.95rem;
  font-weight: 650;
  color: var(--lenet-body-text);
  text-decoration: none;
  transition: color 0.2s ease;

  &:hover {
    color: var(--lenet-accent);
  }
}
</style>

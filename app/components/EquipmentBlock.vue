<template>
  <section
    id="equipment"
    class="equipment">
    <div class="equipment__header">
      <h2 class="equipment__title">Наше оборудование</h2>

      <div class="equipment__nav">
        <button
          type="button"
          class="equipment__nav-btn"
          aria-label="Предыдущее оборудование"
          @click="goPrev">
          <i class="fas fa-arrow-left" aria-hidden="true"></i>
        </button>
        <button
          type="button"
          class="equipment__nav-btn equipment__nav-btn--primary"
          aria-label="Следующее оборудование"
          @click="goNext">
          <i class="fas fa-arrow-right" aria-hidden="true"></i>
        </button>
      </div>
    </div>

    <div class="equipment__body">
      <nav class="equipment__list" aria-label="Список оборудования">
        <button
          v-for="(item, index) in cards"
          :key="item.name"
          type="button"
          class="equipment__list-item"
          :class="{ 'equipment__list-item--active': index === activeIndex }"
          :aria-current="index === activeIndex ? 'true' : undefined"
          @click="activeIndex = index">
          <span class="equipment__list-dot" aria-hidden="true" />
          <span class="equipment__list-name">{{ item.name }}</span>
        </button>
      </nav>

      <div class="equipment__content">
        <div class="equipment__media">
          <Transition name="equipment-crossfade">
            <NuxtImg
              :key="activeItem.src"
              class="equipment__image"
              :src="activeItem.src"
              :alt="activeItem.alt"
              format="webp"
              quality="90"
              loading="eager"
              preload />
          </Transition>
        </div>
        <Transition name="equipment-text-fade" mode="out-in">
          <p
            :key="activeItem.name"
            class="equipment__description">
            {{ activeItem.description }}
          </p>
        </Transition>
      </div>
    </div>
  </section>
</template>

<script lang="ts" setup>
type EquipmentCard = {
  name: string;
  src: string;
  alt: string;
  description: string;
};

const cards: EquipmentCard[] = [
  {
    name: 'Sonel MPI-525',
    src: 'images/mpi525.jpg',
    alt: 'Многофункциональный прибор',
    description:
      'Универсальный прибор для измерения параметров электрических цепей: сопротивления изоляции, петли фаза-ноль, сопротивления заземления и пр.',
  },
  {
    name: 'Sonel MIC-2500',
    src: 'images/mic2500.jpg',
    alt: 'Измеритель сопротивления изоляции',
    description:
      'Измеритель сопротивления изоляции с возможностью испытания напряжением до 2500 В.',
  },
  {
    name: 'Сатурн-М1',
    src: 'images/saturn.jpg',
    alt: 'Аппарат для испытания автоматических выключателей',
    description:
      'Устройство для проверки автоматических выключателей. Проверка времятоковых характеристик с высокой точностью.',
  },
  {
    name: 'ТКА-ЛЮКС',
    src: 'images/tka.jpg',
    alt: 'Люксметр',
    description: 'Высокоточный прибор для измерения освещенности в широком диапазоне.',
  },
  {
    name: 'ИВТМ-7',
    src: 'images/ivtm.jpg',
    alt: 'Термогигрометр',
    description:
      'Прибор для одновременного измерения температуры и относительной влажности воздуха с памятью показаний.',
  },
  {
    name: 'ИСО-01',
    src: 'images/iso01.jpg',
    alt: 'Измеритель сопротивления обмоток',
    description:
      'Микроомметр для точного измерения сопротивления обмоток трансформаторов, кабелей и контактов.',
  },
  {
    name: 'МИКО-10',
    src: 'images/miko10.jpg',
    alt: 'Микроомметр',
    description:
      'Компактный цифровой микроомметр для измерения малых сопротивлений с высокой точностью.',
  },
  {
    name: 'АИД-70Ц',
    src: 'images/aid70c.jpg',
    alt: 'Аппарат испытательный',
    description:
      'Высоковольтный испытательный аппарат для проверки диэлектрической прочности изоляции кабелей и оборудования.',
  },
  {
    name: 'РЕТОМ-21',
    src: 'images/retom21.jpg',
    alt: 'Устройство проверки релейных защит',
    description: 'Универсальный реле-тестер для проверки устройств релейной защиты и автоматики.',
  },
  {
    name: 'БРИС',
    src: 'images/bris.jpg',
    alt: 'Ванна для испытания СИЗ',
    description: 'Специальная ванна для испытаний диэлектрических перчаток, бот и галош.',
  },
];

const activeIndex = ref(0);

const activeItem = computed(() => cards[activeIndex.value] ?? cards[0]);

const goPrev = () => {
  activeIndex.value = (activeIndex.value - 1 + cards.length) % cards.length;
};

const goNext = () => {
  activeIndex.value = (activeIndex.value + 1) % cards.length;
};

onMounted(() => {
  cards.forEach((card) => {
    const img = new Image();
    img.src = `/${card.src}`;
  });
});
</script>

<style lang="scss" scoped>
.equipment {
  margin: 0 0 56px;
  padding: 28px 0 8px;
  scroll-margin-top: 96px;
}

.equipment__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 36px;
}

.equipment__title {
  margin: 0;
  font-size: clamp(1.8rem, 3.2vw, 2.6rem);
  font-weight: 700;
  line-height: 1.15;
  color: var(--lenet-body-text);
}

.equipment__nav {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
}

.equipment__nav-btn {
  width: 44px;
  height: 44px;
  border: none;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  color: var(--lenet-body-text);
  cursor: pointer;
  transition: background 0.2s ease, color 0.2s ease, transform 0.2s ease;

  &:hover {
    background: rgba(13, 27, 42, 0.06);
  }

  &:active {
    transform: scale(0.96);
  }

  &--primary {
    background: var(--lenet-accent);
    color: #fff;

    &:hover {
      background: #e6a600;
      color: #fff;
    }
  }
}

.equipment__body {
  display: grid;
  grid-template-columns: minmax(180px, 240px) minmax(0, 1fr);
  gap: 40px;
  align-items: start;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    gap: 24px;
  }
}

.equipment__list {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 0;
  padding-left: 2px;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    left: 8px;
    width: 1px;
    background: rgba(13, 27, 42, 0.14);
  }

  @media (max-width: 900px) {
    flex-direction: row;
    overflow-x: auto;
    gap: 8px;
    padding: 0 0 8px;
    scrollbar-width: thin;

    &::before {
      display: none;
    }
  }
}

.equipment__list-item {
  position: relative;
  display: flex;
  align-items: center;
  gap: 14px;
  width: 100%;
  padding: 12px 8px 12px 0;
  border: none;
  background: transparent;
  text-align: left;
  cursor: pointer;
  color: rgba(13, 27, 42, 0.48);
  transition: color 0.2s ease;

  &:hover {
    color: rgba(13, 27, 42, 0.72);
  }

  &--active {
    color: var(--lenet-accent);

    .equipment__list-dot {
      background: var(--lenet-accent);
      border-color: var(--lenet-accent);
      box-shadow: 0 0 0 4px rgba(255, 183, 3, 0.22);
    }
  }

  @media (max-width: 900px) {
    width: auto;
    flex-shrink: 0;
    padding: 10px 14px;
    border-radius: 999px;
    background: rgba(13, 27, 42, 0.04);
    gap: 8px;

    &--active {
      background: rgba(255, 183, 3, 0.14);
    }
  }
}

.equipment__list-dot {
  position: relative;
  z-index: 1;
  width: 14px;
  height: 14px;
  flex-shrink: 0;
  border-radius: 50%;
  border: 2px solid rgba(13, 27, 42, 0.22);
  background: #fff;
  transition: background 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;

  @media (max-width: 900px) {
    width: 8px;
    height: 8px;
    border-width: 0;
    background: currentColor;
  }
}

.equipment__list-name {
  font-size: 1rem;
  font-weight: 600;
  line-height: 1.35;
  white-space: nowrap;
}

.equipment__content {
  min-width: 0;
}

.equipment__media {
  position: relative;
  overflow: hidden;
  background: #fff;
  aspect-ratio: 16 / 10;
}

.equipment__image {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: contain;
  object-position: center;
  display: block;
  background: #fff;
}

.equipment__description {
  margin: 18px 0 0;
  max-width: 52rem;
  font-size: 1rem;
  line-height: 1.65;
  color: var(--lenet-text-muted);
}

.equipment-crossfade-enter-active,
.equipment-crossfade-leave-active {
  transition: opacity 0.45s ease;
}

.equipment-crossfade-leave-active {
  z-index: 1;
}

.equipment-crossfade-enter-active {
  z-index: 2;
}

.equipment-crossfade-enter-from,
.equipment-crossfade-leave-to {
  opacity: 0;
}

.equipment-text-fade-enter-active,
.equipment-text-fade-leave-active {
  transition: opacity 0.28s ease;
}

.equipment-text-fade-enter-from,
.equipment-text-fade-leave-to {
  opacity: 0;
}
</style>

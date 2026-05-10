<template>
  <section class="equipment-header">
    <h1>Наше оборудование</h1>
    <p>
      ЛенЭТЛ использует современное высокоточное оборудование для проведения всех видов испытаний и
      измерений. Все приборы регулярно проходят поверку и обслуживание.
    </p>
  </section>
  <section class="equipment-grid">
    <div
      v-for="(card, index) in cards"
      :key="index"
      class="equipment-card">
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
    </div>
  </section>
</template>

<script lang="ts" setup>
const cards = [
  {
    name: 'Sonel MPI-525',
    src: 'images/mpi525.jpg',
    alt: 'Многофункциональный прибор',
    description:
      'Универсальный прибор для измерения параметров электрических цепей: сопротивления изоляции, петли фаза-ноль, сопротивления заземления и пр..',
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
</script>

<style lang="scss" scoped>
.equipment-header {
  text-align: center;
  margin-bottom: 50px;

  h1 {
    font-size: 2.8rem;
    margin-bottom: 20px;
    text-shadow: 0 0 20px rgba(100, 181, 246, 0.7);
    background: linear-gradient(to right, #e3f2fd, #bbdefb);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;

    @media (max-width: 768px) {
      font-size: 2.2rem;
    }
  }

  p {
    font-size: 1.2rem;
    max-width: 800px;
    margin: 0 auto 30px;
    color: #e3f2fd;
    line-height: 1.6;

    @media (max-width: 480px) {
      font-size: 1rem;
    }
  }
}

.equipment-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 35px;
  margin-bottom: 60px;

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
}

.equipment-card {
  background: rgba(13, 20, 70, 0.7);
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(100, 181, 246, 0.3);
  position: relative;
  //opacity: 0;
  transform: translateY(30px);
  transition:
    opacity 0.6s ease,
    transform 0.6s ease,
    box-shadow 0.4s ease,
    border-color 0.4s ease;

  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 15px 40px rgba(100, 181, 246, 0.3);
    border-color: rgba(100, 181, 246, 0.6);

    .card-image img {
      transform: scale(1.05);
    }
  }

  .card-image {
    height: 250px;
    width: 100%;
    overflow: hidden;
    position: relative;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.5s ease;
    }
  }

  .card-content {
    padding: 25px;

    .card-description {
      font-size: 1rem;
      color: #e3f2fd;
      margin-bottom: 15px;
      line-height: 1.5;
      min-height: 80px;
    }

    .card-name {
      font-size: 1.4rem;
      font-weight: 700;
      color: #64b5f6;
      margin-top: 10px;
      text-shadow: 0 0 10px rgba(100, 181, 246, 0.5);
      border-top: 1px solid rgba(100, 181, 246, 0.3);
      padding-top: 15px;
    }
  }
}
</style>

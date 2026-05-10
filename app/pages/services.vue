<template>
  <section class="services-header">
    <h1>Наши услуги и цены</h1>
    <p>
      ЛенЭТЛ предоставляет полный комплекс услуг по испытаниям и измерениям электроустановок и
      средств защиты до 10 кВ. Наши цены конкурентоспособны, а качество работ соответствует всем
      нормативным требованиям.
    </p>
  </section>

  <section class="services-container">
    <!-- Таблица 1: Испытания средств защиты -->
    <div
      id="protection-gear"
      class="service-section">
      <div class="service-title">
        <i class="fas fa-shield-alt"></i>
        <h2>Испытания средств защиты</h2>
      </div>
      <table class="services-table">
        <thead>
          <tr>
            <th>Наименование</th>
            <th>Единица измерения</th>
            <th>Стоимость</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Перчатки диэлектрические</td>
            <td>пара</td>
            <td class="price">190,00 руб.</td>
          </tr>
          <tr>
            <td>Боты диэлектрические</td>
            <td>пара</td>
            <td class="price">190,00 руб.</td>
          </tr>
          <tr>
            <td>Галоши диэлектрические</td>
            <td>пара</td>
            <td class="price">190,00 руб.</td>
          </tr>
          <tr>
            <td>Инструмент изолирующий ручной</td>
            <td>шт.</td>
            <td class="price">190,00 руб.</td>
          </tr>
          <tr>
            <td>Указатель низкого/высокого напряжения</td>
            <td>шт.</td>
            <td class="price">190,00 руб.</td>
          </tr>
          <tr>
            <td>Штанга изолирующая (всех типов)</td>
            <td>шт.</td>
            <td class="price">190,00 руб.</td>
          </tr>
          <tr>
            <td>Заземление переносное (комплект рукояток)</td>
            <td>шт.</td>
            <td class="price">190,00 руб.</td>
          </tr>
          <tr>
            <td>Клещи электроизмерительные</td>
            <td>шт.</td>
            <td class="price">190,00 руб.</td>
          </tr>
          <tr>
            <td>Сетевой электроинструмент (без АКБ), за исключением сварочных аппаратов</td>
            <td>шт.</td>
            <td class="price">190,00 руб.</td>
          </tr>
          <tr>
            <td>Сварочные аппараты (изоляция, металлосвязь)</td>
            <td>шт.</td>
            <td class="price">от 700,00 руб.</td>
          </tr>
          <tr>
            <td>Диэлектрические лестницы и стремянки</td>
            <td>шт.</td>
            <td class="price">от 190,00 руб.</td>
          </tr>
        </tbody>
      </table>
      <br />
      По согласованию возможны срочные испытания, а также забор и доставка СИЗ с Вашего объекта.
      Подробности уточняйте у менеджера.
    </div>

    <!-- Таблица 2: Испытания электроустановок до 1000 В -->
    <div
      id="low-voltage"
      class="service-section">
      <div class="service-title">
        <i class="fas fa-plug"></i>
        <h2>Испытания электроустановок до 1000 В</h2>
      </div>
      <table class="services-table">
        <thead>
          <tr>
            <th>Тип испытаний</th>
            <th>Включаемые работы</th>
            <th>Стоимость</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Эксплуатационные испытания</td>
            <td>
              Визуальный осмотр, измерение петли "фаза-нуль", измерение сопротивления изоляции,
              проверка УЗО, проверка металлосвязи, проверка заземления
            </td>
            <td class="price">От 10 000,00 руб</td>
          </tr>
          <tr>
            <td>Приемосдаточные испытания</td>
            <td>
              Визуальный осмотр, измерение петли "фаза-нуль", измерение сопротивления изоляции,
              проверка УЗО, прогрузка автоматических выключателей, проверка металлосвязи, проверка
              заземления
            </td>
            <td class="price">От 15 000,00 руб</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Таблица 3: Испытания электроустановок выше 1000 В -->
    <div class="service-section">
      <div class="service-title">
        <i class="fas fa-bolt"></i>
        <h2>Испытания электроустановок выше 1000 В</h2>
      </div>
      <table class="services-table">
        <thead>
          <tr>
            <th>Наименование услуги</th>
            <th>Стоимость</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Испытание кабелей повышенным напряжением</td>
            <td class="price">от 10 000,00 руб</td>
          </tr>
          <tr>
            <td>Испытание оборудования повышенным напряжением</td>
            <td class="price">от 10 000,00 руб</td>
          </tr>
          <tr>
            <td>Проверка релейной защиты</td>
            <td class="price">от 20 000,00 руб</td>
          </tr>
          <tr>
            <td>Испытание силовых трансформаторов</td>
            <td class="price">от 20 000,00 руб</td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.services-header {
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
      font-size: 2rem;
    }

    @media (max-width: 480px) {
      font-size: 1.6rem;
    }
  }

  p {
    font-size: 1.2rem;
    max-width: 800px;
    margin: 0 auto 30px;
    color: #e3f2fd;
    line-height: 1.6;
    text-shadow: 0 0 10px rgba(100, 181, 246, 0.5);

    @media (max-width: 768px) {
      font-size: 1rem;
      padding: 0 20px;
    }
  }
}

.services-container {
  display: flex;
  flex-direction: column;
  gap: 60px;
  margin-bottom: 60px;
}

.service-section {
  background: rgba(13, 20, 70, 0.7);
  border-radius: 15px;
  padding: 30px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(100, 181, 246, 0.3);
  position: relative;
  overflow-x: auto; // Важно для горизонтальной прокрутки таблицы

  @media (max-width: 768px) {
    padding: 20px;
  }

  @media (max-width: 480px) {
    padding: 15px;
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 5px;
    background: linear-gradient(90deg, #0d47a1, #1976d2);
  }
}

.service-title {
  display: flex;
  align-items: center;
  margin-bottom: 25px;
  padding-bottom: 15px;
  border-bottom: 1px solid rgba(100, 181, 246, 0.3);

  @media (max-width: 480px) {
    flex-direction: column;
    text-align: center;
    gap: 10px;
  }

  i {
    font-size: 2.2rem;
    margin-right: 15px;
    color: #64b5f6;

    @media (max-width: 480px) {
      margin-right: 0;
    }
  }

  h2 {
    font-size: 1.8rem;
    font-weight: 600;
    color: #e3f2fd;

    @media (max-width: 768px) {
      font-size: 1.4rem;
    }

    @media (max-width: 480px) {
      font-size: 1.2rem;
    }
  }
}

.services-table {
  width: 100%;
  border-collapse: collapse;
  min-width: 500px; // Минимальная ширина для планшетов

  @media (max-width: 768px) {
    min-width: 400px;
  }

  th {
    background: rgba(25, 118, 210, 0.3);
    padding: 15px;
    text-align: left;
    font-weight: 600;
    border-bottom: 2px solid rgba(100, 181, 246, 0.5);

    @media (max-width: 768px) {
      padding: 10px;
      font-size: 0.9rem;
    }

    @media (max-width: 480px) {
      padding: 8px;
      font-size: 0.8rem;
    }
  }

  td {
    padding: 15px;
    border-bottom: 1px solid rgba(100, 181, 246, 0.2);

    @media (max-width: 768px) {
      padding: 10px;
      font-size: 0.9rem;
    }

    @media (max-width: 480px) {
      padding: 8px;
      font-size: 0.8rem;
    }
  }

  tr {
    &:nth-child(even) {
      background: rgba(25, 118, 210, 0.1);
    }

    &:hover {
      background: rgba(100, 181, 246, 0.15);
    }
  }
}

.price {
  color: #ffd54f;
  font-weight: 600;
  white-space: nowrap;

  @media (max-width: 480px) {
    white-space: normal; // Разрешаем перенос на мобильных
  }
}
</style>

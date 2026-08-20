<template>
  <PageHeader title="Наши услуги и цены">
    ЛенЭТЛ предоставляет полный комплекс услуг по испытаниям и измерениям электроустановок и
    средств защиты до 10 кВ. Наши цены конкурентоспособны, а качество работ соответствует всем
    нормативным требованиям.
  </PageHeader>

  <RevealOnScroll>
    <section class="services">
      <div class="services__shell">
        <nav
          class="services__tabs"
          aria-label="Категории услуг">
          <button
            v-for="(tab, index) in tabs"
            :id="tab.id"
            :key="tab.id"
            type="button"
            class="services__tab"
            :class="{ 'services__tab--active': index === activeIndex }"
            :aria-selected="index === activeIndex"
            @click="selectTab(index)">
            <i
              class="fas"
              :class="tab.icon"
              aria-hidden="true" />
            <span>{{ tab.title }}</span>
          </button>
        </nav>

        <div class="services__panel">
          <Transition
            name="services-fade"
            mode="out-in">
            <div
              :key="activeTab.id"
              class="services__panel-inner">
            <div class="services__panel-head">
              <h2 class="services__panel-title">{{ activeTab.title.replace(/\n/g, ' ') }}</h2>
                <p
                  v-if="activeTab.lead"
                  class="services__panel-lead">
                  {{ activeTab.lead }}
                </p>
              </div>

              <div class="services__table-wrap">
                <table class="services__table">
                  <thead>
                    <tr>
                      <th
                        v-for="column in activeTab.columns"
                        :key="column">
                        {{ column }}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="(row, rowIndex) in activeTab.rows"
                      :key="`${activeTab.id}-${rowIndex}`">
                      <td
                        v-for="(cell, cellIndex) in row.cells"
                        :key="cellIndex"
                        :class="{ 'services__price': cellIndex === row.cells.length - 1 }">
                        {{ cell }}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <aside
                v-if="activeTab.notes.length"
                class="services__notes">
                <p class="services__notes-title">Справочная информация</p>
                <ul class="services__notes-list">
                  <li
                    v-for="(note, noteIndex) in activeTab.notes"
                    :key="noteIndex">
                    {{ note }}
                  </li>
                </ul>
              </aside>
            </div>
          </Transition>
        </div>
      </div>
    </section>
  </RevealOnScroll>
</template>

<script lang="ts" setup>
type ServiceTab = {
  id: string;
  title: string;
  icon: string;
  lead?: string;
  columns: string[];
  rows: { cells: string[] }[];
  notes: string[];
};

const tabs: ServiceTab[] = [
  {
    id: 'protection-gear',
    title: 'Испытания средств защиты',
    icon: 'fa-shield-alt',
    lead: 'Испытания СИЗ и изолирующего инструмента с оформлением протоколов.',
    columns: ['Наименование', 'Единица измерения', 'Стоимость'],
    rows: [
      { cells: ['Перчатки диэлектрические', 'пара', '190,00 руб.'] },
      { cells: ['Боты диэлектрические', 'пара', '190,00 руб.'] },
      { cells: ['Галоши диэлектрические', 'пара', '190,00 руб.'] },
      { cells: ['Инструмент изолирующий ручной', 'шт.', '190,00 руб.'] },
      { cells: ['Указатель низкого/высокого напряжения', 'шт.', '190,00 руб.'] },
      { cells: ['Штанга изолирующая (всех типов)', 'шт.', '190,00 руб.'] },
      { cells: ['Заземление переносное (комплект рукояток)', 'шт.', '190,00 руб.'] },
      { cells: ['Клещи электроизмерительные', 'шт.', '190,00 руб.'] },
      {
        cells: [
          'Сетевой электроинструмент (без АКБ), за исключением сварочных аппаратов',
          'шт.',
          '190,00 руб.',
        ],
      },
      { cells: ['Сварочные аппараты (изоляция, металлосвязь)', 'шт.', 'от 700,00 руб.'] },
      { cells: ['Диэлектрические лестницы и стремянки', 'шт.', 'от 190,00 руб.'] },
    ],
    notes: [
      'По согласованию возможны срочные испытания.',
      'Доступны забор и доставка СИЗ с вашего объекта.',
      'Итоговая стоимость зависит от объёма и сроков. Подробности уточняйте у менеджера.',
    ],
  },
  {
    id: 'low-voltage',
    title: 'Испытания электроустановок\nдо 1000 В',
    icon: 'fa-plug',
    lead: 'Эксплуатационные и приёмосдаточные испытания низковольтных электроустановок.',
    columns: ['Тип испытаний', 'Включаемые работы', 'Стоимость'],
    rows: [
      {
        cells: [
          'Эксплуатационные испытания',
          'Визуальный осмотр, измерение петли «фаза-нуль», измерение сопротивления изоляции, проверка УЗО, проверка металлосвязи, проверка заземления',
          'От 10 000,00 руб.',
        ],
      },
      {
        cells: [
          'Приемосдаточные испытания',
          'Визуальный осмотр, измерение петли «фаза-нуль», измерение сопротивления изоляции, проверка УЗО, прогрузка автоматических выключателей, проверка металлосвязи, проверка заземления',
          'От 15 000,00 руб.',
        ],
      },
    ],
    notes: [
      'Стоимость указана ориентировочно и зависит от количества точек измерения.',
      'Состав работ может быть скорректирован под требования объекта и техническое задание.',
      'По результатам работ предоставляются протоколы испытаний.',
    ],
  },
  {
    id: 'high-voltage',
    title: 'Испытания электроустановок\nвыше 1000 В',
    icon: 'fa-bolt',
    lead: 'Высоковольтные испытания кабелей, оборудования, релейной защиты и трансформаторов.',
    columns: ['Наименование услуги', 'Стоимость'],
    rows: [
      { cells: ['Испытание кабелей повышенным напряжением', 'от 10 000,00 руб.'] },
      { cells: ['Испытание оборудования повышенным напряжением', 'от 10 000,00 руб.'] },
      { cells: ['Проверка релейной защиты', 'от 20 000,00 руб.'] },
      { cells: ['Испытание силовых трансформаторов', 'от 20 000,00 руб.'] },
    ],
    notes: [
      'Точная смета рассчитывается после уточнения параметров объекта.',
      'Работы выполняются с использованием поверенного оборудования.',
      'Сроки выезда и объём испытаний согласовываются индивидуально.',
    ],
  },
];

const route = useRoute();
const router = useRouter();
const activeIndex = ref(0);

const activeTab = computed(() => tabs[activeIndex.value] ?? tabs[0]!);

const selectTab = (index: number) => {
  activeIndex.value = index;
  const tab = tabs[index];
  if (!tab) return;
  router.replace({ hash: `#${tab.id}` });
};

const syncFromHash = () => {
  const hash = route.hash.replace('#', '');
  if (!hash) return;
  const index = tabs.findIndex((tab) => tab.id === hash);
  if (index >= 0) activeIndex.value = index;
};

onMounted(syncFromHash);
watch(() => route.hash, syncFromHash);
</script>

<style lang="scss" scoped>
.services {
  margin: 0 0 64px;
}

.services__shell {
  display: grid;
  grid-template-columns: minmax(220px, 300px) minmax(0, 1fr);
  align-items: stretch;
  background: #fff;
  border: 1px solid rgba(13, 27, 42, 0.1);
  box-shadow: 0 12px 28px -8px rgba(13, 27, 42, 0.14);
  overflow: hidden;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
}

.services__tabs {
  display: flex;
  flex-direction: column;
  gap: 0;
  min-width: 0;
  overflow: hidden;
  background: var(--lenet-header-bg);
  border-right: 1px solid rgba(13, 27, 42, 0.1);

  @media (max-width: 900px) {
    flex-direction: row;
    overflow-x: auto;
    overflow-y: hidden;
    border-right: none;
    border-bottom: 1px solid rgba(13, 27, 42, 0.1);
    scrollbar-width: thin;
  }
}

.services__tab {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  width: 100%;
  min-width: 0;
  padding: 16px 14px 16px 18px;
  border: none;
  border-bottom: 1px solid rgba(13, 27, 42, 0.08);
  background: transparent;
  text-align: left;
  cursor: pointer;
  color: var(--lenet-text-muted);
  position: relative;
  transition: color 0.2s ease, background 0.2s ease;
  box-sizing: border-box;

  i {
    flex-shrink: 0;
    width: 1.1rem;
    margin-top: 2px;
    text-align: center;
    color: inherit;
  }

  span {
    min-width: 0;
    flex: 1;
    font-size: 0.8rem;
    font-weight: 650;
    line-height: 1.35;
    white-space: pre-line;
    overflow-wrap: break-word;
  }

  &:hover {
    color: var(--lenet-body-text);
    background: rgba(255, 255, 255, 0.55);
  }

  &--active {
    color: var(--lenet-body-text);
    background: #fff;
    z-index: 1;
    margin-right: -1px;
    border-right: 1px solid #fff;

    i {
      color: var(--lenet-accent);
    }

    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      width: 3px;
      background: var(--lenet-accent);
    }
  }

  &:last-child {
    border-bottom: none;
  }

  @media (max-width: 900px) {
    width: auto;
    flex: 1 0 auto;
    max-width: 320px;
    padding: 14px 16px;
    border-bottom: none;
    border-right: 1px solid rgba(13, 27, 42, 0.08);

    span {
      font-size: 0.78rem;
      white-space: pre-line;
    }

    &--active {
      margin-right: 0;
      margin-bottom: -1px;
      border-right: 1px solid rgba(13, 27, 42, 0.08);
      border-bottom: 1px solid #fff;

      &::before {
        top: auto;
        right: 0;
        bottom: 0;
        width: auto;
        height: 3px;
      }
    }

    &:last-child {
      border-right: none;
    }
  }
}

.services__panel {
  background: #fff;
  padding: 28px;
  min-width: 0;

  @media (max-width: 600px) {
    padding: 18px 14px;
  }
}

.services__panel-head {
  margin-bottom: 22px;
  padding-bottom: 16px;
  border-bottom: 1px solid rgba(13, 27, 42, 0.08);
}

.services__panel-title {
  margin: 0 0 8px;
  font-size: clamp(1.25rem, 2vw, 1.55rem);
  font-weight: 700;
  line-height: 1.25;
  color: var(--lenet-body-text);
}

.services__panel-lead {
  margin: 0;
  font-size: 0.98rem;
  line-height: 1.55;
  color: var(--lenet-text-muted);
}

.services__table-wrap {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  margin-bottom: 22px;
}

.services__table {
  width: 100%;
  border-collapse: collapse;
  min-width: 520px;

  th {
    padding: 14px 16px;
    text-align: left;
    font-size: 0.82rem;
    font-weight: 700;
    letter-spacing: 0.03em;
    text-transform: uppercase;
    color: rgba(13, 27, 42, 0.55);
    background: var(--lenet-header-bg);
    border-bottom: 1px solid rgba(13, 27, 42, 0.1);

    &:last-child {
      text-align: right;
      white-space: nowrap;
    }
  }

  td {
    padding: 16px;
    font-size: 0.98rem;
    line-height: 1.5;
    color: var(--lenet-body-text);
    border-bottom: 1px solid rgba(13, 27, 42, 0.07);
    vertical-align: top;
  }

  tbody tr {
    transition: background 0.2s ease;

    &:nth-child(even) {
      background: rgba(242, 245, 248, 0.55);
    }

    &:hover {
      background: #fff8e7;
    }

    &:last-child td {
      border-bottom: none;
    }
  }
}

.services__price {
  width: 1%;
  white-space: nowrap;
  text-align: right;
  font-weight: 700;
  color: var(--lenet-body-text);
}

.services__notes {
  padding: 18px 20px;
  background: var(--lenet-header-bg);
  border: 1px solid rgba(13, 27, 42, 0.06);
}

.services__notes-title {
  margin: 0 0 10px;
  font-size: 0.9rem;
  font-weight: 700;
  color: var(--lenet-body-text);
}

.services__notes-list {
  margin: 0;
  padding-left: 1.15rem;
  display: flex;
  flex-direction: column;
  gap: 8px;

  li {
    font-size: 0.95rem;
    line-height: 1.55;
    color: var(--lenet-text-muted);
  }
}

.services-fade-enter-active,
.services-fade-leave-active {
  transition: opacity 0.28s ease, transform 0.28s ease;
}

.services-fade-enter-from {
  opacity: 0;
  transform: translateY(8px);
}

.services-fade-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
</style>

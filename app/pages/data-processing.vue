<template>
  <PageHeader title="Правила обработки персональных данных" narrow>
    Документ определяет условия и порядок обработки персональных данных,
    которые ООО «ЛенЭТЛ» получает при работе сайта и оказании услуг.
  </PageHeader>

  <section class="legal">
    <aside class="legal__meta" aria-label="Сведения о документе">
      <div class="legal__meta-item">
        <span class="legal__meta-label">Оператор</span>
        <span class="legal__meta-value">ООО «ЛенЭТЛ»</span>
      </div>
      <div class="legal__meta-item">
        <span class="legal__meta-label">Дата редакции</span>
        <span class="legal__meta-value">20 августа 2026 г.</span>
      </div>
      <div class="legal__meta-item">
        <span class="legal__meta-label">Связанный документ</span>
        <NuxtLink
          to="/privacy-policy"
          class="legal__meta-link">
          Политика конфиденциальности
        </NuxtLink>
      </div>
    </aside>

    <nav
      class="legal__toc"
      aria-label="Содержание">
      <p class="legal__toc-title">Содержание</p>
      <ol class="legal__toc-list">
        <li
          v-for="section in sections"
          :key="section.id">
          <a :href="`#${section.id}`">{{ section.title }}</a>
        </li>
      </ol>
    </nav>

    <article class="legal__content">
      <section
        v-for="section in sections"
        :id="section.id"
        :key="section.id"
        class="legal__section">
        <h2 class="legal__heading">{{ section.title }}</h2>
        <div
          v-for="(block, index) in section.blocks"
          :key="`${section.id}-${index}`"
          class="legal__block">
          <p
            v-if="block.type === 'p'"
            class="legal__text">
            {{ block.text }}
          </p>
          <ul
            v-else-if="block.type === 'ul'"
            class="legal__list">
            <li
              v-for="(item, itemIndex) in block.items"
              :key="itemIndex">
              {{ item }}
            </li>
          </ul>
        </div>
      </section>

      <section class="legal__contacts">
        <h2 class="legal__heading">Контакты по вопросам обработки ПДн</h2>
        <p class="legal__text">
          Запросы об обработке персональных данных, уточнении, блокировании,
          уничтожении данных или отзыве согласия направляйте:
        </p>
        <ul class="legal__contacts-list">
          <li>
            <span>Организация</span>
            <strong>ООО «ЛенЭТЛ»</strong>
          </li>
          <li>
            <span>Адрес</span>
            <strong>Санкт-Петербург, Большой Сампсониевский пр., 29Б, пом. 16-Н</strong>
          </li>
          <li>
            <span>Телефон</span>
            <a href="tel:+79944182338">+7 (994) 418-23-38</a>
          </li>
          <li>
            <span>E-mail</span>
            <a href="mailto:lenetl@yandex.ru">lenetl@yandex.ru</a>
          </li>
        </ul>
      </section>
    </article>
  </section>
</template>

<script lang="ts" setup>
type LegalBlock =
  | { type: 'p'; text: string }
  | { type: 'ul'; items: string[] };

type LegalSection = {
  id: string;
  title: string;
  blocks: LegalBlock[];
};

const sections: LegalSection[] = [
  {
    id: 'subject',
    title: '1. Предмет и область применения',
    blocks: [
      {
        type: 'p',
        text: 'Настоящие Правила определяют порядок и условия обработки персональных данных (далее — ПДн) субъектов, взаимодействующих с ООО «ЛенЭТЛ» через сайт, форму заявки, телефон, электронную почту и мессенджеры.',
      },
      {
        type: 'p',
        text: 'Правила применяются совместно с Политикой конфиденциальности. При расхождении формулировок приоритет имеет документ, прямо регулирующий соответствующий вопрос.',
      },
    ],
  },
  {
    id: 'definitions',
    title: '2. Основные понятия',
    blocks: [
      {
        type: 'ul',
        items: [
          'Персональные данные — любая информация, относящаяся к прямо или косвенно определённому физическому лицу.',
          'Оператор — ООО «ЛенЭТЛ», самостоятельно или совместно с другими лицами организующее и (или) осуществляющее обработку ПДн.',
          'Обработка ПДн — любое действие или совокупность действий с ПДн, включая сбор, запись, хранение, использование, передачу, обезличивание, блокирование, удаление и уничтожение.',
          'Субъект ПДн — физическое лицо, к которому относятся персональные данные.',
        ],
      },
    ],
  },
  {
    id: 'principles',
    title: '3. Принципы обработки',
    blocks: [
      {
        type: 'p',
        text: 'Обработка персональных данных осуществляется на основе следующих принципов:',
      },
      {
        type: 'ul',
        items: [
          'законность и справедливость;',
          'ограничение обработки заранее определёнными и законными целями;',
          'недопущение избыточности обрабатываемых данных;',
          'обеспечение точности и актуальности данных;',
          'хранение данных не дольше, чем требуют цели обработки;',
          'обеспечение безопасности и конфиденциальности ПДн.',
        ],
      },
    ],
  },
  {
    id: 'categories',
    title: '4. Категории субъектов и состав данных',
    blocks: [
      {
        type: 'p',
        text: 'Оператор обрабатывает ПДн следующих субъектов:',
      },
      {
        type: 'ul',
        items: [
          'посетители сайта;',
          'лица, направившие заявку через форму на сайте;',
          'клиенты и представители клиентов;',
          'иные лица, обратившиеся к Оператору по телефону, e-mail или в мессенджерах.',
        ],
      },
      {
        type: 'p',
        text: 'В состав обрабатываемых данных могут входить: ФИО или имя для обращения, телефон, адрес электронной почты, содержание обращения, приложенные файлы, а также технические сведения о посещении сайта.',
      },
    ],
  },
  {
    id: 'purposes',
    title: '5. Цели и способы обработки',
    blocks: [
      {
        type: 'p',
        text: 'Цели обработки:',
      },
      {
        type: 'ul',
        items: [
          'приём и обработка заявок на испытания и измерения;',
          'обратная связь с субъектом ПДн;',
          'подготовка, заключение и исполнение договоров;',
          'ведение учёта обращений;',
          'соблюдение требований законодательства РФ.',
        ],
      },
      {
        type: 'p',
        text: 'Обработка осуществляется смешанным способом: с использованием средств автоматизации и без них. Данные могут обрабатываться в информационных системах Оператора и на носителях, обеспечивающих сохранность сведений.',
      },
    ],
  },
  {
    id: 'consent',
    title: '6. Согласие на обработку',
    blocks: [
      {
        type: 'p',
        text: 'Согласие на обработку ПДн предоставляется субъектом путём проставления отметки в форме заявки на сайте и/или иным явно выраженным действием (отправка сообщения, звонок с указанием данных для обратной связи).',
      },
      {
        type: 'p',
        text: 'Согласие действует до его отзыва либо до достижения целей обработки. Отзыв согласия не влияет на законность обработки, осуществлённой до момента отзыва.',
      },
    ],
  },
  {
    id: 'storage',
    title: '7. Сроки хранения и уничтожение',
    blocks: [
      {
        type: 'p',
        text: 'ПДн хранятся в форме, позволяющей определить субъекта, не дольше, чем этого требуют цели обработки, если иной срок не установлен договором или законодательством.',
      },
      {
        type: 'p',
        text: 'По достижении целей обработки, при отзыве согласия или при выявлении неправомерной обработки Оператор обеспечивает удаление, уничтожение либо обезличивание данных в разумный срок, если сохранение не требуется по закону.',
      },
    ],
  },
  {
    id: 'access',
    title: '8. Доступ и поручение обработки',
    blocks: [
      {
        type: 'p',
        text: 'К обработке ПДн допускаются только лица, которым это необходимо для исполнения трудовых или договорных обязанностей, при условии соблюдения конфиденциальности.',
      },
      {
        type: 'p',
        text: 'При поручении обработки третьему лицу Оператор заключает соответствующий договор и контролирует соблюдение требований к защите ПДн. Передача данных без законного основания не допускается.',
      },
    ],
  },
  {
    id: 'security',
    title: '9. Меры по обеспечению безопасности',
    blocks: [
      {
        type: 'p',
        text: 'Для защиты ПДн Оператор применяет, в частности, следующие меры:',
      },
      {
        type: 'ul',
        items: [
          'ограничение доступа к данным;',
          'использование защищённых каналов связи при передаче данных через сайт;',
          'учёт носителей и информационных ресурсов;',
          'контроль действий с ПДн;',
          'регулярная актуализация организационных и технических мер защиты.',
        ],
      },
    ],
  },
  {
    id: 'requests',
    title: '10. Порядок рассмотрения обращений',
    blocks: [
      {
        type: 'p',
        text: 'Субъект ПДн вправе направить Оператору запрос о предоставлении сведений об обработке, уточнении, блокировании или уничтожении данных, а также об отзыве согласия.',
      },
      {
        type: 'p',
        text: 'Запрос должен содержать сведения, позволяющие идентифицировать субъекта, и существо требования. Оператор рассматривает обращение в сроки, установленные Федеральным законом № 152-ФЗ, и направляет ответ по указанным контактным данным.',
      },
    ],
  },
  {
    id: 'liability',
    title: '11. Ответственность и заключительные положения',
    blocks: [
      {
        type: 'p',
        text: 'Лица, виновные в нарушении требований законодательства о персональных данных, несут ответственность в соответствии с законодательством Российской Федерации.',
      },
      {
        type: 'p',
        text: 'Оператор вправе изменять настоящие Правила. Актуальная редакция размещается на сайте. По вопросам толкования Правил приоритет имеют нормы действующего законодательства РФ.',
      },
    ],
  },
];
</script>

<style lang="scss" scoped>
.legal {
  max-width: 860px;
  margin: 0 auto 64px;
  display: flex;
  flex-direction: column;
  gap: 28px;
}

.legal__meta {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
  padding: 20px 22px;
  background: var(--lenet-header-bg);
  border: 1px solid rgba(13, 27, 42, 0.08);

  @media (max-width: 760px) {
    grid-template-columns: 1fr;
  }
}

.legal__meta-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 0;
}

.legal__meta-label {
  font-size: 0.78rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: rgba(13, 27, 42, 0.45);
}

.legal__meta-value,
.legal__meta-link {
  font-size: 0.98rem;
  font-weight: 600;
  color: var(--lenet-body-text);
  line-height: 1.4;
}

.legal__meta-link {
  text-decoration: none;
  color: var(--lenet-primary);

  &:hover {
    color: var(--lenet-accent);
  }
}

.legal__toc {
  padding: 22px 24px;
  border: 1px solid rgba(13, 27, 42, 0.1);
  background: #fff;
}

.legal__toc-title {
  margin: 0 0 14px;
  font-size: 1rem;
  font-weight: 700;
  color: var(--lenet-body-text);
}

.legal__toc-list {
  margin: 0;
  padding-left: 1.2rem;
  display: flex;
  flex-direction: column;
  gap: 8px;

  a {
    color: var(--lenet-text-muted);
    text-decoration: none;
    line-height: 1.45;
    transition: color 0.2s ease;

    &:hover {
      color: var(--lenet-accent);
    }
  }
}

.legal__content {
  display: flex;
  flex-direction: column;
  gap: 28px;
}

.legal__section,
.legal__contacts {
  scroll-margin-top: 24px;
  padding: 28px 28px 30px;
  background: #fff;
  border: 1px solid rgba(13, 27, 42, 0.08);
  box-shadow: 0 10px 28px -10px rgba(13, 27, 42, 0.1);

  @media (max-width: 600px) {
    padding: 22px 18px 24px;
  }
}

.legal__heading {
  margin: 0 0 16px;
  font-size: 1.25rem;
  font-weight: 700;
  line-height: 1.3;
  color: var(--lenet-body-text);
}

.legal__block + .legal__block {
  margin-top: 12px;
}

.legal__text {
  margin: 0;
  font-size: 1rem;
  line-height: 1.7;
  color: var(--lenet-text-muted);
}

.legal__list {
  margin: 0;
  padding-left: 1.2rem;
  display: flex;
  flex-direction: column;
  gap: 8px;

  li {
    font-size: 1rem;
    line-height: 1.6;
    color: var(--lenet-text-muted);
  }
}

.legal__contacts-list {
  margin: 16px 0 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 12px;

  li {
    display: grid;
    grid-template-columns: 120px minmax(0, 1fr);
    gap: 12px;
    align-items: baseline;

    @media (max-width: 520px) {
      grid-template-columns: 1fr;
      gap: 2px;
    }

    span {
      font-size: 0.85rem;
      font-weight: 600;
      color: rgba(13, 27, 42, 0.45);
      text-transform: uppercase;
      letter-spacing: 0.03em;
    }

    strong,
    a {
      font-size: 1rem;
      font-weight: 600;
      color: var(--lenet-body-text);
      line-height: 1.45;
      text-decoration: none;
    }

    a:hover {
      color: var(--lenet-accent);
    }
  }
}
</style>

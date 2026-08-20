<template>
  <PageHeader title="Политика конфиденциальности" narrow>
    Документ описывает порядок сбора, хранения и использования персональных данных
    посетителей сайта ООО «ЛенЭТЛ».
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
          to="/data-processing"
          class="legal__meta-link">
          Правила обработки персональных данных
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
        <h2 class="legal__heading">Контакты оператора</h2>
        <p class="legal__text">
          По вопросам обработки персональных данных и реализации прав субъекта ПДн
          обращайтесь:
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
    id: 'general',
    title: '1. Общие положения',
    blocks: [
      {
        type: 'p',
        text: 'Настоящая Политика конфиденциальности определяет порядок обработки и защиты информации о физических лицах, которые пользуются сайтом ООО «ЛенЭТЛ» (далее — Оператор).',
      },
      {
        type: 'p',
        text: 'Используя сайт и отправляя заявку через форму обратной связи, пользователь подтверждает согласие с условиями настоящей Политики в объёме, необходимом для оказания услуг и связи по обращению.',
      },
      {
        type: 'p',
        text: 'Политика разработана в соответствии с Федеральным законом от 27.07.2006 № 152-ФЗ «О персональных данных» и иными применимыми нормами права Российской Федерации.',
      },
    ],
  },
  {
    id: 'operator',
    title: '2. Сведения об операторе',
    blocks: [
      {
        type: 'ul',
        items: [
          'Полное наименование: Общество с ограниченной ответственностью «ЛенЭТЛ»',
          'ИНН: 7802961435',
          'КПП: 780201001',
          'ОГРН: 1257800007684',
          'Адрес: Санкт-Петербург, Большой Сампсониевский проспект, 29Б, пом. 16-Н',
        ],
      },
    ],
  },
  {
    id: 'data',
    title: '3. Какие данные мы обрабатываем',
    blocks: [
      {
        type: 'p',
        text: 'Оператор может обрабатывать следующие категории персональных данных, которые пользователь добровольно указывает в форме заявки или иным способом связи:',
      },
      {
        type: 'ul',
        items: [
          'фамилия, имя, отчество (или имя для обращения);',
          'номер телефона;',
          'адрес электронной почты;',
          'содержание сообщения и иные сведения, указанные пользователем;',
          'файлы, приложенные к заявке (при их направлении).',
        ],
      },
      {
        type: 'p',
        text: 'Также при посещении сайта могут автоматически обрабатываться технические данные: IP-адрес, сведения о браузере и устройстве, дата и время обращения к страницам сайта — в объёме, необходимом для обеспечения работоспособности и безопасности сервиса.',
      },
    ],
  },
  {
    id: 'purposes',
    title: '4. Цели обработки',
    blocks: [
      {
        type: 'p',
        text: 'Персональные данные обрабатываются в следующих целях:',
      },
      {
        type: 'ul',
        items: [
          'рассмотрение и обработка заявок на услуги электролаборатории;',
          'связь с пользователем по вопросам обращения;',
          'заключение и исполнение договоров;',
          'улучшение качества сервиса и работы сайта;',
          'исполнение требований законодательства РФ.',
        ],
      },
    ],
  },
  {
    id: 'legal-basis',
    title: '5. Правовые основания',
    blocks: [
      {
        type: 'p',
        text: 'Основаниями обработки являются согласие субъекта персональных данных, необходимость исполнения договора либо совершения действий по запросу субъекта до заключения договора, а также случаи, прямо предусмотренные законодательством РФ.',
      },
    ],
  },
  {
    id: 'actions',
    title: '6. Действия с данными и сроки хранения',
    blocks: [
      {
        type: 'p',
        text: 'Оператор осуществляет сбор, запись, систематизацию, накопление, хранение, уточнение, использование, передачу (в случаях, предусмотренных законом или договором), блокирование, удаление и уничтожение персональных данных.',
      },
      {
        type: 'p',
        text: 'Данные хранятся не дольше, чем этого требуют цели обработки, либо до отзыва согласия — если иное не предусмотрено законодательством. По достижении целей или при отзыве согласия данные подлежат удалению либо обезличиванию, если их сохранение не требуется по закону.',
      },
    ],
  },
  {
    id: 'transfer',
    title: '7. Передача третьим лицам',
    blocks: [
      {
        type: 'p',
        text: 'Оператор не продаёт персональные данные и не передаёт их третьим лицам без законного основания, за исключением случаев:',
      },
      {
        type: 'ul',
        items: [
          'когда передача необходима для исполнения договора или оказания услуги;',
          'когда это прямо предусмотрено законодательством РФ;',
          'когда пользователь дал отдельное согласие на такую передачу.',
        ],
      },
    ],
  },
  {
    id: 'security',
    title: '8. Защита информации',
    blocks: [
      {
        type: 'p',
        text: 'Оператор принимает необходимые правовые, организационные и технические меры для защиты персональных данных от неправомерного или случайного доступа, уничтожения, изменения, блокирования, копирования, распространения и иных неправомерных действий.',
      },
    ],
  },
  {
    id: 'rights',
    title: '9. Права пользователя',
    blocks: [
      {
        type: 'p',
        text: 'Субъект персональных данных вправе:',
      },
      {
        type: 'ul',
        items: [
          'получить сведения об обработке своих персональных данных;',
          'требовать уточнения, блокирования или уничтожения данных при наличии оснований;',
          'отозвать согласие на обработку персональных данных;',
          'обжаловать действия или бездействие Оператора в уполномоченный орган или суд.',
        ],
      },
      {
        type: 'p',
        text: 'Для реализации прав направьте обращение на e-mail lenetl@yandex.ru или по телефону +7 (994) 418-23-38. Оператор рассмотрит обращение в сроки, установленные законодательством.',
      },
    ],
  },
  {
    id: 'cookies',
    title: '10. Файлы cookie и сервисы аналитики',
    blocks: [
      {
        type: 'p',
        text: 'Сайт может использовать файлы cookie и сходные технологии для обеспечения корректной работы страниц, сохранения пользовательских настроек и статистики посещаемости. Пользователь может ограничить или отключить cookie в настройках браузера; при этом отдельные функции сайта могут работать ограниченно.',
      },
    ],
  },
  {
    id: 'changes',
    title: '11. Изменение Политики',
    blocks: [
      {
        type: 'p',
        text: 'Оператор вправе обновлять настоящую Политику. Актуальная версия всегда доступна на этой странице. Продолжение использования сайта после публикации изменений означает согласие с обновлённой редакцией в части, не требующей отдельного согласия.',
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

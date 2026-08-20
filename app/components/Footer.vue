<template>
  <footer class="site-footer">
    <nav class="site-footer__actions" aria-label="Быстрые действия">
      <NuxtLink to="/form" class="site-footer__action site-footer__action--lead">
        Оставить заявку
        <span aria-hidden="true">→</span>
      </NuxtLink>
      <div class="site-footer__actions-group">
        <a
          href="https://wa.me/79944182338"
          target="_blank"
          rel="noopener noreferrer"
          class="site-footer__action">
          WhatsApp
          <span aria-hidden="true">→</span>
        </a>
        <a
          href="https://t.me/etl_spb"
          target="_blank"
          rel="noopener noreferrer"
          class="site-footer__action">
          Telegram
          <span aria-hidden="true">→</span>
        </a>
      </div>
    </nav>

    <div class="site-footer__main">
      <section class="site-footer__section site-footer__section--contacts">
        <div class="site-footer__section-head">
          <p class="site-footer__heading">Контакты</p>
          <span class="site-footer__dot" aria-hidden="true" />
        </div>
        <p class="site-footer__plain">Санкт-Петербург, Б. Сампсониевский пр., 29Б</p>
        <a href="tel:+79944182338" class="site-footer__plain-link">+7 (994) 418-23-38</a>
        <a href="mailto:lenetl@yandex.ru" class="site-footer__plain-link">lenetl@yandex.ru</a>
        <a
          href="https://yandex.ru/maps/-/CHGgJTJt"
          target="_blank"
          rel="noopener noreferrer"
          class="site-footer__action site-footer__action--inline">
          Построить маршрут
          <span aria-hidden="true">→</span>
        </a>
      </section>

      <section class="site-footer__section site-footer__section--schedule">
        <p class="site-footer__heading site-footer__heading--schedule">График работы</p>
        <p class="site-footer__plain">Рабочие дни: 9:00 – 18:00</p>
        <p class="site-footer__plain">Суббота, воскресенье: выходной</p>
      </section>

      <section class="site-footer__section site-footer__section--links">
        <NuxtLink to="/services" class="site-footer__action site-footer__action--inline">
          Услуги и цены
          <span aria-hidden="true">→</span>
        </NuxtLink>
        <NuxtLink to="/equipment" class="site-footer__action site-footer__action--inline">
          Наше оборудование
          <span aria-hidden="true">→</span>
        </NuxtLink>
      </section>
    </div>

    <div class="site-footer__bottom">
      <div class="site-footer__bottom-left">
        <div class="site-footer__legal">
          <p>© 2026 ЛенЭТЛ. Электротехническая лаборатория</p>
          <p>Лицензия № 06-68/ЭЛ-25</p>
        </div>
        <p class="site-footer__brand">ЛенЭТЛ</p>
        <p class="site-footer__credit">
          Design &amp; Dev by
          <a
            href="https://t.me/MoreOrSea"
            target="_blank"
            rel="noopener noreferrer">
            MoreOrSea
          </a>
        </p>
      </div>
      <nav class="site-footer__bottom-links" aria-label="Правовая информация">
        <NuxtLink to="/privacy-policy">Политика конфиденциальности</NuxtLink>
        <NuxtLink to="/data-processing">Правила обработки данных</NuxtLink>
      </nav>
    </div>
  </footer>
</template>

<style lang="scss" scoped>
.site-footer {
  position: relative;
  max-width: 420px;
  margin: 0 auto;
  padding: 8px 0 28px;
  color: #0d1b2a;
  z-index: 3;

  @media (min-width: 769px) {
    max-width: none;
    padding: 20px 0 40px;
    --footer-grid-columns: 1fr 1fr 1fr;
    --footer-grid-gap: 80px;
  }

  &__actions,
  &__main,
  &__bottom {
    border-bottom: 1px solid rgba(13, 27, 42, 0.18);
  }

  &__actions {
    padding: 22px 0;

    @media (min-width: 769px) {
      display: grid;
      grid-template-columns: var(--footer-grid-columns);
      gap: var(--footer-grid-gap);
      align-items: start;
      padding: 28px 0;
    }
  }

  &__actions-group {
    @media (min-width: 769px) {
      grid-column: 2;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 18px;
    }
  }

  &__main {
    padding: 22px 0;

    @media (min-width: 769px) {
      display: grid;
      grid-template-columns: var(--footer-grid-columns);
      gap: var(--footer-grid-gap);
      padding: 36px 0;
    }
  }

  &__section {
    & + & {
      margin-top: 22px;
      padding-top: 22px;
      border-top: 1px solid rgba(13, 27, 42, 0.18);

      @media (min-width: 769px) {
        margin-top: 0;
        padding-top: 0;
        border-top: none;
      }
    }

    &--schedule {
      @media (min-width: 769px) {
        padding-left: 0;
      }
    }

    &--links {
      @media (min-width: 769px) {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
      }
    }
  }

  &__action {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    width: 100%;
    margin-bottom: 18px;
    color: #0d1b2a;
    font-size: 1.05rem;
    font-weight: 700;
    line-height: 1.3;
    text-decoration: none;
    transition: color 0.2s ease;

    &:last-child {
      margin-bottom: 0;
    }

    span {
      font-weight: 400;
      font-size: 1.1rem;
    }

    &:hover {
      color: #0d47a1;
    }

    &--lead {
      @media (min-width: 769px) {
        grid-column: 1;
        width: auto;
        margin-bottom: 0;
        justify-content: flex-start;
      }
    }

    &--inline {
      margin-top: 16px;
      margin-bottom: 0;

      @media (min-width: 769px) {
        margin-top: 0;
      }
    }

    &--inline + &--inline {
      margin-top: 14px;

      @media (min-width: 769px) {
        margin-top: 18px;
      }
    }
  }

  &__actions-group &__action {
    @media (min-width: 769px) {
      width: auto;
      margin-bottom: 0;
      justify-content: flex-start;
    }
  }

  &__section-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    margin-bottom: 16px;
    width: 100%;
  }

  &__dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #0d1b2a;
    flex-shrink: 0;

    @media (min-width: 769px) {
      display: none;
    }
  }

  &__heading {
    margin: 0 0 16px;
    font-size: 0.95rem;
    font-weight: 800;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: #0d1b2a;

    &--schedule {
      @media (min-width: 769px) {
        margin-bottom: 16px;
      }
    }
  }

  &__section-head &__heading {
    margin-bottom: 0;
  }

  &__plain,
  &__plain-link {
    display: block;
    margin: 0 0 8px;
    font-size: 0.98rem;
    font-weight: 400;
    line-height: 1.45;
    color: #0d1b2a;
  }

  &__plain-link {
    text-decoration: none;

    &:hover {
      color: #0d47a1;
    }
  }

  &__bottom {
    display: flex;
    flex-direction: column;
    gap: 20px;
    padding-top: 22px;
    border-bottom: none;

    @media (min-width: 769px) {
      flex-direction: row;
      align-items: flex-end;
      justify-content: space-between;
      gap: 40px;
      padding-top: 28px;
    }
  }

  &__bottom-left {
    min-width: 0;
  }

  &__legal {
    font-size: 12px;
    line-height: 1.55;
    color: rgba(13, 27, 42, 0.68);

    p {
      margin: 0 0 2px;
    }
  }

  &__brand {
    margin: 12px 0 0;
    font-size: clamp(3.5rem, 8vw, 6.5rem);
    font-weight: 800;
    line-height: 0.95;
    letter-spacing: -0.02em;
    color: rgba(13, 27, 42, 0.72);
    text-transform: uppercase;

    @media (min-width: 769px) {
      margin-top: 16px;
      font-size: clamp(2.5rem, 4vw, 3.25rem);
    }
  }

  &__credit {
    margin: 12px 0 0;
    font-size: 13px;
    line-height: 1.5;
    color: rgba(13, 27, 42, 0.68);

    a {
      font-weight: 600;
      color: rgba(13, 27, 42, 0.68);
      text-decoration: underline;
      text-underline-offset: 2px;

      &:hover {
        color: #0d47a1;
      }
    }
  }

  &__bottom-links {
    display: flex;
    flex-direction: column;
    gap: 8px;
    font-size: 12px;
    line-height: 1.45;

    @media (min-width: 769px) {
      flex-shrink: 0;
      align-items: flex-end;
      text-align: right;
      padding-bottom: 4px;
    }

    a {
      color: rgba(13, 27, 42, 0.68);
      text-decoration: none;

      &:hover {
        color: #0d47a1;
      }
    }
  }
}
</style>

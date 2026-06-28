<template>
  <footer class="site-footer">
    <div class="site-footer__card">
      <div class="site-footer__grid">
        <div class="site-footer__brand">
          <p class="site-footer__name">ЛенЭТЛ</p>
          <p class="site-footer__tagline">Электротехническая лаборатория</p>
          <p class="site-footer__copyright">
            © 2026 ЛенЭТЛ.
            <span class="site-footer__copyright-reg">Св-во о регистрации № 06-68/ЭЛ-25</span>
          </p>
          <NuxtLink to="/contacts" class="site-footer__contacts-link">
            Все контакты
            <i class="fas fa-arrow-right" />
          </NuxtLink>
        </div>

        <div class="site-footer__contacts">
          <p class="site-footer__heading">Связаться с нами</p>
          <ul class="site-footer__contact-list">
            <li>
              <a href="tel:+79944182338">
                <i class="fas fa-phone" />
                +7 (994) 418-23-38
              </a>
            </li>
            <li>
              <a href="mailto:lenetl@yandex.ru">
                <i class="fas fa-envelope" />
                lenetl@yandex.ru
              </a>
            </li>
            <li class="site-footer__address">
              <a
                href="https://yandex.ru/maps/-/CHGgJTJt"
                target="_blank"
                rel="noopener noreferrer"
                class="site-footer__address-card">
                <span
                  class="site-footer__address-icon"
                  aria-hidden="true">
                  <i class="fas fa-map-marker-alt" />
                </span>
                <span class="site-footer__address-text">
                  <span class="site-footer__address-city">Санкт-Петербург</span>
                  <span class="site-footer__address-street">Б. Сампсониевский пр., 29Б</span>
                  <span class="site-footer__address-route">
                    Открыть на карте
                    <i class="fas fa-arrow-right" />
                  </span>
                </span>
              </a>
            </li>
          </ul>
          <div class="site-footer__messengers">
            <a
              href="https://t.me/etl_spb"
              target="_blank"
              rel="noopener noreferrer"
              class="site-footer__messenger site-footer__messenger--tg"
              aria-label="Telegram">
              <i class="fab fa-telegram" />
            </a>
            <a
              href="https://wa.me/79944182338"
              target="_blank"
              rel="noopener noreferrer"
              class="site-footer__messenger site-footer__messenger--wa"
              aria-label="WhatsApp">
              <i class="fab fa-whatsapp" />
            </a>
          </div>
        </div>

        <nav class="site-footer__legal" aria-label="Правовая информация">
          <p class="site-footer__heading">Документы</p>
          <ul>
            <li>
              <NuxtLink to="/data-processing">Правила обработки данных</NuxtLink>
            </li>
            <li>
              <NuxtLink to="/privacy-policy">Политика конфиденциальности</NuxtLink>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  </footer>
</template>

<style lang="scss" scoped>
.site-footer {
  position: relative;
  padding: 28px 0 24px;
  border-top: 1px solid rgba(100, 181, 246, 0.65);
  color: #0d1b2a;
  z-index: 3;

  &__card {
    padding: 0;
  }

  &__grid {
    display: grid;
    grid-template-columns: 1fr 1.2fr 1fr;
    gap: 32px;
    text-align: left;

    @media (max-width: 768px) {
      grid-template-columns: 1fr;
      gap: 24px;
      text-align: center;
    }
  }

  &__name {
    margin: 0 0 6px;
    font-size: 1.5rem;
    font-weight: 700;
    color: #0d1b2a;
  }

  &__tagline {
    margin: 0 0 10px;
    font-size: 1rem;
    font-weight: 500;
    color: #0d1b2a;
    line-height: 1.5;
  }

  &__copyright {
    margin: 0 0 16px;
    font-size: 0.85rem;
    font-weight: 500;
    color: rgba(13, 27, 42, 0.75);
    line-height: 1.4;

    @media (max-width: 768px) {
      margin-bottom: 20px;
    }
  }

  &__copyright-reg {
    display: block;
    margin-top: 4px;
  }

  &__contacts-link {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-size: 1rem;
    font-weight: 600;
    color: #0d47a1;
    text-decoration: none;
    transition: color 0.2s;

    i {
      font-size: 0.75rem;
      transition: transform 0.2s;
    }

    &:hover {
      color: #1565c0;

      i {
        transform: translateX(4px);
      }
    }
  }

  &__heading {
    margin: 0 0 14px;
    font-size: 0.85rem;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: #0d47a1;
  }

  &__contact-list {
    list-style: none;
    margin: 0;
    padding: 0;

    li {
      margin-bottom: 10px;

      &:last-child {
        margin-bottom: 0;
      }
    }

    a {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      color: #0d1b2a;
      text-decoration: none;
      font-size: 1rem;
      font-weight: 600;
      transition: color 0.2s;

      i {
        width: 16px;
        color: #0d47a1;
        text-align: center;
      }

      &:hover {
        color: #0d47a1;
      }
    }
  }

  &__address {
    margin-top: 4px;

    @media (max-width: 768px) {
      display: flex;
      justify-content: center;
    }
  }

  &__address-card {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    max-width: 320px;
    padding: 12px 14px;
    border-radius: 14px;
    background: rgba(255, 255, 255, 0.55);
    border: 1px solid rgba(100, 181, 246, 0.35);
    box-shadow: 0 4px 14px rgba(13, 27, 42, 0.06);
    text-decoration: none;
    transition:
      background 0.2s ease,
      border-color 0.2s ease,
      box-shadow 0.2s ease,
      transform 0.2s ease;

    &:hover {
      background: rgba(255, 255, 255, 0.82);
      border-color: rgba(13, 71, 161, 0.35);
      box-shadow: 0 6px 18px rgba(13, 71, 161, 0.12);
      transform: translateY(-1px);

      .site-footer__address-route {
        color: #0d47a1;

        i {
          transform: translateX(3px);
        }
      }
    }
  }

  &__address-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    width: 36px;
    height: 36px;
    border-radius: 10px;
    background: linear-gradient(135deg, rgba(100, 181, 246, 0.25), rgba(25, 118, 210, 0.18));
    color: #0d47a1;
    font-size: 0.95rem;
  }

  &__address-text {
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-width: 0;
    text-align: left;
  }

  &__address-city {
    font-size: 0.72rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: rgba(13, 71, 161, 0.75);
  }

  &__address-street {
    font-size: 0.98rem;
    font-weight: 600;
    line-height: 1.35;
    color: #0d1b2a;
  }

  &__address-route {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    margin-top: 4px;
    font-size: 0.82rem;
    font-weight: 600;
    color: rgba(13, 71, 161, 0.85);
    transition: color 0.2s ease;

    i {
      font-size: 0.65rem;
      transition: transform 0.2s ease;
    }
  }

  &__messengers {
    display: flex;
    gap: 10px;
    margin-top: 16px;

    @media (max-width: 768px) {
      justify-content: center;
    }
  }

  &__messenger {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    font-size: 1.2rem;
    color: #fff;
    text-decoration: none;
    transition: transform 0.2s, box-shadow 0.2s;

    &:hover {
      transform: translateY(-2px);
    }

    &--tg {
      background: linear-gradient(135deg, #2aabee, #229ed9);
      box-shadow: 0 4px 12px rgba(42, 171, 238, 0.35);

      &:hover {
        box-shadow: 0 6px 16px rgba(42, 171, 238, 0.5);
      }
    }

    &--wa {
      background: linear-gradient(135deg, #25d366, #128c7e);
      box-shadow: 0 4px 12px rgba(37, 211, 102, 0.35);

      &:hover {
        box-shadow: 0 6px 16px rgba(37, 211, 102, 0.5);
      }
    }
  }

  &__legal {
    ul {
      list-style: none;
      margin: 0;
      padding: 0;
    }

    li {
      margin-bottom: 10px;

      &:last-child {
        margin-bottom: 0;
      }
    }

    a {
      color: #0d1b2a;
      text-decoration: none;
      font-size: 1rem;
      font-weight: 600;
      line-height: 1.5;
      transition: color 0.2s;

      &:hover {
        color: #0d47a1;
      }
    }

    @media (max-width: 768px) {
      border-top: 1px solid rgba(100, 181, 246, 0.3);
      padding-top: 20px;
    }
  }
}
</style>

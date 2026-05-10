<template>
  <section class="contacts-header">
    <h1>Наши контакты</h1>
    <p>
      Свяжитесь с нами любым удобным способом. Мы всегда готовы ответить на ваши вопросы и обсудить
      сотрудничество.
    </p>
  </section>

  <div class="contacts-container">
    <div class="contact-info">
      <div class="contact-item">
        <h3>
          <i class="fas fa-building"></i>
          Название организации
        </h3>
        <p>Общество с ограниченной ответственностью "ЛенЭТЛ"</p>
      </div>

      <div class="contact-item">
        <h3>
          <i class="fas fa-clock"></i>
          Время работы
        </h3>
        <p>
          Понедельник - Пятница: с 9:00 до 18:00
          <br />
          Суббота, Воскресенье: выходной
        </p>
      </div>

      <div class="contact-item">
        <h3>
          <i class="fas fa-phone"></i>
          Телефон
        </h3>
        <p><a href="tel:+79944182338">+7 (994) 418-23-38</a></p>
      </div>

      <div class="contact-item">
        <h3>
          <i class="fas fa-envelope"></i>
          Электронная почта
        </h3>
        <p><a href="mailto:lenetl@yandex.ru">lenetl@yandex.ru</a></p>
      </div>

      <div class="contact-item">
        <h3>
          <i class="fas fa-comments"></i>
          Мессенджеры
        </h3>
        <div class="messengers">
          <a
            href="https://t.me/etl_spb"
            target="_blank"
            class="messenger-btn telegram">
            <i class="fab fa-telegram"></i>
            Telegram
          </a>
          <a
            href="https://wa.me/79944182338"
            target="_blank"
            class="messenger-btn whatsapp">
            <i class="fab fa-whatsapp"></i>
            WhatsApp
          </a>
        </div>
      </div>

      <div class="contact-item">
        <h3>
          <i class="fas fa-map-marker-alt"></i>
          Адрес
        </h3>
        <p>
          Санкт-Петербург, Большой Сампсониевский проспект, 29Б, пом. 16-Н
          <br />
          <a
            href="https://yandex.ru/maps/-/CHGgJTJt"
            target="_blank">
            Построить маршрут
          </a>
        </p>
      </div>

      <div class="contact-item">
        <h3>
          <i class="fas fa-file-alt"></i>
          Реквизиты
        </h3>
        <p>
          ИНН: 7802961435
          <br />
          КПП: 780201001
          <br />
          ОГРН: 1257800007684
        </p>
      </div>
    </div>

    <div class="map-container">
      <img
        src="assets/images/map.jpg"
        alt="Схема проезда к ЛенЭТЛ" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.contacts-header {
  h1 {
    font-size: 2.8rem;
    margin-bottom: 20px;
    text-shadow: 0 0 20px rgba(100, 181, 246, 0.7);
    background: linear-gradient(to right, #e3f2fd, #bbdefb);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    text-align: center;
  }

  p {
    font-size: 1.2rem;
    max-width: 800px;
    margin: 0 auto 30px;
    color: #e3f2fd;
    line-height: 1.6;
  }
}

.contacts-container {
  gap: 40px;
  margin-bottom: 60px;
  display: flex;
  flex-direction: column;

  @media(min-width: 780px) {
    display: grid;
  grid-template-columns: 1fr 1fr;
  }
}

.contact-info {
  background: rgba(13, 20, 70, 0.7);
  border-radius: 15px;
  padding: 30px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(100, 181, 246, 0.3);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 5px;
    background: linear-gradient(90deg, #64b5f6, #90caf9);
  }
}

.contact-item {
  margin-bottom: 25px;
  padding-bottom: 20px;
  border-bottom: 1px solid rgba(100, 181, 246, 0.2);

  &:last-child {
    margin-bottom: 0;
    padding-bottom: 0;
    border-bottom: none;
  }

  h3 {
    font-size: 1.2rem;
    color: #64b5f6;
    margin-bottom: 15px;
    display: flex;
    align-items: center;

    i {
      margin-right: 12px;
      font-size: 1.4rem;
    }
  }

  p {
    font-size: 1.1rem;
    color: #e3f2fd;
    line-height: 1.6;
    margin-left: 35px;
  }

  a {
    color: #64b5f6;
    text-decoration: none;
    transition: all 0.3s;
    display: inline-block;
    position: relative;

    &:hover {
      color: #90caf9;
      text-decoration: underline;

      &::after {
        width: 100%;
      }
    }

    &::after {
      content: '';
      position: absolute;
      bottom: -2px;
      left: 0;
      width: 0;
      height: 1px;
      background: #90caf9;
      transition: width 0.3s;
    }
  }
}

.messengers {
  display: flex;
  gap: 20px;
  margin-top: 15px;
}

.messenger-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  border-radius: 50px;
  text-decoration: none;
  transition: all 0.3s ease;
  font-weight: 600;

  &.telegram {
    background: linear-gradient(45deg, #0088cc, #34aadc);
    color: white;
  }

  &.whatsapp {
    background: linear-gradient(45deg, #25d366, #128c7e);
    color: white;
  }

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  }
}

.map-container {
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(100, 181, 246, 0.3);
  height: 100%;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s ease;
  }

  &:hover img {
    transform: scale(1.05);
  }
}
</style>


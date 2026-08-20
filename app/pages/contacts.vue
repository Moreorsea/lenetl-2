<template>
  <PageHeader title="О компании">
    Основная информация о компании, реквизиты, лицензия и схема проезда.
  </PageHeader>

  <div class="contacts-container">
    <div class="contact-info">
      <div class="contact-item">
        <h3>
          <i class="fas fa-building"></i>
          Название организации
        </h3>
        <p>
          Общество с ограниченной ответственностью «ЛенЭТЛ»
          <br />
          Санкт-Петербург, Большой Сампсониевский проспект, 29Б, пом. 16-Н
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

      <div class="contact-item">
        <h3>
          <i class="fas fa-certificate"></i>
          Лицензия
        </h3>
        <p>
          № 06-68/ЭЛ-25
          <br />
          <a
            href="/images/license.jpg"
            target="_blank"
            rel="noopener noreferrer">
            Посмотреть лицензию
          </a>
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


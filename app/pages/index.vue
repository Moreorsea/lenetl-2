<template>
  <section class="hero">
    <h2>Электролаборатория до 10 кВ</h2>
    <p>Полный комплекс услуг по испытаниям и измерениям электроустановок и средств защиты.</p>

    <div class="buttons-container">
      <div class="top-buttons">
        <UiButton
          to="/services"
          label="Испытание электроустановок"
          icon-class="fa-plug" />

        <UiButton
          to="/services"
          label="Испытания средств защиты"
          icon-class="fa-shield-alt" />
      </div>
      <div class="license-container">
        <div class="license-box">
          <NuxtImg
            src="images/license.jpg"
            alt="Лицензия ЛенЭТЛ" />
          <div class="license-caption">Лицензия № 06-68/ЭЛ-25</div>
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.hero {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 80vh;
  text-align: center;
  padding: 20px;

  h2 {
    font-size: 3.5rem;
    margin-bottom: 20px;
    text-shadow: 0 0 15px rgba(100, 181, 246, 0.5);
  }

  p {
    font-size: 1.4rem;
    max-width: 700px;
    margin-bottom: 50px;
    color: #e3f2fd;
    line-height: 1.6;
  }
}

.buttons-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 25px;
  width: 100%;
  max-width: 900px;
}

.top-buttons {
  display: flex;
  justify-content: center;
  gap: 40px;
  width: 100%;
  flex-wrap: wrap;
}

.license-container {
  display: flex;
  justify-content: center;
  width: 100%;
  margin-top: 20px;
}

.license-box {
  max-width: 280px;
  background: rgba(13, 20, 70, 0.7);
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(100, 181, 246, 0.3);
  transition: all 0.4s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 35px rgba(100, 181, 246, 0.3);
    border-color: rgba(100, 181, 246, 0.6);
  }

  img {
    width: 100%;
    display: block;
  }
}

.license-caption {
  padding: 15px;
  text-align: center;
  font-size: 1rem;
  color: #e3f2fd;
  background: rgba(25, 118, 210, 0.2);
}

.btn {
  padding: 18px 20px;
  font-size: 1.2rem;
  font-weight: 600;
  border: none;
  border-radius: 50px;
  transition: all 0.4s ease;
  position: relative;
  overflow: hidden;
  z-index: 3;
  min-width: 280px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1.4;
  text-decoration: none;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  }

  &:active {
    transform: translateY(0);
  }

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(255, 255, 255, 0.1);
    z-index: -1;
    transform: scale(0);
    transition: transform 0.4s ease;
    border-radius: 50px;
  }

  &:hover::after {
    transform: scale(1);
  }

  i {
    margin-right: 12px;
    font-size: 1.6rem;
    min-width: 30px;
    text-align: center;
  }
}

.btn-text {
  display: flex;
  flex-direction: column;
  text-align: center;
  line-height: 1.3;

  span:first-child {
    margin-bottom: 2px;
  }
}

.content {
  position: relative;
  z-index: 2;
  backdrop-filter: none;
  text-decoration: none;
}

// h2 {
//   margin: 0 0 1rem;
//   font-size: 1.8rem;
//   font-weight: 600;
//   letter-spacing: -0.02em;
// }

// p {
//   margin: 0;
//   font-size: 1.05rem;
//   line-height: 1.55;
//   opacity: 0.92;
// }
</style>

<style lang="scss" scoped>
.main {
  display: flex;
  max-width: 1200px;
  justify-content: space-between;
  margin: 0 auto;

  &__circle {
    width: 610px;
    height: 610px;
    border-radius: 100%;
    //background-color: rgba(#121212, 0.4);
    background-color: rgba(lightgreen, 0.4);
    backdrop-filter: blur(10px);
    position: relative;

    img {
      position: absolute;
      top: 100px;
      right: 0;
    }
  }
}
</style>

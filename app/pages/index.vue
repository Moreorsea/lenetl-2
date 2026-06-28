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
          <button
            type="button"
            class="license-preview-trigger"
            aria-label="Открыть предпросмотр лицензии"
            @click="openLicensePreview">
            <NuxtImg
              src="images/license.jpg"
              alt="Лицензия ЛенЭТЛ" />
            <span class="license-preview-trigger__hint" aria-hidden="true">
              <i class="fas fa-search-plus"></i>
            </span>
          </button>
          <div class="license-caption">Лицензия № 06-68/ЭЛ-25</div>
        </div>
      </div>
    </div>
  </section>

  <Teleport to="body">
    <Transition name="license-preview">
      <div
        v-if="isLicensePreviewOpen"
        class="license-preview"
        role="dialog"
        aria-modal="true"
        aria-label="Предпросмотр лицензии"
        @click.self="closeLicensePreview">
        <button
          type="button"
          class="license-preview__close"
          aria-label="Закрыть предпросмотр"
          @click="closeLicensePreview">
          <i class="fas fa-times"></i>
        </button>
        <div class="license-preview__content">
          <NuxtImg
            src="images/license.jpg"
            alt="Лицензия ЛенЭТЛ" />
          <p class="license-preview__caption">Лицензия № 06-68/ЭЛ-25</p>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script lang="ts" setup>
const isLicensePreviewOpen = ref(false);

let escapeHandler: ((event: KeyboardEvent) => void) | null = null;

const openLicensePreview = () => {
  isLicensePreviewOpen.value = true;
};

const closeLicensePreview = () => {
  isLicensePreviewOpen.value = false;
};

watch(isLicensePreviewOpen, (open) => {
  if (!import.meta.client) return;

  document.body.style.overflow = open ? 'hidden' : '';

  if (open) {
    escapeHandler = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeLicensePreview();
    };
    document.addEventListener('keydown', escapeHandler);
    return;
  }

  if (escapeHandler) {
    document.removeEventListener('keydown', escapeHandler);
    escapeHandler = null;
  }
});

onUnmounted(() => {
  if (!import.meta.client) return;

  document.body.style.overflow = '';
  if (escapeHandler) {
    document.removeEventListener('keydown', escapeHandler);
  }
});
</script>

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
    font-size: clamp(1.75rem, 5vw, 3.5rem);
    margin-bottom: 20px;
    max-width: 100%;
    line-height: 1.2;
    text-shadow: 0 0 15px rgba(100, 181, 246, 0.5);
  }

  p {
    font-size: clamp(1rem, 2.5vw, 1.4rem);
    max-width: 700px;
    margin-bottom: 50px;
    color: #e3f2fd;
    line-height: 1.6;
  }
}

@media (max-width: 768px) {
  .hero {
    min-height: auto;
    padding: 32px 16px 48px;

    h2 {
      margin-bottom: 16px;
    }

    p {
      margin-bottom: 32px;
    }
  }

  .top-buttons {
    flex-direction: column;
    align-items: stretch;
    gap: 14px;
    max-width: 320px;
  }

  .buttons-container {
    gap: 20px;
  }

  .license-container {
    margin-top: 8px;
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

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 35px rgba(100, 181, 246, 0.3);
    border-color: rgba(100, 181, 246, 0.6);
  }
}

.license-preview-trigger {
  position: relative;
  display: block;
  width: 100%;
  padding: 0;
  border: none;
  background: none;
  cursor: zoom-in;

  img {
    width: 100%;
    display: block;
  }

  &__hint {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(13, 20, 70, 0.55);
    color: #e3f2fd;
    font-size: 2rem;
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover &__hint,
  &:focus-visible &__hint {
    opacity: 1;
  }

  &:focus-visible {
    outline: 2px solid #64b5f6;
    outline-offset: -2px;
  }
}

.license-preview-enter-active,
.license-preview-leave-active {
  transition: opacity 0.25s ease;

  .license-preview__content {
    transition: transform 0.25s ease;
  }
}

.license-preview-enter-from,
.license-preview-leave-to {
  opacity: 0;

  .license-preview__content {
    transform: scale(0.95);
  }
}

.license-preview {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: rgba(5, 10, 40, 0.55);
  backdrop-filter: blur(12px) saturate(140%);
  -webkit-backdrop-filter: blur(12px) saturate(140%);

  &__close {
    position: absolute;
    top: 20px;
    right: 20px;
    width: 44px;
    height: 44px;
    border: 1px solid rgba(255, 255, 255, 0.15);
    border-radius: 50%;
    background: rgba(40, 40, 60, 0.25);
    backdrop-filter: blur(16px) saturate(160%);
    -webkit-backdrop-filter: blur(16px) saturate(160%);
    color: #e3f2fd;
    font-size: 1.25rem;
    cursor: pointer;
    box-shadow:
      0 8px 24px rgba(0, 0, 0, 0.3),
      inset 0 0 0 1px rgba(255, 255, 255, 0.06);
    transition: all 0.2s ease;

    &:hover {
      border-color: rgba(100, 181, 246, 0.5);
      background: rgba(25, 118, 210, 0.25);
    }
  }

  &__content {
    max-width: min(900px, 100%);
    max-height: calc(100vh - 48px);
    overflow: auto;
    border-radius: 16px;
    background: rgba(40, 40, 60, 0.22);
    backdrop-filter: blur(24px) saturate(180%);
    -webkit-backdrop-filter: blur(24px) saturate(180%);
    border: 1px solid rgba(255, 255, 255, 0.14);
    box-shadow:
      0 24px 64px rgba(0, 0, 0, 0.45),
      inset 0 0 0 1px rgba(255, 255, 255, 0.08);
    background-image:
      radial-gradient(circle at 20% 0%, rgba(100, 181, 246, 0.12) 0%, transparent 55%),
      radial-gradient(circle at 80% 100%, rgba(100, 140, 255, 0.08) 0%, transparent 60%);

    img {
      display: block;
      width: 100%;
      height: auto;
    }
  }

  &__caption {
    margin: 0;
    padding: 16px;
    text-align: center;
    font-size: 1.1rem;
    color: #e3f2fd;
    background: rgba(25, 118, 210, 0.12);
    border-top: 1px solid rgba(255, 255, 255, 0.08);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
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

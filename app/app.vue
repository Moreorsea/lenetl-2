<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <UiToastContainer />
  </div>
</template>

<style lang="scss">
:root {
  /* Базовая цветовая схема */
  --lenet-dark: #0d1b2a;
  --lenet-primary: #0d47a1;
  --lenet-light-text: #e3f2fd;
  --lenet-accent: #ffb703;
  --lenet-accent-soft: #90caf9;
  --lenet-accent-softest: #bbdefb;

  /* Тексты/границы с прозрачностью */
  --lenet-border-soft: rgba(13, 27, 42, 0.18);
  --lenet-legal-text: rgba(13, 27, 42, 0.68);
  --lenet-legal-text-strong: rgba(13, 27, 42, 0.72);

  /* Слайдер/стекло на главной */
  --lenet-shadow-accent: rgba(100, 181, 246, 0.5);
  --lenet-shadow-accent-strong: rgba(100, 181, 246, 0.7);
  --lenet-glass-bg: rgba(13, 20, 70, 0.42);
  --lenet-glass-border: rgba(255, 255, 255, 0.1);
  --lenet-glass-inset: rgba(255, 255, 255, 0.06);
  --lenet-desc-text: rgba(227, 242, 253, 0.88);

  /* Светлые варианты (для тёмных блоков/футера) */
  --lenet-border-light: rgba(227, 242, 253, 0.18);
  --lenet-legal-text-light: rgba(227, 242, 253, 0.68);
  --lenet-legal-text-light-strong: rgba(227, 242, 253, 0.72);

  /* Фон страницы */
  --lenet-bg: #ffffff;
  --lenet-header-bg: #f2f5f8;
  --lenet-body-text: var(--lenet-dark);
  --lenet-text-muted: rgba(13, 27, 42, 0.72);
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

body {
  color: var(--lenet-body-text);
  min-height: 100vh;
  overflow-x: hidden;
  position: relative;
  background-color: var(--lenet-bg);
}
</style>

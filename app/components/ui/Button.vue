<template>
  <NuxtLink
    :to="to"
    class="glass-card"
    :class="`glass-card--${mode}`">
    <i
      class="fas"
      :class="iconClass"></i>
    <span class="content">{{ label }}</span>
  </NuxtLink>
</template>

<script lang="ts" setup>
const {mode = "light"} = defineProps<{ to: string; label: string; iconClass: string, mode?: "dark" | "light" }>();
</script>

<style lang="scss" scoped>
.glass-card {
  position: relative;
  padding: 1.5rem 2rem;
  border-radius: 50px;
  overflow: hidden;
  color: white;
  font-size: 1.5rem;
  display: flex;
  gap: 0.5rem;
  align-items: center;
  // width: fit-content;

  /* Главный стеклянный эффект */
  background: rgba(40, 40, 60, 0.18);
  backdrop-filter: blur(20px) saturate(160%);
  -webkit-backdrop-filter: blur(20px) saturate(160%);

  /* Тонкая светлая обводка (glow) */
  border: 1px solid rgba(255, 255, 255, 0.12);
  box-shadow:
    0 8px 32px rgba(0, 0, 0, 0.35),
    inset 0 0 0 1px rgba(255, 255, 255, 0.08);

  /* Лёгкий градиент внутри для объёма */
  background-image:
    radial-gradient(circle at 30% 20%, rgba(100, 140, 255, 0.08) 0%, transparent 60%),
    radial-gradient(circle at 70% 80%, rgba(180, 100, 255, 0.06) 0%, transparent 70%);
  text-decoration: none;

  &--dark {
    // color: black;
    // background: linear-gradient(135deg, #0a0f2a, #0d1a3a);
    background: rgba(20, 30, 55, 0.9);
    text-decoration: none;
  }

  &:hover {
    transform: scale(1.05);
  }

  @media (max-width: 768px) {
    width: 100%;
    justify-content: center;
    font-size: 1rem;
    padding: 1rem 1.25rem;
    border-radius: 16px;

    i {
      font-size: 1.2rem;
    }
  }

  /* 3. Имитация лёгкого шума / grain (очень важно для реализма) */
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
    pointer-events: none;
    mix-blend-mode: overlay;
    border-radius: inherit;
  }
}
</style>

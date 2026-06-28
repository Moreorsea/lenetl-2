<template>
  <section class="page-header" :class="{ 'page-header--narrow': narrow }">
    <div class="page-header__title-row">
      <NuxtLink to="/" class="page-header__back" aria-label="На главную">
        <i class="fas fa-chevron-left" />
      </NuxtLink>
      <h1>{{ title }}</h1>
    </div>
    <p v-if="$slots.default" class="page-header__desc">
      <slot />
    </p>
  </section>
</template>

<script lang="ts" setup>
defineProps<{
  title: string
  narrow?: boolean
}>()
</script>

<style lang="scss" scoped>
.page-header {
  text-align: center;
  margin-bottom: 50px;
  padding-top: 24px;

  &--narrow {
    max-width: 800px;
    margin-left: auto;
    margin-right: auto;
  }

  &__title-row {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 20px;
    min-height: 40px;
  }

  &__back {
    position: absolute;
    left: 0;
    display: flex;
    align-items: center;
    color: #1976d2;
    text-decoration: none;
    font-size: 1.25rem;
    line-height: 1;
    transition: color 0.2s, transform 0.2s;

    &:hover {
      color: #64b5f6;
      transform: translateX(-2px);
    }
  }

  h1 {
    margin: 0;
    padding: 0 44px;
    font-size: 2.8rem;
    text-shadow: 0 0 20px rgba(100, 181, 246, 0.7);
    background: linear-gradient(to right, #e3f2fd, #bbdefb);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;

    @media (max-width: 768px) {
      font-size: 2rem;
    }

    @media (max-width: 480px) {
      font-size: 1.6rem;
    }
  }

  &--narrow h1 {
    font-size: 2.4rem;

    @media (max-width: 768px) {
      font-size: 2rem;
    }
  }

  &__desc {
    font-size: 1.2rem;
    max-width: 800px;
    margin: 0 auto;
    line-height: 1.6;
    color: #e3f2fd;
    text-shadow: 0 0 10px rgba(100, 181, 246, 0.5);

    @media (max-width: 768px) {
      font-size: 1rem;
      padding: 0 20px;
    }
  }
}
</style>

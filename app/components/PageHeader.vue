<template>
  <section class="page-header" :class="{ 'page-header--narrow': narrow }">
    <h1>{{ title }}</h1>
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

  h1 {
    margin: 0 0 20px;
    font-size: 2.8rem;
    color: var(--lenet-body-text);

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
    color: var(--lenet-text-muted);

    @media (max-width: 768px) {
      font-size: 1rem;
      padding: 0 20px;
    }
  }
}
</style>

<template>
  <nav
    class="mobile-bottom-nav"
    aria-label="Основная навигация">
    <NuxtLink
      v-for="item in siteNavItems"
      :key="item.to"
      :to="item.to"
      class="mobile-bottom-nav__item"
      :class="{ 'mobile-bottom-nav__item--active': isNavItemActive(route.path, item) }">
      <i
        class="fas mobile-bottom-nav__icon"
        :class="item.icon"
        aria-hidden="true" />
      <span class="mobile-bottom-nav__label">{{ item.label }}</span>
    </NuxtLink>
  </nav>
</template>

<script lang="ts" setup>
const route = useRoute();
</script>

<style lang="scss" scoped>
.mobile-bottom-nav {
  display: none;
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 150;
  padding: 10px 8px calc(10px + env(safe-area-inset-bottom, 0px));
  background: rgba(13, 27, 42, 0.96);
  border-top: 1px solid rgba(100, 181, 246, 0.22);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);

  &__item {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 6px;
    min-width: 0;
    padding: 8px 6px;
    color: rgba(187, 222, 251, 0.75);
    text-decoration: none;
    -webkit-tap-highlight-color: transparent;
    transition: color 0.2s ease;

    &:hover {
      color: #90caf9;
    }

    &--active {
      color: #64b5f6;

      .mobile-bottom-nav__icon {
        transform: translateY(-1px);
      }
    }
  }

  &__icon {
    font-size: 1.15rem;
    line-height: 1;
    transition: transform 0.2s ease;
  }

  &__label {
    font-size: 0.62rem;
    font-weight: 500;
    line-height: 1.1;
    text-align: center;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 100%;
  }
}

@media (max-width: 768px) {
  .mobile-bottom-nav {
    display: flex;
  }
}
</style>

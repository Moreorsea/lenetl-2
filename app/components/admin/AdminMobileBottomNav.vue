<template>
  <nav
    class="admin-mobile-bottom-nav"
    aria-label="Навигация админки">
    <NuxtLink
      to="/admin/submissions"
      class="admin-mobile-bottom-nav__item"
      :class="{ 'admin-mobile-bottom-nav__item--active': isActiveSubmissions }">
      <i
        class="fas fa-inbox admin-mobile-bottom-nav__icon"
        aria-hidden="true" />
      <span class="admin-mobile-bottom-nav__label">Заявки</span>
    </NuxtLink>

    <NuxtLink
      to="/admin/submissions/deleted"
      class="admin-mobile-bottom-nav__item"
      :class="{ 'admin-mobile-bottom-nav__item--active': isDeletedSubmissions }">
      <span class="admin-mobile-bottom-nav__icon-wrap">
        <i
          class="fas fa-trash-alt admin-mobile-bottom-nav__icon"
          aria-hidden="true" />
        <span
          v-if="counts.deleted > 0"
          class="admin-mobile-bottom-nav__badge">
          {{ counts.deleted }}
        </span>
      </span>
      <span class="admin-mobile-bottom-nav__label">Удалённые</span>
    </NuxtLink>

    <NuxtLink
      to="/admin/submissions/history"
      class="admin-mobile-bottom-nav__item"
      :class="{ 'admin-mobile-bottom-nav__item--active': isHistorySubmissions }">
      <i
        class="fas fa-history admin-mobile-bottom-nav__icon"
        aria-hidden="true" />
      <span class="admin-mobile-bottom-nav__label">История</span>
    </NuxtLink>

    <button
      type="button"
      class="admin-mobile-bottom-nav__item admin-mobile-bottom-nav__item--logout"
      @click="logout">
      <i
        class="fas fa-sign-out-alt admin-mobile-bottom-nav__icon"
        aria-hidden="true" />
      <span class="admin-mobile-bottom-nav__label">Выйти</span>
    </button>
  </nav>
</template>

<script lang="ts" setup>
const route = useRoute()
const { counts } = useSubmissionCounts()

const isDeletedSubmissions = computed(() => route.path.startsWith('/admin/submissions/deleted'))
const isHistorySubmissions = computed(() => route.path.startsWith('/admin/submissions/history'))

const isActiveSubmissions = computed(() => {
  if (isDeletedSubmissions.value || isHistorySubmissions.value) return false
  return route.path === '/admin/submissions' || /^\/admin\/submissions\/\d+$/.test(route.path)
})

const logout = async () => {
  await $fetch('/api/admin/logout', { method: 'POST' })
  await navigateTo('/admin')
}
</script>

<style lang="scss" scoped>
.admin-mobile-bottom-nav {
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
    border: none;
    background: transparent;
    color: rgba(187, 222, 251, 0.75);
    text-decoration: none;
    font: inherit;
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
    transition: color 0.2s ease;

    &:hover {
      color: #90caf9;
    }

    &--active {
      color: #64b5f6;

      .admin-mobile-bottom-nav__icon {
        transform: translateY(-1px);
      }
    }

    &--logout:hover {
      color: #ef9a9a;
    }
  }

  &__icon-wrap {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  &__icon {
    font-size: 1.15rem;
    line-height: 1;
    transition: transform 0.2s ease;
  }

  &__badge {
    position: absolute;
    top: -8px;
    right: -10px;
    min-width: 16px;
    height: 16px;
    padding: 0 4px;
    border-radius: 999px;
    background: var(--lenet-accent);
    color: #1a1a1a;
    font-size: 0.62rem;
    font-weight: 700;
    line-height: 16px;
    text-align: center;
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
  .admin-mobile-bottom-nav {
    display: flex;
  }
}
</style>

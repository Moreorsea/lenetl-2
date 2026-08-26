<template>
  <div class="admin-layout">
    <aside class="admin-sidebar">
      <div class="admin-sidebar__brand">
        <span class="admin-sidebar__logo">⚡</span>
        <span class="admin-sidebar__title">ЛенЭТЛ Admin</span>
      </div>

      <nav class="admin-sidebar__nav admin-sidebar__nav--desktop">
        <NuxtLink
          to="/admin/submissions"
          class="admin-sidebar__link"
          :class="{ 'admin-sidebar__link--active': isActiveSubmissions }">
          <i class="fas fa-inbox"></i>
          <span>Заявки</span>
        </NuxtLink>
        <NuxtLink
          to="/admin/submissions/deleted"
          class="admin-sidebar__link"
          :class="{ 'admin-sidebar__link--active': isDeletedSubmissions }">
          <span class="admin-sidebar__icon-wrap">
            <i class="fas fa-trash-alt"></i>
            <span
              v-if="counts.deleted > 0"
              class="admin-sidebar__badge">
              {{ counts.deleted }}
            </span>
          </span>
          <span>Удалённые</span>
        </NuxtLink>
        <NuxtLink
          to="/admin/submissions/history"
          class="admin-sidebar__link"
          :class="{ 'admin-sidebar__link--active': isHistorySubmissions }">
          <i class="fas fa-history"></i>
          <span>История заявок</span>
        </NuxtLink>
      </nav>

      <button
        type="button"
        class="admin-sidebar__logout admin-sidebar__logout--desktop"
        @click="logout">
        <i class="fas fa-sign-out-alt"></i>
        <span>Выйти</span>
      </button>
    </aside>

    <main class="admin-main">
      <slot />
    </main>

    <AdminMobileBottomNav />
  </div>
</template>

<script lang="ts" setup>
const route = useRoute()
const { counts, refreshSubmissionCounts } = useSubmissionCounts()
const requestFetch = useRequestFetch()

await useAsyncData('admin-submission-counts', () => refreshSubmissionCounts(requestFetch))

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
.admin-layout {
  display: flex;
  min-height: 100vh;
  background: var(--lenet-bg);
  color: var(--lenet-body-text);
}

.admin-sidebar {
  width: 240px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  padding: 24px 16px;
  background: var(--lenet-header-bg);
  border-right: 1px solid rgba(13, 27, 42, 0.1);

  &__brand {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 0 12px 24px;
    font-size: 1.05rem;
    font-weight: 800;
    color: var(--lenet-body-text);
    text-transform: uppercase;
    letter-spacing: -0.02em;
    border-bottom: 1px solid rgba(13, 27, 42, 0.08);
    margin-bottom: 16px;
  }

  &__logo {
    font-size: 1.4rem;
  }

  &__nav {
    display: flex;
    flex-direction: column;
    gap: 4px;
    flex: 1;
  }

  &__link {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 12px 14px;
    border-radius: 8px;
    color: var(--lenet-text-muted);
    text-decoration: none;
    transition: color 0.2s ease, background 0.2s ease;

    i {
      width: 18px;
      text-align: center;
    }

    &:hover {
      background: rgba(255, 255, 255, 0.7);
      color: var(--lenet-body-text);
    }

    &--active {
      background: #fff;
      color: var(--lenet-body-text);
      box-shadow: 0 8px 20px -10px rgba(13, 27, 42, 0.18);

      i {
        color: var(--lenet-accent);
      }
    }
  }

  &__icon-wrap {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 18px;
    flex-shrink: 0;
  }

  &__badge {
    position: absolute;
    top: -7px;
    right: -10px;
    min-width: 16px;
    height: 16px;
    padding: 0 4px;
    border-radius: 999px;
    background: var(--lenet-body-text);
    color: #fff;
    font-size: 0.62rem;
    font-weight: 700;
    line-height: 16px;
    text-align: center;
  }

  &__logout {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-top: auto;
    padding: 12px 14px;
    border: 1px solid rgba(13, 27, 42, 0.12);
    border-radius: 8px;
    background: #fff;
    color: var(--lenet-text-muted);
    cursor: pointer;
    transition: color 0.2s ease, border-color 0.2s ease, background 0.2s ease;

    &:hover {
      color: #c62828;
      border-color: rgba(198, 40, 40, 0.25);
      background: rgba(198, 40, 40, 0.04);
    }
  }
}

.admin-main {
  flex: 1;
  min-width: 0;
  padding: 32px;
  overflow-x: auto;
}

@media (max-width: 768px) {
  .admin-layout {
    flex-direction: column;
  }

  .admin-sidebar {
    width: 100%;
    flex-direction: row;
    align-items: center;
    padding: 12px 16px;
    border-right: none;
    border-bottom: 1px solid rgba(13, 27, 42, 0.1);
  }

  .admin-sidebar__brand {
    flex: 1;
    min-width: 0;
    padding: 0;
    margin: 0;
    border-bottom: none;
    font-size: 0.95rem;
  }

  .admin-sidebar__title {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .admin-sidebar__nav--desktop,
  .admin-sidebar__logout--desktop {
    display: none;
  }

  .admin-main {
    padding: 16px 16px calc(88px + env(safe-area-inset-bottom, 0px));
  }
}
</style>

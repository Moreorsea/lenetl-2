<template>
  <div class="admin-layout">
    <aside class="admin-sidebar">
      <div class="admin-sidebar__brand">
        <span class="admin-sidebar__logo">⚡</span>
        <span class="admin-sidebar__title">ЛенЭТЛ Admin</span>
      </div>

      <nav class="admin-sidebar__nav">
        <NuxtLink
          to="/admin/submissions"
          class="admin-sidebar__link"
          :class="{ 'admin-sidebar__link--active': isSubmissionsSection }">
          <i class="fas fa-inbox"></i>
          <span>Заявки</span>
        </NuxtLink>
      </nav>

      <button
        type="button"
        class="admin-sidebar__logout"
        @click="logout">
        <i class="fas fa-sign-out-alt"></i>
        <span>Выйти</span>
      </button>
    </aside>

    <main class="admin-main">
      <slot />
    </main>
  </div>
</template>

<script lang="ts" setup>
const route = useRoute()

const isSubmissionsSection = computed(() => route.path.startsWith('/admin/submissions'))

const logout = async () => {
  await $fetch('/api/admin/logout', { method: 'POST' })
  await navigateTo('/admin')
}
</script>

<style lang="scss" scoped>
.admin-layout {
  display: flex;
  min-height: 100vh;
  background: #0f172a;
  color: #e2e8f0;
}

.admin-sidebar {
  width: 240px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  padding: 24px 16px;
  background: rgba(15, 23, 42, 0.95);
  border-right: 1px solid rgba(100, 181, 246, 0.2);
  backdrop-filter: blur(12px);

  &__brand {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 0 12px 24px;
    font-size: 1.1rem;
    font-weight: 600;
    color: #e3f2fd;
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
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
    border-radius: 10px;
    color: #94a3b8;
    text-decoration: none;
    transition: all 0.2s ease;

    i {
      width: 18px;
      text-align: center;
    }

    &:hover {
      background: rgba(100, 181, 246, 0.1);
      color: #e3f2fd;
    }

    &--active {
      background: rgba(25, 118, 210, 0.25);
      color: #fff;
      border: 1px solid rgba(100, 181, 246, 0.35);
    }
  }

  &__logout {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-top: auto;
    padding: 12px 14px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 10px;
    background: transparent;
    color: #94a3b8;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
      color: #fca5a5;
      border-color: rgba(252, 165, 165, 0.3);
      background: rgba(252, 165, 165, 0.08);
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
    gap: 8px;
    padding: 12px 16px;
    border-right: none;
    border-bottom: 1px solid rgba(100, 181, 246, 0.2);
  }

  .admin-sidebar__brand {
    flex: 1;
    min-width: 0;
    padding: 0;
    margin: 0;
    border-bottom: none;
  }

  .admin-sidebar__title {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .admin-sidebar__nav {
    flex: 0 0 auto;
    flex-direction: row;
  }

  .admin-sidebar__link {
    padding: 10px 12px;

    span {
      display: none;
    }
  }

  .admin-sidebar__logout {
    margin-top: 0;
    padding: 10px 12px;

    span {
      display: none;
    }
  }

  .admin-main {
    padding: 16px;
  }
}
</style>

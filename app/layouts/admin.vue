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
    gap: 8px;
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

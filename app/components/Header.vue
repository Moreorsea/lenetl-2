<template>
  <header ref="headerRef">
    <NuxtLink
      class="logo"
      to="/">
      <i class="fas fa-bolt"></i>
      <h1>ЛенЭТЛ</h1>
    </NuxtLink>

    <button
      type="button"
      class="nav-toggle"
      :aria-expanded="isNavOpen"
      aria-controls="main-nav"
      aria-label="Меню"
      @click="toggleNav">
      <i
        class="fas"
        :class="isNavOpen ? 'fa-times' : 'fa-bars'"></i>
    </button>

    <nav
      id="main-nav"
      class="nav-links nav-links--desktop">
      <NuxtLink to="/services">Услуги</NuxtLink>
      <NuxtLink to="/equipment">Оборудование</NuxtLink>
      <NuxtLink to="/contacts">Контакты</NuxtLink>
      <NuxtLink to="/form">Оставить заявку</NuxtLink>
    </nav>

    <Teleport to="body">
      <Transition
        name="mobile-nav"
        :duration="{ enter: MENU_ANIMATION_MS, leave: MENU_ANIMATION_MS }"
        @leave="onMenuLeave"
        @after-leave="onMenuAfterLeave">
        <div
          v-if="isNavOpen"
          class="mobile-nav"
          :style="{
            '--header-offset': `${headerHeight}px`,
            '--link-last-index': mobileLinks.length - 1,
          }">
          <button
            type="button"
            class="mobile-nav__backdrop"
            aria-label="Закрыть меню"
            @click="isNavOpen = false" />
          <nav class="mobile-nav__panel">
            <NuxtLink
              v-for="(link, index) in mobileLinks"
              :key="link.to"
              :to="link.to"
              class="mobile-nav__link"
              :style="{ '--link-index': index }">
              {{ link.label }}
            </NuxtLink>
          </nav>
        </div>
      </Transition>
    </Teleport>
  </header>
</template>

<script lang="ts" setup>
const isNavOpen = ref(false);
const headerRef = ref<HTMLElement | null>(null);
const headerHeight = ref(64);
const route = useRoute();

const mobileLinks = [
  { to: '/services', label: 'Услуги' },
  { to: '/equipment', label: 'Оборудование' },
  { to: '/contacts', label: 'Контакты' },
  { to: '/form', label: 'Оставить заявку' },
];

const MENU_ANIMATION_MS = 600;

const updateHeaderHeight = () => {
  headerHeight.value = headerRef.value?.offsetHeight ?? 64;
};

watch(
  () => route.path,
  () => {
    isNavOpen.value = false;
  },
);

watch(isNavOpen, (open) => {
  if (!import.meta.client) return;

  if (open) {
    document.body.style.overflow = 'hidden';
  }
});

const onMenuAfterLeave = () => {
  if (!import.meta.client) return;

  document.body.style.overflow = '';
};

const onMenuLeave = (_el: Element, done: () => void) => {
  window.setTimeout(done, MENU_ANIMATION_MS);
};

const toggleNav = (event: MouseEvent) => {
  isNavOpen.value = !isNavOpen.value;
  (event.currentTarget as HTMLButtonElement | null)?.blur();
};

onMounted(() => {
  updateHeaderHeight();
  window.addEventListener('resize', updateHeaderHeight);
});

onUnmounted(() => {
  if (!import.meta.client) return;

  document.body.style.overflow = '';
  window.removeEventListener('resize', updateHeaderHeight);
});
</script>

<style lang="scss" scoped>
header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 0;
  border-bottom: 1px solid rgba(100, 181, 246, 0.3);
}

.logo {
  display: flex;
  align-items: center;
  text-decoration: none;
}

.logo i {
  font-size: 2rem;
  color: #64b5f6;
  margin-right: 10px;
}

.logo h1 {
  font-size: 1.8rem;
  font-weight: 600;
  background: linear-gradient(to right, #64b5f6, #90caf9);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.nav-links {
  display: flex;
  gap: 30px;

  .router-link-active {
    color: #64b5f6;

    &::after {
      content: '';
      position: absolute;
      bottom: -5px;
      left: 0;
      width: 0;
      height: 2px;
      background: #64b5f6;
      transition: width 0.3s;
    }
  }
}

.nav-links a {
  color: #bbdefb;
  text-decoration: none;
  font-weight: 500;
  font-size: 1.1rem;
  transition: color 0.3s;
  position: relative;
}

.nav-links a:hover {
  color: #64b5f6;
}

.nav-links a::after {
  content: '';
  position: absolute;
  bottom: -5px;
  left: 0;
  width: 0;
  height: 2px;
  background: #64b5f6;
  transition: width 0.3s;
}

.nav-links a:hover::after {
  width: 100%;
}

.nav-toggle {
  display: none;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border: none;
  border-radius: 10px;
  background: transparent;
  color: #e3f2fd;
  font-size: 1.35rem;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  transition: color 0.2s ease;

  &:hover {
    color: #64b5f6;
  }

  &:focus {
    outline: none;
  }

  &:focus-visible {
    outline: 2px solid #64b5f6;
    outline-offset: 2px;
  }
}

.mobile-nav {
  position: fixed;
  inset: 0;
  z-index: 200;
  pointer-events: none;

  &__backdrop {
    position: absolute;
    inset: 0;
    border: none;
    background: rgba(5, 12, 30, 0.55);
    pointer-events: auto;
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
  }

  &__panel {
    position: absolute;
    top: var(--header-offset, 64px);
    left: 0;
    right: 0;
    width: 100vw;
    display: flex;
    flex-direction: column;
    padding: 8px 0 24px;
    background: rgba(13, 27, 42, 1);
    pointer-events: auto;
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.35);
  }

  &__link {
    display: block;
    padding: 16px 24px;
    color: #e3f2fd;
    text-decoration: none;
    font-weight: 500;
    font-size: 1.1rem;
    -webkit-tap-highlight-color: transparent;

    &:hover,
    &.router-link-active {
      color: #64b5f6;
      background: rgba(100, 181, 246, 0.08);
    }
  }
}

@media (max-width: 768px) {
  header {
    position: relative;
    z-index: 201;
    padding: 12px 0;
  }

  .logo h1 {
    font-size: 1.4rem;
  }

  .logo i {
    font-size: 1.5rem;
  }

  .nav-toggle {
    display: flex;
  }

  .nav-links--desktop {
    display: none;
  }
}
</style>

<style lang="scss">
.mobile-nav-enter-active,
.mobile-nav-leave-active {
  .mobile-nav__backdrop {
    transition: opacity 0.3s ease;
  }

  .mobile-nav__panel {
    transition:
      transform 0.35s cubic-bezier(0.22, 1, 0.36, 1),
      opacity 0.35s cubic-bezier(0.22, 1, 0.36, 1);
  }

  .mobile-nav__link {
    transition:
      transform 0.35s cubic-bezier(0.22, 1, 0.36, 1),
      opacity 0.35s cubic-bezier(0.22, 1, 0.36, 1),
      color 0.2s ease,
      background 0.2s ease;
  }
}

.mobile-nav-enter-active {
  .mobile-nav__link {
    transition-delay: calc(0.05s + var(--link-index, 0) * 0.05s);
  }
}

.mobile-nav-leave-active {
  .mobile-nav__backdrop {
    transition: opacity 0.15s ease;
    transition-delay: 0s;
    opacity: 0;
    pointer-events: none;
  }

  .mobile-nav__panel {
    transition-delay: 0s;
  }

  .mobile-nav__link {
    transition-delay: calc((var(--link-last-index, 3) - var(--link-index, 0)) * 0.04s);
  }
}

.mobile-nav-enter-from,
.mobile-nav-leave-to {
  .mobile-nav__backdrop {
    opacity: 0;
  }

  .mobile-nav__panel {
    transform: translateY(-16px);
    opacity: 0;
  }

  .mobile-nav__link {
    transform: translateY(-8px);
    opacity: 0;
  }
}
</style>

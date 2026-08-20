<template>
  <header class="site-header">
    <div class="site-header__inner">
      <NuxtLink
        class="logo"
        to="/">
        <i class="fas fa-bolt"></i>
        <h1>ЛенЭТЛ</h1>
      </NuxtLink>

      <nav
        id="main-nav"
        class="nav-links">
        <NuxtLink
          v-for="item in siteNavItems"
          :key="item.to"
          :to="item.to"
          :class="{ 'nav-links__item--active': isNavItemActive(route.path, item, route.hash) }">
          {{ item.label === 'Оборуд.' ? 'Оборудование' : item.label }}
        </NuxtLink>
      </nav>
    </div>
  </header>
</template>

<script lang="ts" setup>
const route = useRoute();
</script>

<style lang="scss" scoped>
.site-header {
  width: 100%;
  background: var(--lenet-header-bg);
  color: var(--lenet-body-text);
  border-bottom: 1px solid var(--lenet-border-soft);
  z-index: 3;

  @media (min-width: 769px) {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 200;
    backdrop-filter: blur(10px);
    background: rgba(242, 245, 248, 0.92);
  }
}

.site-header__inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo {
  display: flex;
  align-items: center;
  text-decoration: none;
}

.logo i {
  font-size: 2rem;
  color: var(--lenet-dark);
  margin-right: 10px;
}

.logo h1 {
  font-size: 1.8rem;
  font-weight: 800;
  color: var(--lenet-dark);
  text-transform: uppercase;
  letter-spacing: -0.02em;
}

.nav-links {
  display: flex;
  gap: 30px;

  &__item--active {
    color: var(--lenet-accent);

    &::after {
      width: 100%;
    }
  }
}

.nav-links a {
  color: var(--lenet-body-text);
  text-decoration: none;
  font-weight: 500;
  font-size: 1.1rem;
  transition: color 0.3s;
  position: relative;
}

.nav-links a:hover {
  color: var(--lenet-accent);
}

.nav-links a::after {
  content: '';
  position: absolute;
  bottom: -5px;
  left: 0;
  width: 0;
  height: 2px;
  background: var(--lenet-accent);
  transition: width 0.3s;
}

.nav-links a:hover::after {
  width: 100%;
}

@media (max-width: 768px) {
  .site-header__inner {
    padding: 12px 16px;
  }

  .logo h1 {
    font-size: 1.4rem;
  }

  .logo i {
    font-size: 1.5rem;
  }

  .nav-links {
    display: none;
  }
}
</style>

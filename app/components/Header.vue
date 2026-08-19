<template>
  <header>
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
        :to="item.to">
        {{ item.label === 'Оборуд.' ? 'Оборудование' : item.label }}
      </NuxtLink>
    </nav>
  </header>
</template>

<script lang="ts" setup>
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

@media (max-width: 768px) {
  header {
    padding: 12px 0;
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

import type { RouterScrollBehavior } from 'vue-router'

const scrollBehavior: RouterScrollBehavior = (to, from) => {
  if (to.hash) {
    // Переключение табов на /services не должно скроллить страницу
    if (from?.path === to.path && to.path === '/services') {
      return false
    }

    return {
      el: to.hash,
      top: 96,
      behavior: 'smooth',
    }
  }

  return { top: 0 }
}

export default {
  scrollBehavior,
}

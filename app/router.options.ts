import type { RouterScrollBehavior } from 'vue-router'

const scrollBehavior: RouterScrollBehavior = (to) => {
  if (to.hash) {
    return {
      el: to.hash,
      top: 24,
      behavior: 'smooth',
    }
  }

  return { top: 0 }
}

export default {
  scrollBehavior,
}

<template>
  <footer>
    <div v-if="!isMain" class="back-btn">
      <UiButton
      to="/"
      label="На главную"
      icon-class="fa-arrow-left"
      mode="dark" />
    </div>

    <p>© 2026 ЛенЭТЛ. Св-во о регистрации № 06-68/ЭЛ-25</p>
  </footer>
</template>

<script lang="ts" setup>
const route = useRoute();

const isMain = computed<boolean>(() => route.path === '/');
</script>

<style lang="scss" scoped>
footer {
  position: relative;
  padding: 20px 0;
  text-align: center;
  //color: #bbdefb;
  font-size: 1rem;
  text-decoration: underline;
  z-index: 3;
  text-shadow: 0 0 5px rgba(100, 181, 246, 0.5);
  color: black;
}

.back-btn {
  display: flex;
  justify-content: center;
  position: relative;
  z-index: 1;
  margin-bottom: 1rem;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(255, 255, 255, 0.2);
    z-index: -1;
    transform: scale(0);
    transition: transform 0.4s ease;
    border-radius: 50px;
  }

  // &:hover::after {
  //   transform: scale(1);
  // }

  // &:active {
  //   transform: translateY(0);
  // }

  i {
    margin-right: 10px;
  }
}
</style>

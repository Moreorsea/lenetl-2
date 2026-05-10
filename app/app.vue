<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<style lang="scss">
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

body {
  //background: linear-gradient(135deg, #0c1445, #1a237e, #0d47a1);
  color: #ffffff;
  min-height: 100vh;
  overflow-x: hidden;
  position: relative;
  background-color: #121212;
  background: linear-gradient(
    to bottom,
    #0d1b2a 0%,
    /* темный верх */ #1b4965 40%,
    /* глубокий синий */ #5fa8d3 80%,
    /* светлый центр/низ */ #cae9ff 100% /* самый светлый блик снизу */
  );
}
</style>

<template>
  <!-- Эффект свечения -->
  <!-- <div class="glow-effect" id="glow"></div> -->

  <!-- Декоративные схемы -->
  <!-- <svg class="circuits" viewBox="0 0 100 100" preserveAspectRatio="none">
    <path class="circuit-line" d="M10,10 C30,5 50,20 70,10 S90,30 90,50" />
    <path class="circuit-line" d="M20,80 Q40,90 60,80 T100,70" />
    <path class="circuit-line" d="M5,40 L40,5" />
    <path class="circuit-line" d="M5,70 L70,5" />
    <path class="circuit-line" d="M30,95 L95,30" />
    <circle cx="40" cy="30" r="1.5" fill="#64b5f6" />
    <circle cx="70" cy="60" r="1.5" fill="#64b5f6" />
    <circle cx="20" cy="20" r="1.5" fill="#64b5f6" />
    <circle cx="80" cy="80" r="1.5" fill="#64b5f6" />
</svg>
  <div class="overlay"></div> -->
  <div class="container">
    <Header />

    <main>
      <slot />
    </main>

    <Footer />
  </div>
</template>

<style lang="scss" scoped>
// .overlay {
//             position: absolute;
//             top: 0;
//             left: 0;
//             width: 100%;
//             height: 100%;
//             background: radial-gradient(circle at center, transparent, rgba(0, 0, 30, 0.9));
//             z-index: 2;
//         }

.container {
  position: relative;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  z-index: 3;
}

.circuits {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  opacity: 0.1;
}

.circuit-line {
  stroke: #64b5f6;
  stroke-width: 1;
  fill: none;
  stroke-dasharray: 5, 5;
}

.glow-effect {
  position: fixed;
  width: 300px;
  height: 300px;
  background: radial-gradient(circle, rgba(0, 195, 255, 0.4) 0%, transparent 70%);
  border-radius: 50%;
  pointer-events: none;
  transform: translate(-50%, -50%);
  filter: blur(40px);
  z-index: 0;
  transition: transform 0.1s ease-out;
  opacity: 0.8;
}
</style>

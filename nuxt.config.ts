// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxt/image'],
  app: {
    head: {
      link: [
        {
          rel: 'stylesheet',
          href: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css',
        },
      ],
    },
  },
  nitro: {
    // Запрещает Nitro бандлить или изолировать Prisma-клиент как Edge-код
    externals: {
      inline: [],
      external: ['@prisma/client', '#prisma']
    }
  },
  devServer: {
    port: 3030,
    host: '127.0.0.1',
  },
});

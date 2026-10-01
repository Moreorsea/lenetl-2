// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: process.env.NODE_ENV !== 'production' },
  modules: ['@nuxt/image'],
  app: {
    head: {
      htmlAttrs: {
        lang: 'ru',
      },
      title: 'ЛенЭТЛ — электролаборатория до 10 кВ',
      meta: [
        {
          name: 'description',
          content:
            'Лицензированная электролаборатория ЛенЭТЛ до 10 кВ: испытания и измерения электроустановок и средств защиты, протоколы, выезд по Санкт-Петербургу и Ленобласти.',
        },
      ],
      link: [
        {
          rel: 'icon',
          type: 'image/png',
          href: '/favicon.ico',
        },
        {
          rel: 'apple-touch-icon',
          href: '/favicon.ico',
        },
        {
          rel: 'preconnect',
          href: 'https://fonts.googleapis.com',
        },
        {
          rel: 'preconnect',
          href: 'https://fonts.gstatic.com',
          crossorigin: '',
        },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Manrope:wght@500;600;700;800&family=Unbounded:wght@600;700;800&display=swap',
        },
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
      external: [
        '@prisma/client',
        '@prisma/adapter-mariadb',
        'mariadb',
        '#prisma',
      ],
    }
  },
  devServer: {
    port: 3030,
    host: '127.0.0.1',
  },
});

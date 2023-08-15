export default defineNuxtConfig({
  // Having SSR allows us to use `nuxt generate`, turn it off if you don't care
  ssr: true,
  devtools: { enabled: true },

  app: {
    head: {
      title: 'Nuxt + VueFire Blaze Plan Example',
      link: [
        {
          href: 'https://cdn.jsdelivr.net/npm/water.css@2/out/water.css',
          rel: 'stylesheet',
        },
        {
          rel: 'icon',
          type: 'image/svg+xml',
          href: '/vuefire.svg',
        },
      ],
    },
  },

  css: ['~/assets/style.css'],

  nitro: {
    preset: 'firebase',

    // for the upcoming preset
    firebase: {
      gen: 2,
      nodeVersion: '18',
    },
  },

  modules: ['nuxt-vuefire', '@vueuse/nuxt'],

  vuefire: {
    emulators: {
      // uncomment this line to run the application in production mode without emulators during dev
      // enabled: false,
      auth: {
        options: {
          disableWarnings: true,
        },
      },
    },
    auth: true,

    appCheck: {
      provider: 'ReCaptchaV3',
      // site key, NOT secret key
      key: '6Ldmc3EnAAAAABDuQi-PGLBObXMOsVlXOntAX6WQ',
      isTokenAutoRefreshEnabled: true,
    },

    config: {
      apiKey: 'AIzaSyBKBqCHUpxMNjRJ8uhgOTK0wMGr9LkkFOA',
      authDomain: 'nuxt-vuefire-example-spark.firebaseapp.com',
      databaseURL:
        'https://nuxt-vuefire-example-spark-default-rtdb.europe-west1.firebasedatabase.app',
      projectId: 'nuxt-vuefire-example-spark',
      storageBucket: 'nuxt-vuefire-example-spark.appspot.com',
      messagingSenderId: '639475067598',
      appId: '1:639475067598:web:13fc8572370163aa913e9f',
    },
  },

  experimental: {
    payloadExtraction: false,
  },

  // Customize this to your needs and try to server side render only what is needed
  // https://nuxt.com/docs/guide/concepts/rendering#hybrid-rendering
  routeRules: {
    '/': { isr: true },
    // Make some pages client only (since we have an SPA)
    // useful for authenticated pages that require the user to be logged in to be
    // displayed
    '/admin': { ssr: false },
    '/users': { ssr: true },
    '/posts/new': { ssr: true },
    '/emoji-panel': { swr: true },
    '/login': { ssr: false },
  },
})

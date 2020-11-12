import customIcons from './assets/images/customIcons.js'

require('dotenv').config()

export default {
  target: 'static',
  ssr: false,

  head: {
    titleTemplate: (title) => {
      return title ? `${title} | NAMA` : 'NAMA : The Assistant Bot'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
    script: [{ src: 'https://apis.google.com/js/api.js' }],
  },

  css: ['~assets/styles/css/webfont.css'],

  plugins: [{ src: '~/plugins/vconsole.js', ssr: false }],

  components: true,

  buildModules: ['@nuxt/typescript-build'],

  modules: [
    '@chakra-ui/nuxt',
    '@nuxtjs/emotion',
    '@nuxtjs/axios',
    '@nuxtjs/dayjs',
    '@nuxtjs/firebase',
    '@nuxtjs/dotenv',
  ],

  chakra: {
    extendTheme: {
      fonts: {
        heading:
          '"Thonburi", "Helvetica Neue", "Helvetica", "Arial", sans-serif',
        body: '"Thonburi", "Helvetica Neue", "Helvetica", "Arial", sans-serif',
      },
    },
    config: {
      autoImport: true,
    },
    icons: {
      extend: { ...customIcons },
    },
  },

  axios: {},
  dayjs: {
    locales: ['en', 'th'],
    defaultLocale: 'th',
    plugins: [], // Your Day.js plugin
  },

  env: {
    FIREBASE_API_KEY: process.env.FIREBASE_API_KEY,
    GCP_CLIENTID: process.env.GCP_CLIENTID,
  },

  firebase: {
    config: {
      apiKey: process.env.FIREBASE_API_KEY,
      authDomain: process.env.FIREBASE_AUTH_DOMAIN,
      databaseURL: process.env.FIREBASE_DATABASE_URL,
      projectId: process.env.FIREBASE_PROJECT_ID,
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.APP_ID,
      measurementId: process.env.MEASUREMENT_ID,
    },
    services: {
      auth: true, // Just as example. Can be any other service.
      firestore: true,
      functions: {
        location: 'asia-northeast1',
        // emulatorPort: 5001,
        // emulatorHost: 'http://localhost',
      },
    },
  },
  build: {},
}

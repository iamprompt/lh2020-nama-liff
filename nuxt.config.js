import customIcons from './assets/images/customIcons.js'

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
  },

  css: ['~assets/styles/css/webfont.css'],

  plugins: [],

  components: true,

  buildModules: ['@nuxt/typescript-build'],

  modules: [
    '@chakra-ui/nuxt',
    '@nuxtjs/emotion',
    '@nuxtjs/axios',
    '@nuxtjs/dayjs',
  ],

  chakra: {
    extendTheme: {
      fonts: {
        heading:
          '"SF Pro TH Display", "SF Pro Display", "Helvetica Neue", "Helvetica", "Arial", sans-serif',
        body:
          '"SF Pro Display", "Thonburi", "Helvetica Neue", "Helvetica", "Arial", sans-serif',
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
  build: {},
}

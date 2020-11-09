import customIcons from './assets/images/customIcons.js'

export default {
  target: 'static',

  head: {
    titleTemplate: (title) => {
      return title
        ? `${title} | NAMA : The Assistant Bot`
        : 'NAMA : The Assistant Bot'
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

  modules: ['@chakra-ui/nuxt', '@nuxtjs/emotion', '@nuxtjs/axios'],

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
  build: {},
}

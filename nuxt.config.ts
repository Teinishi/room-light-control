// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },
  modules: ['@nuxt/eslint', '@nuxt/icon', '@nuxt/ui'],
  css: ['~/assets/css/main.css'],
  app: {
    pageTransition: {
      name: 'page',
      mode: 'out-in'
    }
  },
  devServer: {
    host: '0.0.0.0'
  },
})

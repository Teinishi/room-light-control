// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },
  devServer: {
    host: '0.0.0.0'
  },
  modules: ['@nuxt/eslint', '@nuxt/icon', '@nuxt/ui', '@vite-pwa/nuxt', "@pinia/nuxt"],
  nitro: {
    storage: {
      db: {
        driver: 'fs',
        base: './data/db'
      }
    }
  },
  css: ['~/assets/css/main.css'],
  app: {
    head: {
      htmlAttrs: {
        lang: 'ja'
      },
      title: 'Room Light Control',
      meta: [
        {name: 'theme-color', content: '#00c950'}
      ],
      link: [
        {rel: 'icon', href: `/favicon.ico`, sizes: "48x48"},
        {rel: 'icon', href: `/icon.svg`, sizes: "any", type: "image/avg+xml"},
        {rel: 'apple-touch-icon', href: `/apple-touch-icon-180x180.png`},
      ],
    },
    pageTransition: {
      name: 'page',
      mode: 'out-in'
    }
  },
  pwa: {
    registerType: "autoUpdate",
    manifest: {
      name: 'Room Light Control',
      short_name: "Light",
      start_url: "/",
      lang: "ja",
      display: "standalone",
      theme_color: "#00c950",
      background_color: "#ffffff",
      icons: [
        {
          "src": "pwa-64x64.png",
          "sizes": "64x64",
          "type": "image/png"
        },
        {
          "src": "pwa-192x192.png",
          "sizes": "192x192",
          "type": "image/png"
        },
        {
          "src": "pwa-512x512.png",
          "sizes": "512x512",
          "type": "image/png"
        },
        {
          "src": "maskable-icon-512x512.png",
          "sizes": "512x512",
          "type": "image/png",
          "purpose": "maskable"
        }
      ],
    },
    workbox: {
      navigateFallback: null,
    },
    devOptions: {
      enabled: true,
      type: "module"
    },
  },
})

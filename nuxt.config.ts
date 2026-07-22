// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxt/ui'
  ],
  devtools: {
    enabled: true
  },
  app: {
    head: {
      title: 'IPL System - Manajemen Iuran Warga',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Aplikasi Manajemen Iuran Warga Perumahan & Kampung' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
      ]
    }
  },
  css: ['~/assets/css/main.css'],

  runtimeConfig: {
    authSecret: process.env.NUXT_AUTH_SECRET || 'super-secret',
    public: {
      appName: process.env.NUXT_PUBLIC_APP_NAME || 'IPL System',
      appUrl: process.env.NUXT_PUBLIC_APP_URL || 'https://ipl-system.netlify.app',
      supabaseUrl: process.env.SUPABASE_URL || '',
      supabaseAnonKey: process.env.SUPABASE_ANON_KEY || ''
    }
  },

  ssr: false,

  routeRules: {
    '/': { redirect: '/cek-tagihan' }
  },

  compatibilityDate: '2026-06-30',

  nitro: {
    preset: 'netlify',
    experimental: {
      asyncContext: true
    }
  },

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  }
})

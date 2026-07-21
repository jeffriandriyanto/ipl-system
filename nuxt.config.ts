// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxt/ui'
  ],

  devtools: {
    enabled: true
  },

  css: ['~/assets/css/main.css'],

  routeRules: {
    '/': { redirect: '/cek-tagihan' },
    '/admin/**': { ssr: false }
  },

  compatibilityDate: '2026-06-30',

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  },

  runtimeConfig: {
    // Private (server-side only)
    authSecret: process.env.NUXT_AUTH_SECRET || 'super-secret',
    
    // Public (exposed to client)
    public: {
      appName: process.env.NUXT_PUBLIC_APP_NAME || 'IPL System',
      appUrl: process.env.NUXT_PUBLIC_APP_URL || 'https://ipl-system.netlify.app',
      supabaseUrl: process.env.SUPABASE_URL || '',
      supabaseAnonKey: process.env.SUPABASE_ANON_KEY || ''
    }
  },

  // Nitro configuration for server routes
  nitro: {
    experimental: {
      asyncContext: true
    }
  },

  // App configuration
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
  }
})

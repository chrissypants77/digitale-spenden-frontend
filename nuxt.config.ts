// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    runtimeConfig: {
        public: {
            apiBaseUrl: 'http://localhost:8000/api/v1'
        }
    },
    nitro: {
        experimental: {
            websocket: true
        }

    },
    ssr: false,
    modules: ['@nuxt/ui', '@nuxt/image', '@pinia/nuxt'],

    colorMode: {
        preference: "system"
    },

    devtools: {
        enabled: true
    },

    css: ['~/assets/css/main.css'],

    routeRules: {
        '/': {prerender: true}
    },

    compatibilityDate: '2026-06-30',
})
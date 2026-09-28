// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    runtimeConfig: {
        public: {
            apiBaseUrl: 'http://localhost:8000/api/v1',
            geoapifyApiKey: process.env.GEOAPIFY_AUTOCOMPLETE_KEY
        }
    },
    ssr: false,
    modules: ['@nuxt/ui', '@nuxt/image', '@pinia/nuxt'],

    colorMode: {
        preference: "system"
    },

    image: {
        provider: 'none'
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
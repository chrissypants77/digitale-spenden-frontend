export default defineNuxtPlugin(() => {
    const config = useRuntimeConfig()

    // Normal API - no authentication
    const api = $fetch.create({
        baseURL: config.public.apiBaseUrl
    })

    // Authenticated API
    const authApi = $fetch.create({
        baseURL: config.public.apiBaseUrl,

        async onRequest({ options }) {
            const session = await cookieStore.get("userSession")

            if (session) {
                const headers = new Headers(options.headers)

                headers.set(
                    "Authorization",
                    `Bearer ${session.value}`
                )

                options.headers = headers
            }
        }
    })

    return {
        provide: {
            api,
            authApi
        }
    }
})
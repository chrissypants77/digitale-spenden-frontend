export async function logout(): Promise<boolean> {
    const config = useRuntimeConfig()

    const session = await cookieStore.get("userSession")
    if (!session) return false

    try {
        const request = await $fetch.raw(`${config.public.apiBaseUrl}/admin/logout`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${session?.value}`
            }
        })

        return request.ok
    } catch (error) {
        return false
    }
}
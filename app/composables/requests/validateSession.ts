interface RequestReturn {
    id: string
    expiresAt: string
}

export async function validateSession(): Promise<RequestReturn | false> {
    const config = useRuntimeConfig()

    const session = await cookieStore.get("userSession")
    if (!session) return false

    try {
        const request = await $fetch.raw(`${config.public.apiBaseUrl}/admin/authenticate`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${session?.value}`
            }
        })
        if (request.ok) {
            return JSON.parse(request._data as string) as RequestReturn
        }
        return false
    } catch (error) {
        return false
    }



}
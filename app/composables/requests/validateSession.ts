interface RequestReturn {
    id: string
    expiresAt: string
}

export async function validateSession(): Promise<RequestReturn | false> {
    const { $authApi } = useNuxtApp()

    try {
        return await $authApi<RequestReturn>(`/admin/authenticate`, {
            method: 'GET'
        })
    } catch (error) {
        return false
    }
}
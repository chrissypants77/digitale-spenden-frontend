export async function logout(): Promise<boolean> {
    const { $authApi } = useNuxtApp()

    try {
        return await $authApi(`/admin/logout`, {
            method: 'GET'
        })
    } catch (error) {
        return false
    }
}
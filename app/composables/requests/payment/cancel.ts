export async function cancel(id: string): Promise<unknown | false> {
    const { $api } = useNuxtApp()

    try {
        return await $api(`/donation/cancel/${id}`, {
            method: 'GET'
        })
    } catch (error) {
        return false
    }
}
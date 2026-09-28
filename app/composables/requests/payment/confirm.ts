interface ConfirmResponse {
    id: string
    processor: string
    redirectUrl: string
    status: string
}

export async function confirm(id: string): Promise<ConfirmResponse | false> {
    const { $api } = useNuxtApp()

    try {
        return await $api<ConfirmResponse>(`/donation/status/${id}`, {
            method: 'GET'
        })
    } catch (error) {
        return false
    }
}
interface ConfirmResponse {
    id: string
    processor: string
    redirectUrl: string
    status: string
}

export async function confirm(id: string): Promise<ConfirmResponse | false> {
    const config = useRuntimeConfig()

    try {
        const request = await $fetch.raw(`${config.public.apiBaseUrl}/donation/status/${id}`, {
            method: "GET",
        })
        if (request.ok) {
            console.log(request._data)
            return request._data as ConfirmResponse
        }
        return false
    } catch (error) {
        return false
    }
}
export async function cancel(id: string): Promise<unknown | false> {
    const config = useRuntimeConfig()

    try {
        const request = await $fetch.raw(`${config.public.apiBaseUrl}/donation/cancel/${id}`, {
            method: "GET",
        })
        if (request.ok) {
            console.log(request._data)
            return request._data
        }
        return false
    } catch (error) {
        return false
    }
}
interface Options {
    startDate: string
    endDate: string
}


export async function exportDonations(options: Options): Promise<string | false> {
    const config = useRuntimeConfig()

    const session = await cookieStore.get("userSession")
    if (!session) return false

    try {
        let query = ""
        if (options.startDate && options.endDate) {
            query = `?startDate=${options.startDate}&endDate=${options.endDate}`
        }

        const request = await $fetch.raw(`${config.public.apiBaseUrl}/donation/admin/export_csv${query}`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${session?.value}`
            },
        })
        if (request.ok) {
            return request._data as string
        }
        return false
    } catch (error) {
        return false
    }
}
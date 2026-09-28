interface Options {
    startDate: string
    endDate: string
}


export async function exportDonations(options: Options): Promise<string | false> {
    const { $authApi } = useNuxtApp()

    try {
        let query = ""
        if (options.startDate && options.endDate) {
            query = `?startDate=${options.startDate}&endDate=${options.endDate}`
        }

        return await $authApi<string>(`/donation/admin/export_csv${query}`, {
            method: 'GET'
        })
    } catch (error) {
        return false
    }

}
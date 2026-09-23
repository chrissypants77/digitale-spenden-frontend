interface Donator {
    email: string
    name: string
}

export interface GetDonationsReturn {
    amount: number
    currency: string
    date: string
    donator: Donator
    id: number
    payment_method: string
    name?: string
    email?: string
}

export async function getDonations(): Promise<GetDonationsReturn[] | false> {
    const config = useRuntimeConfig()

    const session = await cookieStore.get("userSession")
    if (!session) return false

    try {
        const request = await $fetch.raw(`${config.public.apiBaseUrl}/donation/admin/list`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${session?.value}`
            }
        })
        if (request.ok) {
            return request._data as GetDonationsReturn[]
        }
        return false
    } catch (error) {
        return false
    }



}
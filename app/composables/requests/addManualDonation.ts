interface ResponseData {
    id: string
    expiresAt: string
    name: string
}

export interface ManualDonationOptions {
    date: string
    amount: number
    payment_method: string
    status?: string
    name: string
    email: string
    currentTime?: boolean
}

export async function addManualDonation(options: ManualDonationOptions): Promise<boolean> {
    const config = useRuntimeConfig()

    const session = await cookieStore.get("userSession")
    if (!session) return false

    try {
        const request = await $fetch.raw(`${config.public.apiBaseUrl}/donation/admin/create`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${session?.value}`
            },
            body: JSON.stringify(options)
        })

        return request.ok
    } catch(error) {
        return false
    }
}
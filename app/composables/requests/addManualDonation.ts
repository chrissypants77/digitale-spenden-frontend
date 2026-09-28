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

export async function addManualDonation(
    options: ManualDonationOptions
): Promise<boolean> {
    const { $authApi } = useNuxtApp()

    try {
        await $authApi('/donation/admin/create', {
            method: 'POST',
            body: options
        })

        return true
    } catch {
        return false
    }
}
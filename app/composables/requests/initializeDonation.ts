export interface InitializeDonationReturn {
    id: string
    processor: string
    redirectUrl: string
    status: string
}


export async function initializeDonation(donationAmount: number): Promise<InitializeDonationReturn | false> {
    const { $api } = useNuxtApp()
    const generatedId = crypto.randomUUID()

    try {
        return await $api<InitializeDonationReturn>(`/donation/begin`, {
            method: 'GET',
            body: JSON.stringify({
                id: generatedId,
                amount: donationAmount,
                returnUrl: window.location.origin+"/payment/confirm?id=" + generatedId,
                cancelUrl: window.location.origin+"/payment/cancel?id=" + generatedId,
            })
        })
    } catch (error) {
        return false
    }
}

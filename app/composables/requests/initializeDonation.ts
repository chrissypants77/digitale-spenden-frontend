export interface InitializeDonationReturn {
    id: string
    processor: string
    redirectUrl: string
    status: string
}


export async function initializeDonation(donationAmount: number): Promise<InitializeDonationReturn | false> {
    const { $api } = useNuxtApp()

    try {
        return await $api<InitializeDonationReturn>(`/donation/begin`, {
            method: 'POST',
            body: JSON.stringify({
                amount: donationAmount,
                returnUrl: window.location.origin+"/payment/confirm",
                cancelUrl: window.location.origin+"/payment/cancel"
            })
        })
    } catch (error) {
        console.log(error)
        return false
    }
}

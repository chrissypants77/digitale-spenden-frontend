export interface initializeDonationReturn {
    id: string
    processor: string
    redirectUrl: string
    status: string
}


export async function initializeDonation(donationAmount: number): Promise<initializeDonationReturn | false> {
    const config = useRuntimeConfig()
    const generatedId = crypto.randomUUID()
    try {
        const request = await $fetch.raw(`${config.public.apiBaseUrl}/donation/begin`, {
            method: "POST",
            body: JSON.stringify({
                id: generatedId,
                amount: donationAmount,
                returnUrl: "http://"+window.location.host+"/payment/confirm?id=" + generatedId,
                cancelUrl: "http://"+window.location.host+"/payment/cancel?id=" + generatedId,
            })
        })
        if (request.ok) {
            console.log(request._data)
            return request._data as initializeDonationReturn
        }
        return false
    } catch (error) {
        return false
    }
}

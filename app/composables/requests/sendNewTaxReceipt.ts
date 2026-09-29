export async function sendNewTaxReceipt(id: string): Promise<boolean> {
    const { $authApi } = useNuxtApp()

    try {
        await $authApi("/donation/admin/resend_pdf_email", {
            method: "POST",
            body: {
                id,
                confirmationUrl: window.location.origin+"/payment/taxReceipt"
            }
        })

        return true
    } catch (error) {
        console.error("Failed to resend tax receipt:", error)
        return false
    }
}
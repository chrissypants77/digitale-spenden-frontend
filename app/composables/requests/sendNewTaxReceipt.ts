export async function sendNewTaxReceipt(id: string): Promise<boolean> {
    const config = useRuntimeConfig()

    const session = await cookieStore.get("userSession")
    if (!session) return false

    try {
        const request = await $fetch.raw(`${config.public.apiBaseUrl}/donation/admin/resend_pdf_email`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${session?.value}`
            },
            body: {
                id
            }
        })

        return request.ok
    } catch (error) {
        return false
    }
}
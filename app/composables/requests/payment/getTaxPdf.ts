interface Options {
    secret: string
    street: string
    number: string
    city: string
    postal: string
}

export async function getTaxPdf(options: Options): Promise<BlobPart | false> {
    const { $api } = useNuxtApp()

    try {
        return await $api<BlobPart>(`/donation/confirmation`, {
            method: 'POST',
            body: JSON.stringify(options),
            query: {
                confirmationUrl: window.location.origin
            }
        })
    } catch (error) {
        return false
    }
}
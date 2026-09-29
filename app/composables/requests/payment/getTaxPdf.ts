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
        const query = encodeURIComponent(window.location.origin)
        return await $api<BlobPart>(`/donation/confirmation?confirmationUrl=${query}`, {
            method: 'POST',
            body: JSON.stringify(options)
        })
    } catch (error) {
        return false
    }
}
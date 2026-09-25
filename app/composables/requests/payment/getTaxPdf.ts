interface Options {
    secret: string
    street: string
    number: string
    city: string
    postal: string
}

export async function getTaxPdf(options: Options): Promise<BlobPart | false> {
    const config = useRuntimeConfig()

    try {
        const request = await $fetch.raw(`${config.public.apiBaseUrl}/donation/confirmation`, {
            method: "POST",
            body: JSON.stringify(options)
        })
        if (request.ok) {
            return request._data as BlobPart
        }
        return false
    } catch (error) {
        return false
    }
}
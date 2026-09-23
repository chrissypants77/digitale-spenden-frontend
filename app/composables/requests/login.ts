interface ResponseData {
    id: string
    expiresAt: string
    name: string
}

export async function login(email: string, password: string): Promise<ResponseData | undefined> {
    const config = useRuntimeConfig()

    const request = await $fetch.raw(`${config.public.apiBaseUrl}/admin/login`, {
        method: "POST",
        body: JSON.stringify({
            email,
            password,
        })
    })

    if (!request.ok) {
        return undefined
    }

    return request._data as ResponseData
}
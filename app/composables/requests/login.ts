interface ResponseData {
    id: string
    expiresAt: string
    name: string
}

export async function login(email: string, password: string): Promise<ResponseData | false> {
    const { $api } = useNuxtApp()

    try {
        return await $api<ResponseData>(`/admin/login`, {
            method: 'POST',
            body: JSON.stringify({
                email,
                password,
            })
        })
    } catch (error) {
        return false
    }
}
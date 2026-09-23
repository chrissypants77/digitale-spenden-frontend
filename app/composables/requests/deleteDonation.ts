export async function deleteDonation(options: number[]): Promise<boolean> {
    const config = useRuntimeConfig()

    const session = await cookieStore.get("userSession")
    if (!session) return false

    try {
        const request = await $fetch.raw(`${config.public.apiBaseUrl}/donation/admin/delete`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${session?.value}`
            },
            body: JSON.stringify(options)
        })
        return request.ok;

    } catch (error) {
        return false
    }
}
export async function deleteDonation(options: number[]): Promise<boolean> {
    const { $authApi } = useNuxtApp()

    try {
        await $authApi("/donation/admin/delete", {
            method: "DELETE",
            body: options
        })

        return true
    } catch (error) {
        return false
    }
}
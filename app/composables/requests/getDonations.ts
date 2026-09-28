import {id} from "@nuxt/ui/locale";

interface Donator {
    email: string
    name: string
}

export interface GetDonationsReturn {
    amount: number
    currency: string
    date: string
    donator: Donator
    id: number
    payment_method: string
    name?: string
    email?: string
}

export async function getDonations(): Promise<GetDonationsReturn[] | false> {
    const { $authApi } = useNuxtApp()

    try {
        return await $authApi<GetDonationsReturn[]>(`/donation/admin/list`, {
            method: 'GET'
        })
    } catch (error) {
        return false
    }
}
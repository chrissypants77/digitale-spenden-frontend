import {isEmpty} from "#ui/utils";

interface Donator {
    email: string
    name: string
}

export interface GetNewDonationsReturn {
    amount: number
    currency: string
    date: string
    donator: Donator
    id: number
    payment_method: string
    name?: string
    email?: string
}

export async function getNewDonations(): Promise<GetNewDonationsReturn[] | false> {
    const settings = useSettingsStore()
    const lastUpdate = settings.getConfig("display.lastLeaderboardUpdate")
    let query: string
    const lastDate = new Date().toISOString()
    if (!lastUpdate) {
        query = encodeURI(lastDate)
        settings.setConfig("display.lastLeaderboardUpdate", lastDate)
        settings.saveSettings()
    } else {
        query = lastUpdate
    }

    const config = useRuntimeConfig()

    const session = await cookieStore.get("userSession")
    if (!session) return false

    try {
        const request = await $fetch.raw(`${config.public.apiBaseUrl}/donation/leaderboard/since?t=${query}`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${session?.value}`
            }
        })
        if (request.ok) {
            console.log(request._data)
            if (!isEmpty(request._data)) {
                settings.setConfig("display.lastLeaderboardUpdate", lastDate)
                settings.saveSettings()
            }
            return request._data as GetNewDonationsReturn[]
        }
        return false
    } catch (error) {
        return false
    }
}
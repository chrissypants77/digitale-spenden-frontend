import { isEmpty } from "#ui/utils"

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
    const { $authApi } = useNuxtApp()
    const settings = useSettingsStore()

    const lastUpdate = settings.getConfig("display.lastLeaderboardUpdate")
    const lastDate = new Date().toISOString()

    let query: string

    if (!lastUpdate) {
        query = lastDate

        settings.setConfig("display.lastLeaderboardUpdate", lastDate)
        settings.saveSettings()
    } else {
        query = lastUpdate
    }

    try {
        const data = await $authApi<GetNewDonationsReturn[]>(
            "/donation/leaderboard/since",
            {
                method: "GET",
                query: {
                    t: query
                }
            }
        )

        console.log(data)

        if (!isEmpty(data)) {
            settings.setConfig("display.lastLeaderboardUpdate", lastDate)
            settings.saveSettings()
        }

        return data
    } catch (error) {
        console.error("Failed to get new donations:", error)
        return false
    }
}
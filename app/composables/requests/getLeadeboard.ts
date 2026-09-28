interface Donator {
    amount: number
    email: string
    name: string
}

export interface GetLeaderboardReturn {
    topDonators: Donator[]
    totalAmount: number
}

export async function getLeaderboard(): Promise<GetLeaderboardReturn | false> {
    const { $authApi } = useNuxtApp()

    try {
        return await $authApi<GetLeaderboardReturn>(`/donation/leaderboard`, {
            method: 'GET'
        })
    } catch (error) {
        return false
    }
}
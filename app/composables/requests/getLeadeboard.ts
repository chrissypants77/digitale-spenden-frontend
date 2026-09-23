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
    const config = useRuntimeConfig()

    const session = await cookieStore.get("userSession")
    if (!session) return false

    try {
        const request = await $fetch.raw(`${config.public.apiBaseUrl}/donation/leaderboard`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${session?.value}`
            }
        })
        if (request.ok) {
            return request._data as GetLeaderboardReturn
        }
        return false
    } catch (error) {
        return false
    }
}
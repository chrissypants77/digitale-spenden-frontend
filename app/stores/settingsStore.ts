import { defineStore } from "pinia"

type AvailableConfigs = {
    display: {
        goal: number
        goalEnabled: boolean
        showDataFromDaysAgo: number
        pollingRate: number,
        pollingRateEnabled: boolean,
        lastLeaderboardUpdate: string
    }
    dashboard: {
        currentTab: string
    }
    general: {
        fullscreen: boolean
    }
}

type Paths<T> = {
    [K in keyof T & string]:
    T[K] extends object
        ? `${K}.${Paths<T[K]>}`
        : K
}[keyof T & string]

type PathValue<T, P extends string> =
    P extends `${infer K}.${infer Rest}`
        ? K extends keyof T
            ? PathValue<T[K], Rest>
            : never
        : P extends keyof T
            ? T[P]
            : never

export const useSettingsStore = defineStore("settingsStore", {
    state: (): { configs: AvailableConfigs } => ({
        configs: {
            display: {
                goal: 0,
                goalEnabled: false,
                showDataFromDaysAgo: 1,
                pollingRate: 0,
                pollingRateEnabled: false,
                lastLeaderboardUpdate: ""
            },
            dashboard: {
                currentTab: "0"
            },
            general: {
                fullscreen: false
            }
        }
    }),

    actions: {
        getConfig<P extends Paths<AvailableConfigs>>(
            configName: P
        ): PathValue<AvailableConfigs, P> {
            return configName
                .split(".")
                .reduce(
                    (obj, key) => obj[key],
                    this.configs as any
                ) as PathValue<AvailableConfigs, P>
        },

        setConfig<P extends Paths<AvailableConfigs>>(
            configName: P,
            value: PathValue<AvailableConfigs, P>
        ) {
            const keys = configName.split(".")
            const lastKey = keys.pop()!

            const target = keys.reduce(
                (obj, key) => obj[key],
                this.configs as any
            )

            target[lastKey] = value
        },

        checkSettings(settings: AvailableConfigs): boolean {
            if (settings?.display.pollingRateEnabled &&
                settings?.display.pollingRate <= 0) return false
            if (settings?.display.goalEnabled &&
                settings.display.goal <= 0) return false

            return true
        },

        saveSettings(overrideSettings?: AvailableConfigs): void {
            const toast = useToast()
            if (overrideSettings != undefined && !this.checkSettings(overrideSettings)) {
                toast.add({
                    title: "Einstellungen konnten nicht Gespeichert werden",
                    description: "Einstellungen konnten nicht Gespeichert werden.",
                    icon: "i-lucide-database-x",
                    color: "error"
                })
                return
            }

            try {
                if (overrideSettings) {
                    localStorage.setItem("settings", JSON.stringify(overrideSettings))
                    toast.add({
                        title: "Einstellungen Gespeichert",
                        description: "Einstellungen wurden erfolgreich gespeichert.",
                        icon: "i-lucide-database-check",
                        color: "success"
                    })
                    this.configs = overrideSettings
                } else {
                    localStorage.setItem("settings", JSON.stringify(this.configs))
                }
            } catch (e) {
                console.error("[ERROR] Saving settings", e)
                toast.add({
                    title: "Einstellungen konnten nicht Gespeichert werden",
                    description: "Einstellungen konnten nicht Gespeichert werden.",
                    icon: "i-lucide-database-x",
                    color: "error"
                })
            }
        }
    }
})

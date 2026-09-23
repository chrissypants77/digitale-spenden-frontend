import { useSettingsStore } from "~/stores/settingsStore"
import {useUserStore} from "#imports";

export default defineNuxtPlugin(async ({ $pinia }) => {
    const store = useSettingsStore($pinia)

    const saved = localStorage.getItem("settings")

    if (saved) {
        try {
            store.configs = JSON.parse(saved)
        } catch {
            console.warn("Could not load settings from localStorage")
        }
    } else {
        try {
            store.saveSettings()
        } catch {
            console.warn("Could not save settings to localstorage")
        }
    }

    const userStore = useUserStore($pinia)

    const session = cookieStore.get("userSession")
    if (!session) {
        await userStore.logout()
    }

    const userSaved = localStorage.getItem("userStore")

    if (userSaved) {
        try {
            userStore.$state = JSON.parse(userSaved)
            await userStore.checkSession()
        } catch {
            console.warn("Could not load settings from localStorage")
        }
    } else {
        try {
            userStore.saveUserData()
        } catch {
            console.warn("Could not save settings to localstorage")
        }
    }
})
import {defineStore} from "pinia"
import {login} from "~/composables/requests/login.ts";
import {validateSession} from "~/composables/requests/validateSession.ts";


export const useUserStore = defineStore("userStore", {
    state: () => ({
        username: "",
        loggedIn: false
    }),

    actions: {
        async login(email: string, password: string) {
            if (!email || this.loggedIn || !password) {
                console.info("[DEBUG] User login failed")
            }
            const data = await login(email, password)
            const toast = useToast()

            if (!data) {
                toast.add({
                    title: "Fehler bei der Anmeldung",
                    description: "Die Anmeldung ist fehlgeschlagen. Bitte überprüfen Sie Ihre Anmeldedaten und versuchen Sie es erneut.",
                    icon: "i-lucide-dashboard",
                    color: "success"
                })
                return
            }

            await this.setSession(data?.id, data?.expiresAt)

            toast.add({
                title: "Erfolgreich Angemeldet",
                description: "Sie wurden Erfolgreich Angemeldet und werden zum dashboard weiter geleitet.",
                icon: "i-lucide-dashboard",
                color: "success"
            })

            await sleep(1000)
            navigateTo("/dashboard")

            this.loggedIn = true
            this.username = data?.name
            this.saveUserData()
        },

        async setSession(session: string, expiresAt: string) {
            const timestamp = new Date(expiresAt).getTime()

            await cookieStore.set({
                name: "userSession",
                value: session,
                expires: timestamp
            })
        },

        async checkSession() {
            const requestData = await validateSession()
            if (!requestData) {
                await this.logout()
                return
            }

            await this.setSession(requestData?.id, requestData?.expiresAt)
        },

        async logout() {
            this.loggedIn = false
            this.username = ""
            await cookieStore.delete("userSession")
            this.saveUserData()
        },

        saveUserData(): void {
            try {
                localStorage.setItem("userStore", JSON.stringify(this.$state))
            } catch (error) {
                console.error("[ERROR] while saving the userStore", error)
            }
        }
    }
})
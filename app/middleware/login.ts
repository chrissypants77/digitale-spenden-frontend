import {useUserStore} from "#imports";

export default defineNuxtRouteMiddleware((to, from) => {
    const store = useUserStore()

    if (store.loggedIn) {
        return navigateTo("/dashboard")
    }
})

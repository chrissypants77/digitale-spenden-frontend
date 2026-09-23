<script setup lang="ts">
import type {NavigationMenuItem} from "@nuxt/ui";
import {useUserStore} from "~/stores/userStore.ts";
import Desktop from "~/components/menu/Desktop.vue";
import Mobile from "~/components/menu/Mobile.vue";

const settingsStore = useSettingsStore()
const userStore = useUserStore()

const items = computed<NavigationMenuItem[][]>(() => [
  [
    {
      label: "Startseite",
      icon: "i-lucide-home",
      to: "/"
    },
    {
      label: "Anmelden",
      icon: "i-lucide-user",
      to: "/login",
      class: userStore.loggedIn ? "hidden" : ""
    },
    {
      label: "Administrations Übersicht",
      icon: "i-lucide-book",
      to: "/dashboard",
      class: !userStore.loggedIn ? "hidden" : ""
    },
    {
      label: "Unser Schützenverein",
      icon: "i-lucide-bow-arrow",
      to: "https://www.hsv-ottbergen.de/"
    }
  ]
])


</script>

<template>
  <div class="main overflow-hidden">
    <Transition :name="settingsStore.getConfig('general.fullscreen')
    ? 'fullscreen-up'
    : 'fullscreen-down'">
      <div :key="'t'+settingsStore.getConfig('general.fullscreen')">
        <desktop v-if="!settingsStore.getConfig('general.fullscreen')" :items="items"/>

        <mobile v-if="!settingsStore.getConfig('general.fullscreen')" :items="items"/>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
@import "@/assets/css/main.css";

.main {
  @apply items-center w-full border-b border-default px-4 overflow-hidden;
}

.fullscreen-up-leave-active,
.fullscreen-down-enter-active {
  transition:
      transform 0.4s cubic-bezier(0.4, 0, 0.2, 1),
      opacity 0.3s ease;
}

/* Normal → fullscreen */
.fullscreen-up-leave-to {
  transform: translateY(-100%);
  opacity: 0;
}

/* Fullscreen → normal */
.fullscreen-down-enter-from {
  transform: translateY(-100%);
  opacity: 0;
}


</style>
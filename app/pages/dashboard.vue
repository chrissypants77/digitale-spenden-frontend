<script setup lang="ts">
const settingsStore = useSettingsStore()

definePageMeta({
  middleware: "dashboard"
})

const tabItems = [
  {
    label: "Spenden Anzeige",
    icon: "i-lucide-presentation",
    slot: "display",
    value: "0"
  },
  {
    label: "Spenden Verwaltung",
    icon: "i-lucide-book-user",
    slot: "administrative",
    value: "1"
  },
  {
    label: "Einstellungen",
    icon: "i-lucide-cog",
    slot: "settings",
    value: "2"
  }
]

const activeTab = ref(settingsStore.getConfig("dashboard.currentTab") ?? "0")
const previousTab = ref("0")

const direction = ref<"left" | "right">("left")

watch(activeTab, (newTab) => {
  direction.value =
      Number(newTab) > Number(previousTab.value)
          ? "left"
          : "right"

  previousTab.value = newTab

  settingsStore.setConfig("dashboard.currentTab", newTab)
  settingsStore.saveSettings()
})

function changeToFullscreen() {
  settingsStore.setConfig("general.fullscreen", !settingsStore.getConfig("general.fullscreen"))
}

</script>

<template>
  <div class="w-full max-w-6xl">
    <div class="flex flex-col col-1 gap-3 items-center">
      <Transition :name="settingsStore.getConfig('general.fullscreen')
        ? 'fullscreen-up'
        : 'fullscreen-down'">
        <div :key="settingsStore.getConfig('general.fullscreen')"
             v-if="!settingsStore.getConfig('general.fullscreen')"
             class="flex flex-col col-1 gap-3 items-center w-full max-w-6xl"
        >
          <UTabs
              v-model="activeTab"
              :items="tabItems"
              class="w-full max-w-6xl"
              :ui="{
                content: 'hidden',
                leadingIcon: 'hidden',
                label: 'hidden'
              }"
          >
            <template #leading="{ item }">
              <UIcon :name="item.icon" class="size-6"/>
            </template>

            <template #trailing="{ item }">
              <span
                  class="text-lg"
                  :class="[
                  activeTab === item.value ? 'block' : 'hidden md:block'
                ]"
              >
                {{ item.label }}
              </span>
            </template>
          </UTabs>
        </div>
      </Transition>

      <div class="relative w-full overflow-hidden">
        <Transition :name="`slide-${direction}`">
          <div class="w-full">
            <dashboard-tabs-display v-if="activeTab === '0'" class="tabs"/>

            <dashboard-tabs-administrative v-if="activeTab === '1'" class="tabs"/>

            <dashboard-tabs-settings v-else-if="activeTab === '2'" class="tabs"/>
          </div>
        </Transition>
      </div>
    </div>
    <UButton
        v-if="settingsStore.getConfig('dashboard.currentTab') == '0'"
        v-on:click="changeToFullscreen()"
        :icon="settingsStore.getConfig('general.fullscreen')
          ? 'i-lucide-minimize'
          : 'i-lucide-fullscreen'"
        class="fixed bottom-4 right-4 rounded-full hidden md:flex size-12 items-center justify-center z-50"
        size="xl"
        :ui="{
          leadingIcon: 'size-9'
        }"
    />
  </div>
</template>

<style scoped>
@import "@/assets/css/main.css";

.tabs {
  @apply w-full flex justify-center px-4
}

.slide-left-enter-active,
.slide-left-leave-active,
.slide-right-enter-active,
.slide-right-leave-active {
  transition: transform 0.25s ease, opacity 0.25s ease;
}

.slide-left-enter-from {
  transform: translateX(30px);
  opacity: 0;
}

.slide-left-leave-to {
  transform: translateX(-30px);
  opacity: 0;
}

.slide-right-enter-from {
  transform: translateX(-30px);
  opacity: 0;
}

.slide-right-leave-to {
  transform: translateX(30px);
  opacity: 0;
}

.fullscreen-up-leave-active,
.fullscreen-down-enter-active {
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1),
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
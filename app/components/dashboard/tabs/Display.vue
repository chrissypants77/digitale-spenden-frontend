<script setup lang="ts">

import type {ProgressGroupItem} from '@nuxt/ui'
import iconsConfig from "~~/config/Leaderboard.ts"
import {useSettingsStore} from "~/stores/settingsStore.ts";
import {sleep} from "~/composables/sleep.ts";
import {getLeaderboard} from "~/composables/requests/getLeadeboard.ts";
import {getNewDonations, type GetNewDonationsReturn} from "~/composables/requests/getNewDonations.ts";
import {isEmpty} from "#ui/utils";

const config = useSettingsStore()
const goal = config.getConfig("display.goalEnabled") ? config.getConfig("display.goal") : 0
const toast = useToast()

let leaderboardItems: Ref<ProgressGroupItem[]> = ref([])
let used: Ref<number> = ref(0)

const sortedItems = computed(() => {
  const sorted = [...leaderboardItems.value].sort((a, b) => b.value - a.value).slice(0, 10)

  sorted.forEach((item, index) => {
    item.icon = iconsConfig[index]?.icon || ""
    item.color = iconsConfig[index]?.color || "var(--color-neutral-400)"
  })
  return sorted
})

const text = computed(() => {
  if (!goal) {
    return `${used.value.toFixed(1)}€ Gesammelt`
  }
  return `${used.value.toFixed(1)}€ von ${max.value}€ Gesammelt`
})

const max = computed(() => {
  if (!goal) {
    return used
  }
  return goal
})

let fullscreen = ref(unref(config.getConfig("general.fullscreen")))

watch(
    () => config.getConfig("general.fullscreen"),
    async () => {
      if (config.getConfig("general.fullscreen")) {
        await sleep(1000)
      }
      fullscreen.value = config.getConfig("general.fullscreen")
      console.log(fullscreen)
    }
)

let leaderboardInterval: ReturnType<typeof setInterval> | undefined

async function loadLeaderboard() {
  const leaderboardData = await getLeaderboard()

  if (!leaderboardData) {
    return
  }

  used.value = leaderboardData.totalAmount

  leaderboardItems.value = leaderboardData.topDonators.map((value) => ({
    value: value.amount,
    label: value.name
  }))
}

async function updateLeaderboard() {
  const donationsData = await getNewDonations()

  if (!donationsData || isEmpty(donationsData)) {
    return
  }

  const newDonations = donationsData as GetNewDonationsReturn[]

  await loadLeaderboard()

  for (const donation of newDonations) {
    toast.add({
      title: "Neue Spende",
      description: `${donation.donator.name} hat ${donation.amount}€ Gespendet!! Vielen dank`,
      icon: "i-lucide-hand-coins",
      color: "success"
    })
  }
}

function stopLeaderboardPolling() {
  if (leaderboardInterval) {
    clearInterval(leaderboardInterval)
    leaderboardInterval = undefined
  }
}

function startLeaderboardPolling() {
  stopLeaderboardPolling()

  const pollingEnabled = config.getConfig("display.pollingRateEnabled")
  const pollingRate = config.getConfig("display.pollingRate")

  if (!pollingEnabled) {
    return
  }

  leaderboardInterval = setInterval(() => {
    void updateLeaderboard()
  }, pollingRate * 1000)
}

onMounted(() => {
  // Don't make the tab transition wait for the API request
  requestAnimationFrame(() => {
    void loadLeaderboard()
  })

  startLeaderboardPolling()
})

onUnmounted(() => {
  stopLeaderboardPolling()
})
</script>

<template>
  <div class="w-full flex flex-col">
    <div
        class="w-full flex justify-center transition-all duration-500 ease-in-out"
        :class="fullscreen ? 'max-w-[1440px]' +
         '' : 'max-w-5xl'"
    >
      <UProgressGroup
          :items="sortedItems"
          :max="max"
          status
          size="xl"
          class="w-full max-w-5xl"
          :class="fullscreen
            ? 'max-w-[1440px]'
            : ''"
          :ui="{
            itemLabel: 'text-olive-900 dark:text-olive-100',
            status: fullscreen
              ? 'w-full justify-between text-[40px] text-olive-900 dark:text-olive-100'
              : 'w-full justify-between text-[14px] md:text-[24px] text-olive-900 dark:text-olive-100',
            list: fullscreen
              ? 'text-[40px]'
              : 'text-[14px] md:text-[24px]',
            itemLeadingIcon: fullscreen
              ? 'w-10 h-10'
              : 'w-6 h-6 md:w-8 md:h-8',
          }"
          :key="''+fullscreen"
      >
        <template #status="{ percent }">
          <div class="flex w-full justify-between">
            <p v-if="goal">{{ percent }}%</p>
            <p class="ml-auto">
              {{ text }}
            </p>
          </div>
        </template>

        <template #item-trailing="{ item }">
          <p
              class="text-olive-900 dark:text-olive-100"
              :class="fullscreen
          ? 'text-[40px]'
          : 'text-[inherit]'"
          >
            {{ item.value }}€
          </p>
        </template>

        <template #item-leading="{ item }">
          <!-- Single Item -->
          <div
              v-if="item.icon && typeof item.icon === 'string'"
              class="flex items-center"
          >
            <UIcon
                :name="item.icon"
                :class="fullscreen
            ? 'size-[66px]'
            : 'size-6 md:size-8'"
                :style="{ backgroundColor: item.color }"
            />
          </div>

          <!-- Multi Icon -->
          <div
              v-if="item.icon && typeof item.icon === 'object'"
              class="flex items-center"
              :class="fullscreen
          ? '-space-x-6'
          : '-space-x-3 md:-space-x-5'"
          >
            <UIcon
                v-for="icon in item.icon"
                :key="icon"
                :name="icon"
                :class="fullscreen
            ? 'size-[66px]'
            : 'size-6 md:size-8'"
                :style="{ backgroundColor: item.color }"
            />
          </div>
        </template>
      </UProgressGroup>
    </div>
  </div>
</template>

<style scoped>
@import "~/assets/css/main.css";

.fullscreen-expand-enter-active,
.fullscreen-expand-leave-active,
.fullscreen-minimize-enter-active,
.fullscreen-minimize-leave-active {
  transition:
      width 0.25s cubic-bezier(0.4, 0, 0.2, 1),
      height 0.25s cubic-bezier(0.4, 0, 0.2, 1),
      max-width 0.25s cubic-bezier(0.4, 0, 0.2, 1),
      transform 0.25s cubic-bezier(0.4, 0, 0.2, 1);

  transform-origin: center center;
}

/* Normal → Fullscreen */
.fullscreen-expand-enter-from,
.fullscreen-minimize-enter-from {
  transform: scale(1);
}

.fullscreen-expand-enter-to,
.fullscreen-minimize-enter-to {
  transform: scale(1);
}

/* Fullscreen → Normal */
.fullscreen-expand-leave-from,
.fullscreen-minimize-leave-from {
  transform: scale(1);
}

.fullscreen-expand-leave-to,
.fullscreen-minimize-leave-to {
  transform: scale(1);
}
</style>
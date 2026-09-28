<script setup lang="ts">

import type {NavigationMenuItem} from "@nuxt/ui";

const props = defineProps<{
  items: NavigationMenuItem[][]
}>()

</script>

<template>
  <div class="hidden md:grid grid-cols-3 md:items-center">
    <!-- Left -->
    <div class="flex">
      <NuxtImg
          class="my-4"
          src="https://www.hsv-ottbergen.de/wp-content/uploads/2018/11/cropped-LogoWappenDingensQuadratisch-1.png"
          width="90"
          height="90"
      />

      <div class="flex flex-col p-4 text-lg">
        <h1>Heimatschutzverein</h1>
        <h1>Ottbergen</h1>
        <small>von 1567 e.V.</small>
      </div>
    </div>

    <!-- Middle -->
    <div class="flex">
      <UButton
          label="Spenden"
          color="primary"
          trailing-icon="i-lucide-heart"
          to="/"
          class="text-lg relative z-1"
      />

      <UNavigationMenu
          highlight
          highlight-color="primary"
          orientation="horizontal"
          :items="items"
          :ui="{
            link: 'text-lg',
          }"
          class="ml-4"
      />
    </div>

    <!-- Right -->
    <div class="flex justify-end px-4">
      <UColorModeSwitch
          size="xl"
          :ui="{
            base: 'scale-150'
          }"
      />
    </div>
  </div>
</template>

<style scoped>

</style>
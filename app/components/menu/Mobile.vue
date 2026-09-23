<script setup lang="ts">
import type {NavigationMenuItem} from "@nuxt/ui";

const props = defineProps<{
  items: NavigationMenuItem[][]
}>()

const mobileMenuOpen = ref(false);
</script>

<template>
  <!-- Mobile -->
  <div class="flex md:hidden w-full items-center justify-between">

    <!-- Logo + text -->
    <div class="flex items-center">
      <NuxtImg
          src="https://www.hsv-ottbergen.de/wp-content/uploads/2018/11/cropped-LogoWappenDingensQuadratisch-1.png"
          width="56"
          height="56"
      />

      <div class="flex flex-col ml-2">
        <h1>Heimatschutzverein</h1>
        <h1>Ottbergen</h1>
        <small>von 1567 e.V.</small>
      </div>
    </div>

    <!-- Menu button -->
    <UButton
        icon="i-lucide-menu"
        color="neutral"
        variant="ghost"
        size="xl"
        @click="mobileMenuOpen = !mobileMenuOpen"
        class="mr-2"
    />
  </div>

  <!-- Mobile dropdown -->
  <div
      v-if="mobileMenuOpen"
      class="md:hidden border-b border-default p-4"
  >
    <UNavigationMenu
        orientation="vertical"
        :items="items"
        class="w-full"
    />

    <UButton
        label="Spenden"
        color="primary"
        trailing-icon="i-lucide-heart"
        to="/donate"
        class="mt-3 w-full justify-center"
        @click="mobileMenuOpen = false"
    />

    <div class="mt-3 flex justify-end">
      <UColorModeSwitch size="xl" />
    </div>
  </div>
</template>

<style scoped>

</style>
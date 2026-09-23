<script setup lang="ts">
const settingsStore = useSettingsStore()
const userStore = useUserStore()

const settingsCopy = ref(structuredClone(toRaw(settingsStore.configs)))

</script>

<template>
  <div class="w-full flex flex-col">
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 items-stretch ">
      <UCard
          class="card"
          :ui="{
        title: 'text-lg font-bold text-olive-950 dark:text-olive-200'
      }"
      >
        <template #title>
          Anzeige Einstellungen
        </template>

        <template #default>
          <UFormField
              label="Ziel"
              description="Hier können Sie ein Spendenziel definieren. Wenn nicht angegeben, wird es als 'unbegrenzt' eingestellt."
          >
            <div class="flex flex-col-2 gap-4 items-center">
              <UInput
                  v-model.number="settingsCopy.display.goal"
                  placeholder="Ziel ..."
                  :disabled="!settingsCopy.display.goalEnabled"
                  :ui="{
                base: 'rounded-sm'
              }"
              />

              <label class="flex items-center gap-2 cursor-pointer">
                <UCheckbox v-model="settingsCopy.display.goalEnabled" />
                <span>Einstellung benutzen</span>
              </label>
            </div>
          </UFormField>
          <UFormField
            label="Abrufrate"
            description="Hier kann man einstellen wie oft nachgeschaut werden soll ob eine neue Spende eingetroffen ist. In Sekunden!!"
            class="mt-4"
          >
            <div class="flex flex-col-2 gap-4 items-center">
              <UInput
                  v-model.number="settingsCopy.display.pollingRate"
                  placeholder="Abrufrate..."
                  :disabled="!settingsCopy.display.pollingRateEnabled"
                  :ui="{
                    base: 'rounded-sm'
                  }"
              />

              <label class="flex items-center gap-2 cursor-pointer">
                <UCheckbox v-model="settingsCopy.display.pollingRateEnabled" />
                <span>Einstellung benutzen</span>
              </label>
            </div>
          </UFormField>
        </template>
      </UCard>
      <UCard
      class="card"
      :ui="{
        title: 'text-lg font-bold text-olive-950 dark:text-olive-200'
      }">
        <template #title>
          Konto Informationen
        </template>

        <template #default>
          Angemeldet als Benutzer: {{ userStore.username }}
        </template>
      </UCard>
    </div>

    <UButton
        v-on:click="settingsStore.saveSettings(settingsCopy)"
        class="self-start mt-4"
        label="Speichern"
    />
  </div>
</template>

<style scoped>
@import "~/assets/css/main.css";

.card {
  border: 2px solid var(--ui-primary);
  border-radius: 0.3rem;
  background: color-mix(in srgb, var(--ui-primary) 8%, var(--ui-bg));
  @apply w-full max-w-6xl my-1;
}
</style>
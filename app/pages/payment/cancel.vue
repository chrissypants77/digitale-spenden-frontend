<script setup lang="ts">
import { cancel } from "~/composables/requests/payment/cancel.ts"

const route = useRoute()

const id = route.query.id as string | undefined

const loading = ref(true)
const cancelled = ref(false)
const error = ref(false)

async function cancelPayment() {
  if (!id) {
    loading.value = false
    error.value = true
    return
  }

  try {
    const data = await cancel(id)

    if (!data) {
      error.value = true
      return
    }

    cancelled.value = true
  } catch (err) {
    console.error("Payment cancellation failed:", err)
    error.value = true
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  void cancelPayment()
})
</script>

<template>
  <div
      class="
      min-h-[70vh]
      flex
      items-center
      justify-center
      px-4
      py-12
    "
  >
    <!-- Loading -->
    <div
        v-if="loading"
        class="flex flex-col items-center gap-4 text-center"
    >
      <UIcon
          name="i-lucide-loader-circle"
          class="size-12 animate-spin text-primary"
      />

      <div>
        <h2 class="text-xl font-semibold">
          Zahlung wird abgebrochen
        </h2>

        <p class="text-muted mt-1">
          Einen kleinen Moment bitte...
        </p>
      </div>
    </div>

    <!-- Cancelled -->
    <UCard
        v-else-if="cancelled"
        class="w-full max-w-2xl"
    >
      <div
          class="
          flex
          flex-col
          items-center
          text-center
          gap-6
          py-6
          sm:py-10
        "
      >
        <!-- Icon -->
        <div
            class="
            size-24
            rounded-full
            bg-warning/10
            flex
            items-center
            justify-center
          "
        >
          <UIcon
              name="i-lucide-circle-x"
              class="size-14 text-warning"
          />
        </div>

        <!-- Heading -->
        <div class="flex flex-col gap-3">
          <h1 class="text-3xl sm:text-4xl font-bold">
            Spende abgebrochen
          </h1>

          <p class="text-lg text-muted max-w-xl">
            Der Zahlungsvorgang wurde abgebrochen.
            Es wurde keine Spende abgeschlossen.
          </p>
        </div>

        <!-- Information -->
        <div
            class="
            w-full
            rounded-xl
            border
            border-default
            bg-elevated
            p-5
            text-left
          "
        >
          <div class="flex gap-3">
            <UIcon
                name="i-lucide-info"
                class="size-6 shrink-0 text-primary"
            />

            <div>
              <p class="font-semibold">
                Kein Problem
              </p>

              <p class="text-sm text-muted mt-1">
                Sie können jederzeit zur Spendenseite zurückkehren
                und den Vorgang erneut starten.
              </p>
            </div>
          </div>
        </div>

        <!-- Buttons -->
        <div
            class="
            flex
            flex-col
            sm:flex-row
            gap-3
            mt-2
          "
        >
          <UButton
              to="/spenden"
              size="xl"
              color="primary"
              icon="i-lucide-heart"
          >
            Erneut spenden
          </UButton>

          <UButton
              to="/"
              size="xl"
              color="neutral"
              variant="outline"
              icon="i-lucide-house"
          >
            Zur Startseite
          </UButton>
        </div>
      </div>
    </UCard>

    <!-- Error -->
    <UCard
        v-else-if="error"
        class="w-full max-w-xl"
    >
      <div
          class="
          flex
          flex-col
          items-center
          text-center
          gap-5
          py-8
        "
      >
        <div
            class="
            size-20
            rounded-full
            bg-error/10
            flex
            items-center
            justify-center
          "
        >
          <UIcon
              name="i-lucide-triangle-alert"
              class="size-11 text-error"
          />
        </div>

        <div>
          <h1 class="text-2xl font-bold">
            Vorgang konnte nicht verarbeitet werden
          </h1>

          <p class="text-muted mt-2 max-w-md">
            Der Zahlungsabbruch konnte momentan nicht bestätigt werden.
          </p>
        </div>

        <div class="flex flex-col sm:flex-row gap-3">
          <UButton
              to="/spenden"
              color="primary"
              size="lg"
              icon="i-lucide-heart"
          >
            Zur Spendenseite
          </UButton>

          <UButton
              to="/"
              color="neutral"
              variant="outline"
              size="lg"
              icon="i-lucide-house"
          >
            Zur Startseite
          </UButton>
        </div>
      </div>
    </UCard>
  </div>
</template>
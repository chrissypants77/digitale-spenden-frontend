<script setup lang="ts">
import { confirm } from "~/composables/requests/payment/confirm.ts"

const route = useRoute()

const id = route.query.id as string | undefined

const loading = ref(true)
const confirmed = ref(false)
const error = ref(false)

const paymentData = ref<any>(null)

async function confirmPayment() {
  if (!id) {
    loading.value = false
    error.value = true
    return
  }

  try {
    const data = await confirm(id)

    if (!data) {
      error.value = true
      return
    }

    if (data.status !== "paid") {
      error.value = true
      return
    }

    paymentData.value = data
    confirmed.value = true
  } catch (err) {
    console.error("Payment confirmation failed:", err)
    error.value = true
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  confirmPayment()
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
          Zahlung wird bestätigt
        </h2>

        <p class="text-muted mt-1">
          Einen kleinen Moment bitte...
        </p>
      </div>
    </div>

    <!-- Success -->
    <UCard
        v-else-if="confirmed"
        class="w-full max-w-2xl"
    >
      <div class="flex flex-col items-center text-center gap-6 py-6 sm:py-10">

        <!-- Success icon -->
        <div
            class="
            size-24
            rounded-full
            bg-primary/10
            flex
            items-center
            justify-center
          "
        >
          <UIcon
              name="i-lucide-circle-check-big"
              class="size-14 text-primary"
          />
        </div>

        <!-- Heading -->
        <div class="flex flex-col gap-3">
          <h1 class="text-3xl sm:text-4xl font-bold">
            Vielen Dank für Ihre Spende!
          </h1>

          <p class="text-lg text-muted max-w-xl">
            Ihre Spende an den Heimatschutzverein Ottbergen von 1567 e.V.
            wurde erfolgreich übermittelt.
          </p>
        </div>

        <!-- Thank you text -->
        <p class="max-w-xl leading-relaxed">
          Mit Ihrer Unterstützung helfen Sie dabei, Tradition,
          Gemeinschaft und das Vereinsleben in Ottbergen auch in Zukunft
          lebendig zu halten.
        </p>

        <!-- Receipt -->
        <div
            v-if="paymentData?.receipt"
            class="
            flex
            gap-3
            text-left
            w-full
            rounded-xl
            border
            border-default
            bg-elevated
            p-4
          "
        >
          <UIcon
              name="i-lucide-file-check"
              class="size-6 shrink-0 text-primary"
          />

          <div>
            <p class="font-semibold">
              Spendenquittung
            </p>

            <p class="text-sm text-muted mt-1">
              Sie haben eine Spendenquittung angefordert.
              Diese wird anhand Ihrer angegebenen Daten erstellt.
            </p>
          </div>
        </div>

        <!-- Payment secure -->
        <div class="flex items-center gap-2 text-sm text-muted">
          <UIcon
              name="i-lucide-lock-keyhole"
              class="size-4"
          />

          Zahlung sicher über Stripe verarbeitet
        </div>

        <!-- Actions -->
        <div class="flex flex-col sm:flex-row gap-3 mt-2">
          <UButton
              to="/"
              size="xl"
              color="primary"
              icon="i-lucide-house"
          >
            Zur Startseite
          </UButton>

          <UButton
              to="/donate"
              size="xl"
              color="neutral"
              variant="outline"
              icon="i-lucide-heart"
          >
            Zur Spendenseite
          </UButton>
        </div>
      </div>
    </UCard>

    <!-- Error -->
    <UCard
        v-else-if="error"
        class="w-full max-w-xl"
    >
      <div class="flex flex-col items-center text-center gap-5 py-8">

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
              name="i-lucide-circle-alert"
              class="size-11 text-error"
          />
        </div>

        <div>
          <h1 class="text-2xl font-bold">
            Zahlung konnte nicht bestätigt werden
          </h1>

          <p class="text-muted mt-2 max-w-md">
            Die Zahlung konnte momentan nicht eindeutig bestätigt werden.
            Falls bereits Geld abgebucht wurde, versuchen Sie die Zahlung
            bitte nicht erneut.
          </p>
        </div>

        <UButton
            to="/"
            color="primary"
            size="lg"
            icon="i-lucide-house"
        >
          Zur Startseite
        </UButton>
      </div>
    </UCard>
  </div>
</template>
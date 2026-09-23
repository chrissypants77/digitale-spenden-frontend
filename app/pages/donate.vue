<script setup lang="ts">

import {initializeDonation} from "~/composables/requests/initializeDonation.ts";

const emit = defineEmits<{
  continue: [data: {
    amount: number
    receipt: boolean
  }]
}>()

const selectedAmount = ref<number | null>(50)
const customAmount = ref<number | null>(null)
const customSelected = ref(false)

const receipt = ref(false)

const amounts = [
  {
    amount: 10,
    label: 'Unterstützer'
  },
  {
    amount: 25,
    label: 'Freund des Vereins'
  },
  {
    amount: 50,
    label: 'Förderer'
  },
  {
    amount: 100,
    label: 'Starker Partner'
  }
]

const benefits = [
  {
    icon: 'i-lucide-landmark',
    title: 'Tradition & Heimat bewahren',
    description:
        'Unterstützen Sie uns dabei, die Ottberger Traditionen und das Schützenbrauchtum auch für kommende Generationen zu erhalten.'
  },
  {
    icon: 'i-lucide-target',
    title: 'Schießsport fördern',
    description:
        'Ihre Spende hilft bei der Pflege und Weiterentwicklung unseres Schießsports und unserer Vereinsanlagen.'
  },
  {
    icon: 'i-lucide-users',
    title: 'Jugend & Nachwuchs stärken',
    description:
        'Wir möchten junge Menschen für das Vereinsleben begeistern und unseren Nachwuchs langfristig fördern.'
  },
  {
    icon: 'i-lucide-party-popper',
    title: 'Gemeinschaft erleben',
    description:
        'Ob Schützenfest, Schnatgang oder andere Veranstaltungen – gemeinsam halten wir das Vereinsleben in Ottbergen lebendig.'
  }
]

const paymentProvider = [
  {
    src: "/images/visa.png",
    alt: "Visa"
  },
  {
    src: "/images/mastercard.png",
    alt: "Mastercard"
  },
  {
    src: "/images/klarna.jpeg",
    alt: "Klarna"
  },
  {
    src: "/images/bancontact.png",
    alt: "Bancontact"
  },
  {
    src: "/images/apple-pay.png",
    alt: "Apple Pay",
  },
  {
    src: "/images/amazon-pay.png",
    alt: "Amazon pay"
  }
]

const finalAmount = computed(() => {
  if (customSelected.value) {
    return customAmount.value ?? 0
  }

  return selectedAmount.value ?? 0
})

function selectAmount(amount: number) {
  customSelected.value = false
  selectedAmount.value = amount
}

function selectCustomAmount() {
  customSelected.value = true
  selectedAmount.value = null
}

async function continueDonation() {
  if (finalAmount.value <= 0) {
    return
  }
  const data = await initializeDonation(finalAmount.value)

  if (!data) return

  window.location.replace(data.redirectUrl)

  emit('continue', {
    amount: finalAmount.value,
    receipt: receipt.value
  })
}
</script>

<template>
  <div
      class="
      grid grid-cols-1 lg:grid-cols-[1.4fr_1fr]
      gap-8 lg:gap-12
      w-full
    "
  >
    <!-- LEFT SIDE -->
    <div class="flex flex-col gap-7">

      <!-- Amount -->
      <div>
        <h2 class="text-2xl font-bold mb-5">
          Betrag wählen
        </h2>

        <div
            class="
            grid
            grid-cols-2
            sm:grid-cols-3
            lg:grid-cols-5
            gap-3
          "
        >
          <UButton
              v-for="item in amounts"
              :key="item.amount"
              size="xl"
              block
              :color="selectedAmount === item.amount && !customSelected ? 'primary' : 'neutral'"
              :variant="selectedAmount === item.amount && !customSelected ? 'solid' : 'outline'"
              class="h-32 flex-col justify-center"
              @click="selectAmount(item.amount)"
          >
            <div class="flex flex-col items-center gap-1">
              <span class="text-xl font-bold">
                {{ item.amount }} €
              </span>

              <span class="text-sm text-center">
                {{ item.label }}
              </span>
            </div>
          </UButton>

          <!-- Custom amount -->
          <UButton
              size="xl"
              block
              :color="customSelected ? 'primary' : 'neutral'"
              :variant="customSelected ? 'solid' : 'outline'"
              class="h-32 flex-col justify-center"
              @click="selectCustomAmount"
          >
            <div class="flex flex-col items-center gap-2">
              <span class="font-semibold">
                Eigener Betrag
              </span>

              <UIcon
                  name="i-lucide-pencil"
                  class="size-6"
              />
            </div>
          </UButton>
        </div>

        <!-- Custom amount input -->
        <Transition name="fade">
          <div
              v-if="customSelected"
              class="mt-4"
          >
            <UInput
                v-model.number="customAmount"
                type="number"
                min="1"
                step="1"
                size="xl"
                placeholder="Betrag eingeben"
                class="w-full sm:max-w-xs"
            >
              <template #trailing>
                €
              </template>
            </UInput>
          </div>
        </Transition>
      </div>

      <!-- Receipt -->
<!--      <UCheckbox-->
<!--          v-model="receipt"-->
<!--          label="Ich möchte eine Spendenquittung erhalten."-->
<!--          size="lg"-->
<!--      />-->

      <!-- Continue -->
      <UButton
          color="primary"
          size="xl"
          block
          :disabled="finalAmount <= 0"
          class="py-4 text-lg font-semibold"
          @click="continueDonation"
      >
        <span class="flex items-center justify-center gap-3">
          Weiter zur Spende

          <UIcon
              name="i-lucide-arrow-right"
              class="size-5"
          />
        </span>
      </UButton>

      <!-- Secure payment -->
      <div class="flex flex-col gap-4">
        <div class="flex items-center gap-2 text-muted">
          <UIcon
              name="i-lucide-lock-keyhole"
              class="size-5"
          />

          <span>
      Sichere und verschlüsselte Zahlung über Stripe
    </span>
        </div>

        <div class="flex flex-wrap items-center gap-3">
          <UBadge
              color="neutral"
              variant="outline"
              size="lg"
              v-for="provider in paymentProvider"
              :key="provider.alt"
              class="dark:bg-white"
          >
            <NuxtImg :src="provider.src"
                     :alt="provider.alt"
                     class="h-8 w-auto"/>
          </UBadge>
        </div>
      </div>

    </div>

    <!-- RIGHT SIDE -->
    <UCard>
      <div class="flex flex-col gap-8">

        <div>
          <h2 class="text-2xl font-bold">
            Gemeinsam für den HSV Ottbergen
          </h2>

          <p class="text-muted mt-2">
            Mit Ihrer Spende unterstützen Sie den Heimatschutzverein Ottbergen
            von 1567 e.V. und helfen dabei, Tradition, Sport und Gemeinschaft
            auch in Zukunft zu erhalten.
          </p>
        </div>

        <div
            v-for="benefit in benefits"
            :key="benefit.title"
            class="flex gap-5"
        >
          <div
              class="
              shrink-0
              flex items-center justify-center
              size-14
              text-primary
            "
          >
            <UIcon
                :name="benefit.icon"
                class="size-10"
            />
          </div>

          <div>
            <h3 class="text-lg font-semibold">
              {{ benefit.title }}
            </h3>

            <p class="text-muted mt-1 leading-relaxed">
              {{ benefit.description }}
            </p>
          </div>
        </div>

      </div>
    </UCard>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
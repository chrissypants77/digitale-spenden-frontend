<script setup lang="ts">
import {getTaxPdf} from "~/composables/requests/payment/getTaxPdf.ts";

interface GeoapifyResult {
  properties: {
    formatted: string
    street?: string
    housenumber?: string
    postcode?: string
    city?: string
    town?: string
    village?: string
    country?: string
    country_code?: string
    lat: number
    lon: number
  }
}

const route = useRoute()

const secret = route.query.secret as string | undefined
if (!secret) {
  navigateTo('/donate')
}

const config = useRuntimeConfig()

const form = reactive({
  street: '',
  houseNumber: '',
  postcode: '',
  city: ''
})

const search = ref('')
const suggestions = ref<GeoapifyResult[]>([])
const loading = ref(false)

let debounceTimer: ReturnType<typeof setTimeout>

watch(search, (value) => {
  clearTimeout(debounceTimer)

  if (value.length < 3) {
    suggestions.value = []
    return
  }

  debounceTimer = setTimeout(() => {
    searchAddress(value)
  }, 300)
})

async function searchAddress(query: string) {
  loading.value = true

  try {
    const response = await $fetch<{ features: GeoapifyResult[] }>(
        'https://api.geoapify.com/v1/geocode/autocomplete',
        {
          params: {
            text: query,
            apiKey: config.public.geoapifyApiKey,

            // Only return German addresses
            filter: 'countrycode:de',

            // Return results in German
            lang: 'de',

            limit: 5
          }
        }
    )

    suggestions.value = response.features
  } catch (error) {
    console.error('Geoapify autocomplete failed:', error)
    suggestions.value = []
  } finally {
    loading.value = false
  }
}

const isSelecting = ref(false)

watch(search, (value) => {
  clearTimeout(debounceTimer)

  // Don't search when we're setting the value after a selection
  if (isSelecting.value) {
    isSelecting.value = false
    return
  }

  if (value.length < 3) {
    suggestions.value = []
    return
  }

  debounceTimer = setTimeout(() => {
    searchAddress(value)
  }, 300)
})

async function selectAddress(result: GeoapifyResult) {
  const address = result.properties

  form.street = address.street ?? ''
  form.houseNumber = address.housenumber ?? ''
  form.postcode = address.postcode ?? ''
  form.city =
      address.city ??
      address.town ??
      address.village ??
      ''

  isSelecting.value = true
  search.value = address.formatted
  suggestions.value = []

  await nextTick()

  isSelecting.value = false
}

function checkForm() {
  if (form.street && form.houseNumber && form.postcode && form.city) {
    isFormValid.value = true
  }
}

async function downloadPDF() {
  if (!isFormValid.value) {
    return
  }
  const options = {
    secret: secret as string,
    street: form.street,
    number: form.houseNumber,
    postal: form.postcode,
    city: form.city
  }

  const data = await getTaxPdf(options)
  if (!data) {
    return
  }
  try {
    const blob = new Blob([data], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `spenden-beleg-${secret}.pdf`;
    link.click();
  } catch(error) {
    console.error(error)
  }
}

const isFormValid = ref(false)

</script>

<template>
  <div class="space-y-4">
    <h1>Spenden Beleg Erstellen</h1>
    <UForm :state="form">

      <!-- Autocomplete -->
      <UFormField label="Adresse">
        <div class="relative">
          <UInput
              v-model="search"
              placeholder="Straße und Hausnummer eingeben..."
              icon="i-lucide-map-pin"
              :loading="loading"
              class="w-full"
          />

          <!-- Suggestions -->
          <div
              v-if="suggestions.length"
              class="
            absolute z-50 mt-1 w-full
            rounded-lg border border-default
            bg-default shadow-lg
            overflow-hidden
          "
          >
            <button
                v-for="result in suggestions"
                :key="`${result.properties.lat}-${result.properties.lon}`"
                type="button"
                class="
              flex w-full items-start gap-3
              px-4 py-3 text-left
              hover:bg-elevated
              transition-colors
            "
                @click="selectAddress(result)"
            >
              <UIcon
                  name="i-lucide-map-pin"
                  class="mt-0.5 size-4 shrink-0 text-muted"
              />

              <span class="text-sm">
              {{ result.properties.formatted }}
            </span>
            </button>
          </div>
        </div>
      </UFormField>

      <!-- Filled automatically -->
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <UFormField
            label="Straße"
            name="street"
            class="sm:col-span-2"
        >
          <UInput
              v-model="form.street"
              class="w-full"
          />
        </UFormField>

        <UFormField
            label="Hausnummer"
            name="houseNumber"
        >
          <UInput
              v-model="form.houseNumber"
              class="w-full"
          />
        </UFormField>
      </div>

      <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <UFormField
            label="PLZ"
            name="postcode"
        >
          <UInput
              v-model="form.postcode"
              class="w-full"
          />
        </UFormField>

        <UFormField
            label="Ort"
            name="city"
            class="sm:col-span-2"
        >
          <UInput
              v-model="form.city"
              class="w-full"
          />
        </UFormField>
      </div>

    </UForm>
    <div>
      Dies kann nur einmal Heruntergeladen werden pro Spende. Bitte Überprüfen Sie Ihre Angaben.
    </div>
    <UCheckbox label="Ich bestätige, dass meine Angaben korrekt sind." v-on:click="checkForm()"/>
    <UButton label="PDF Herunterladen" :disabled="!isFormValid" v-on:click="downloadPDF()"/>
  </div>
</template>
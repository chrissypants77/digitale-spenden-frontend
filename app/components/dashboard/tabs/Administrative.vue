<script setup lang="ts">
import type {TableColumn} from '@nuxt/ui'
import {UCheckbox} from "#components";
import {isEmpty} from "#ui/utils";
import {addManualDonation, type ManualDonationOptions} from "~/composables/requests/addManualDonation.ts";
import { getPaginationRowModel } from '@tanstack/vue-table'
import {getDonations, type GetDonationsReturn} from "~/composables/requests/getDonations.ts";
import {deleteDonation} from "~/composables/requests/deleteDonation.ts";

const toast = useToast()

async function loadDonations() {
  const donations = await getDonations()
  if (!donations) return []
  donations.forEach(donation => {
    donation.name = donation.donator.name
    donation.email = donation.donator.email
  })
  return donations.reverse()
}

let donationData = ref(await loadDonations())

const columns: TableColumn<GetDonationsReturn>[] = [
  {
    id: 'select',
    header: ({table}) =>
        h(UCheckbox, {
          size: 'xl',
          modelValue: table.getIsSomePageRowsSelected() ? 'indeterminate' : table.getIsAllPageRowsSelected(),
          'onUpdate:modelValue': (value: boolean | 'indeterminate') => table.toggleAllPageRowsSelected(!!value),
          'aria-label': 'Select all',
          color: 'primary',
          ui: {
            base: 'border-2'
          }
        }),
    cell: ({row}) =>
        h(UCheckbox, {
          size: 'lg',
          modelValue: row.getIsSelected(),
          'onUpdate:modelValue': (value: boolean | 'indeterminate') => row.toggleSelected(!!value),
          'aria-label': 'Select row',
          color: 'primary',
          ui: {
            base: 'border-2'
          }
        })
  },
  {
    accessorKey: 'id',
    header: 'ID',
    meta: {
      class: {
        th: 'text-center text-black',
        td: 'text-center text-black'
      }
    }
  },
  {
    accessorKey: 'date',
    header: 'Datum',
    cell: ({row}) => {
      return new Date(row.getValue('date')).toLocaleString('de-de', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      })
    },
    meta: {
      class: {
        th: 'text-center text-black',
        td: 'text-center text-black'
      }
    }
  },
  {
    accessorKey: 'email',
    header: 'Email',
    meta: {
      class: {
        th: 'text-left text-black',
        td: 'text-left text-black'
      }
    }
  },
  {
    accessorKey: 'name',
    header: 'Name',
    meta: {
      class: {
        th: 'text-left text-black',
        td: 'text-left text-black'
      }
    }
  },
  {
    accessorKey: 'amount',
    header: 'Amount',
    meta: {
      class: {
        th: 'text-left',
        td: 'text-left'
      }
    },
    cell: ({row}) => {
      const amount = Number.parseFloat(row.getValue('amount'))
      const formatted = new Intl.NumberFormat('de-de', {
        style: 'currency',
        currency: 'EUR'
      }).format(amount)
      return h('span', {class: 'font-semibold text-success'}, formatted)
    }
  }
]

async function deleteSelectedRows() {
  const selectedAmount = Object.keys(rowSelection.value).length
  const selectedRowIds = Object.keys(rowSelection.value)
  const toDeleteRowData = donationData.value.filter((_, index) => selectedRowIds.includes(index.toString()))
  const toDeleteRowIds = toDeleteRowData.map((value) => value.id)

  const isDeleted = await deleteDonation(toDeleteRowIds)

  modalStatusDelete.value = false

  if (!isDeleted) {
    toast.add({
      title: "Erfolgreich Gelöscht",
      description: "Fehler bei der Löschung der Daten",
      icon: "i-lucide-database-x",
      color: "error"
    })
    return
  }

  rowSelection.value = {}

  let text: string
  if (selectedAmount == 1) {
    text = `Es wurde 1 Eintrag erfolgreich gelöscht.`
  } else {
    text = `Es wurden ${selectedAmount} Einträge erfolgreich gelöscht.`
  }
  toast.add({
    title: "Erfolgreich Gelöscht",
    description: text,
    icon: "i-lucide-database-check",
    color: "success"
  })

  donationData.value = await loadDonations()
}

function getRowsToBeDeleted() {
  const selectedRowIds = Object.keys(rowSelection.value)
  return donationData.value.filter((_, index) => selectedRowIds.includes(index.toString()))
}

const table = useTemplateRef('table')

const rowSelection = ref({})

const modalStatusDelete = ref(false)
const modalStatusAdd = ref(false)

const deleteColumns = unref(columns).filter((value, index) => value.id !== "select")

const form = reactive({
  date: '',
  currentTime: false,
  payment_method: "cash",
  email: '',
  amount: 0,
  name: ''
})

const paymentTypes = [
  {
    label: "Bar",
    value: "cash"
  },
  {
    label: "Banküberweisung",
    value: "bank"
  }
]

const validate = () => {
  const errors: Record<string, string> = {}

  if (!form.date) {
    errors.date = 'Datum ist erforderlich.'
  }

  if (!form.name) {
    errors.name = 'Name ist erforderlich.'
  }

  if (!form.email) {
    errors.email = 'E-Mail ist erforderlich.'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = 'Bitte geben Sie eine gültige E-Mail-Adresse ein.'
  }

  if (
      form.amount === undefined ||
      form.amount === null ||
      Number.isNaN(Number(form.amount))
  ) {
    errors.amount = 'Betrag ist erforderlich.'
  } else if (Number(form.amount) < 0) {
    errors.amount = 'Der Betrag darf nicht negativ sein.'
  } else if (Number(form.amount) > 10000) {
    errors.amount = 'Der Betrag darf maximal 10.000 € betragen.'
  }

  return errors
}

async function addDonation() {
  if (form.currentTime) {
    form.date = new Date().toISOString()
  }

  const errors = validate()

  if (!isEmpty(errors)) {
    toast.add({
      title: "Beim Hinzufügen sind Fehler Aufgetreten",
      description: JSON.stringify(errors),
      icon: "i-lucide-database-x",
      color: "error"
    })
    return
  }

  modalStatusAdd.value = false

  const response = await addManualDonation(form as ManualDonationOptions)
  if (response) {
    donationData.value = await loadDonations()
  }
}

const pagination = ref({
  pageIndex: 0,
  pageSize: 10
})

</script>

<template>
  <div class="flex-col">
    <div class="flex gap-4 mb-4">
      <UModal
        v-model:open="modalStatusAdd"
        title="Hinzufügen"
        :ui="{
          content: '',
          body: 'p-6'
        }"
      >
        <UButton
            label="Hinzufügen"
            color="success"
            size="xl"
        />
        <template #body>
          <UFormField label="Datum und Uhrzeit" name="date" required>
            <div class="flex items-center gap-3">
              <UInput
                  v-model="form.date"
                  type="datetime-local"
                  class="flex-1"
                  :disabled="form.currentTime"
              />

              <UCheckbox
                  v-model="form.currentTime"
                  label="Aktuelle Zeit"
              />
            </div>
          </UFormField>

          <!-- Payment Type -->
          <UFormField label="Zahlungsart" name="paymentType" required>
            <USelect
                v-model="form.payment_method"
                :items="paymentTypes"
                class="w-full"
            />
          </UFormField>

          <!-- Email -->
          <UFormField label="E-Mail" name="email" required>
            <UInput
                v-model="form.email"
                type="email"
                placeholder="beispiel@email.de"
                class="w-full"
            />
          </UFormField>

          <!-- Name -->
          <UFormField label="Vollder Name" name="name" required>
            <UInput
                v-model="form.name"
                type="text"
                class="w-full"
            />
          </UFormField>

          <!-- Amount -->
          <UFormField label="Betrag in €" name="amount" required>
            <UInput
                v-model.number="form.amount"
                type="number"
                min="0"
                max="10000"
                step="0.01"
                placeholder="0.00"
                class="w-full"
            />
          </UFormField>
          <UButton class="mt-4" label="Hinzufügen" size='xl' color="success" v-on:click="addDonation()"/>
        </template>
      </UModal>
      <UModal
          v-model:open="modalStatusDelete"
          title="Löschen"
          description="Folgende Einträge werden gelöscht."
          :ui="{
              content: 'w-[90vw] max-w-6xl',
              body: 'p-6'
          }"
      >
        <UButton
            label="Löschen"
            color="error"
            size="xl"
            :disabled="isEmpty(rowSelection)"
        />
        <template #body>
          <div class="w-full space-y-6">
            <div class="w-full overflow-x-auto">
              <UTable
                  :data="getRowsToBeDeleted()"
                  :columns="deleteColumns"
                  class="w-full"
              />
            </div>
            <UButton
                label="Löschen Bestätigen"
                color="error"
                @click="deleteSelectedRows()"
            />
          </div>
        </template>
      </UModal>
    </div>
    <div class="flex flex-col w-full h-full">
      <UTable
          ref="table"
          v-model:row-selection="rowSelection"
          v-model:pagination="pagination"
          :data="donationData"
          :columns="columns"
          class="w-full flex-1"
          :ui="{
            th: 'px-6 py-4 text-lg font-bold',
            td: 'px-6 py-4 text-lg'
          }"
          :pagination-options="{
            getPaginationRowModel: getPaginationRowModel()
          }"
      />
      <div class="flex justify-center p-4">
        <UPagination
            size="xl"
            :page="(table?.tableApi?.getState().pagination.pageIndex || 0) + 1"
            :items-per-page="table?.tableApi?.getState().pagination.pageSize"
            :total="table?.tableApi?.getFilteredRowModel().rows.length"
            @update:page="(page) => table?.tableApi?.setPageIndex(page - 1)"
        />
      </div>
    </div>
  </div>
</template>
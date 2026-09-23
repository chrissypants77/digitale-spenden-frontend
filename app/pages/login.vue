<script setup lang="ts">
const userStore = useUserStore()

const state = ref({
  email: "",
  password: "",
})

definePageMeta({
  middleware: "login"
})

async function handleLogin() {
  if (state.value.email === "" || state.value.password === "") return

  await userStore.login(state.value.email, state.value.password)
}

</script>

<template>
  <div class="flex items-center">
    <div class="form-field">
      <UForm>
        <UFormField label="Email" name="email">
          <UInput v-model="state.email" />
        </UFormField>
        <UFormField class="mt-4" label="Passwort" name="password">
          <UInput v-model="state.password" type="password" />
        </UFormField>

        <UButton class="mt-4" type="submit" color="primary" v-on:click="handleLogin">
          Anmelden
        </UButton>
      </UForm>
    </div>
  </div>

</template>

<style scoped>
.form-field {
  border: 2px solid var(--ui-primary);
  background: color-mix(in srgb, var(--ui-primary) 8%, var(--ui-bg));
  border-radius: 0.3rem;
  padding: 1rem;
  width: fit-content;
  margin-inline: auto;
  transform: translateY(-24px);
}
</style>
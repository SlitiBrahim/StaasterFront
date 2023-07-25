<template>
  <v-container fill-height>
    <Alert :msg="errorMsg" type="error"></Alert>

    <v-row>
      <v-col>
        <v-img
          class="mx-auto my-6"
          max-width="228"
          src="https://cdn.vuetifyjs.com/docs/images/logos/vuetify-logo-v3-slim-text-light.svg"
        ></v-img>
      </v-col>
    </v-row>

    <v-row justify="center" align="center">
      <v-col cols="12" sm="8" md="4" v-if="!passwordResetSuccessful">
        <v-card
          class="mx-auto pa-4 pb-8"
          max-width="448"
          elevation="6"
          title="Forgot your password?"
        >
          <v-card-text>
            <p>Enter the email address you used when you joined and we'll send you instructions to reset your password.</p>

            <v-form class="mt-4" @submit.prevent="submit" ref="form">
              <v-text-field
                v-model="email"
                color="primary"
                label="Email"
                placeholder="Enter your email"
                :rules="[formRules.required, formRules.email]"
                variant="outlined"
                prepend-inner-icon="mdi-email-outline"
                required
                class="mt-4"
              ></v-text-field>

              <p><nuxt-link to="/login" class="text-decoration-none">Go Back</nuxt-link></p>

              <v-btn color="primary" class="mt-4" block @click="submit()">Send Instructions</v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col v-else>
        <v-row justify="center" class="mt-10">
          <v-icon x-large color="green">mdi-check-circle</v-icon>
        </v-row>
        <v-row justify="center" class="mt-3">
          <h2>Success! Please check your emails to reset your password.</h2>
      </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import formRules from '@/utils/form-rules'
import { useAuthStore } from '@/store/auth'

const authStore = useAuthStore()

const email = ref(null)
const passwordResetSuccessful = ref(false)
const errorMsg = computed(() => authStore.passwordResetError)
const form = ref(null)

const validate = async () => {
  const { valid } = await form.value.validate()
  return valid
}

const submit = async () => {
  const formIsValid = await validate()
  if (!formIsValid) return

  try {
    await authStore.resetPassword(email.value)
    passwordResetSuccessful.value = true;
    setTimeout(async () => {
      await navigateTo('/login')
    }, 4000)
  } catch(e) {
    console.log(e)
  }
}
</script>

<style scoped>
</style>

<template>
  <v-container>
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

    <v-row>
      <v-col>
        <v-card
          class="mx-auto pa-12 pb-8"
          max-width="448"
          elevation="6"
          title="Login to your account"
        >
          <v-form @submit.prevent="submit" ref="form">
            <v-container>
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
  
              <v-text-field
                :append-inner-icon="passwordVisible ? 'mdi-eye-off' : 'mdi-eye'"
                :type="passwordVisible ? 'text' : 'password'"
                v-model="password"
                color="primary"
                label="Password"
                placeholder="Enter your password"
                :rules="formRules.password"
                variant="outlined"
                prepend-inner-icon="mdi-lock-outline"
                class="mt-4"
                required
                @click:append-inner="passwordVisible = !passwordVisible"
              ></v-text-field>

              <p><nuxt-link to="/password-reset" class="text-decoration-none">Forgot password</nuxt-link></p>

              <v-btn
                block
                color="primary"
                variant="flat"
                size="large"
                type="submit"
                class="mt-4"
              >
                Login
              </v-btn>

              <p class="mt-5">You don't have an account yet? <nuxt-link to="/signup" class="text-decoration-none">Sign up</nuxt-link></p>
            </v-container>
          </v-form>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import formRules from '@/utils/form-rules'
import { useAuthStore } from '@/store/auth'

const authStore = useAuthStore()

const email = ref(null)
const password = ref(null)
const form = ref(null)
const passwordVisible = ref(false)
const errorMsg = computed(() => authStore.loginError)

const validate = async () => {
  const { valid } = await form.value.validate()
  return valid
}

const submit = async () => {
  const formIsValid = await validate()
  if (!formIsValid) return

  try {
    await authStore.login(email.value, password.value)
    await redirectToDashboard()
  } catch(e) {
    console.log(e);
  }
}

const redirectToDashboard = async () => {
  await navigateTo('/dashboard')
}

</script>
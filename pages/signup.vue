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
          title="Create your account"
          v-if="!signupSuccessful"
        >
          <v-form @submit.prevent="submit" ref="form">
            <v-container>
              <v-text-field
                v-model="name"
                :rules="[formRules.required, formRules.length(5)]"
                color="primary"
                label="Full Name"
                placeholder="Enter your full name"
                variant="outlined"
                prepend-inner-icon="mdi-account-outline"
                maxlength="30"
                required
              ></v-text-field>
  
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
  
              <v-checkbox
                v-model="terms"
                color="primary"
                label="I agree to site terms and conditions"
                :rules="[v => !!v || 'You must agree to continue.']"
                required
              ></v-checkbox>

              <v-btn
                block
                color="primary"
                variant="flat"
                size="large"
                type="submit"
              >
                Sign Up
              </v-btn>

              <p class="mt-5">Already have an account? <nuxt-link to="/login" class="text-decoration-none">Log In</nuxt-link></p>
            </v-container>
          </v-form>
        </v-card>
        <div v-else>
          <v-row justify="center" class="mt-10">
            <v-icon x-large color="green">mdi-check-circle</v-icon>
          </v-row>
          <v-row justify="center" class="mt-3">
            <h2 class="headline font-weight-bold">Success!</h2>
          </v-row>
          <v-row justify="center" class="mt-2">
            <v-col cols="12" sm="8" md="6">
              <p>
                Your account has been successfully created! 
                Please check your email for a verification link to complete the sign-up process.
              </p>
            </v-col>
          </v-row>
          <v-row justify="center" class="mt-8">
            <v-btn size="large" color="primary" @click="redirectToLogin">Log In</v-btn>
          </v-row>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import formRules from '@/utils/form-rules'
import { useAuthStore } from '@/store/auth'

const authStore = useAuthStore()

const name = ref(null)
const email = ref(null)
const password = ref(null)
const terms = ref(false)
const passwordVisible = ref(false)
const form = ref(null)
const signupSuccessful = ref(false)
const errorMsg = computed(() => authStore.signupError)

const validate = async () => {
  const { valid } = await form.value.validate()
  return valid
}

const redirectToLogin = async () => {
  await navigateTo('/login')
}

const submit = async () => {
  const formIsValid = await validate()
  if (!formIsValid) return

  try {
    await authStore.signup(email.value, password.value, name.value)
    signupSuccessful.value = true
  } catch(e) {
    console.log(e)
  }
}

</script>
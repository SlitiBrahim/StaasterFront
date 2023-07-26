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
          title="Change your password"
          v-if="!passwordChangeSuccessful"
        >
          <v-form @submit.prevent="submit" ref="form">
            <v-container>
              <v-text-field
                :append-inner-icon="currentPasswordVisible ? 'mdi-eye-off' : 'mdi-eye'"
                :type="currentPasswordVisible ? 'text' : 'password'"
                v-model="currentPassword"
                color="primary"
                label="Current Password"
                placeholder="Enter your current password"
                :rules="formRules.password"
                variant="outlined"
                prepend-inner-icon="mdi-lock-outline"
                class="mt-4"
                required
                @click:append-inner="currentPasswordVisible = !currentPasswordVisible"
              ></v-text-field>

              <v-text-field
                :append-inner-icon="newPasswordVisible ? 'mdi-eye-off' : 'mdi-eye'"
                :type="newPasswordVisible ? 'text' : 'password'"
                v-model="newPassword"
                color="primary"
                label="New Password"
                placeholder="Enter your new password"
                :rules="formRules.password"
                variant="outlined"
                prepend-inner-icon="mdi-lock-outline"
                class="mt-4"
                required
                @click:append-inner="newPasswordVisible = !newPasswordVisible"
              ></v-text-field>
  
              <v-btn
                block
                color="primary"
                variant="flat"
                size="large"
                type="submit"
              >
                Change password
              </v-btn>

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
                Your password has been successfully updated!
              </p>
            </v-col>
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

const currentPassword = ref(null)
const newPassword = ref(null)
const currentPasswordVisible = ref(false)
const newPasswordVisible = ref(false)
const form = ref(null)
const passwordChangeSuccessful = ref(false)
const errorMsg = computed(() => authStore.passwordChangeError)

const validate = async () => {
  const { valid } = await form.value.validate()
  return valid
}

const submit = async () => {
  const formIsValid = await validate()
  if (!formIsValid) return

  try {
    await authStore.changePassword(currentPassword.value, newPassword.value)
    passwordChangeSuccessful.value = true
    setTimeout(async () => {
      await navigateTo('/dashboard')
    }, 4000)
  } catch(e) {
    console.log(e)
  }
}

</script>
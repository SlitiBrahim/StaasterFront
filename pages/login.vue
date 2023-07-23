<template>
  <v-container>
    <Alert type="error" v-if="userLoginError" :key="alertKey">
      The email or password you entered is incorrect. If you've forgotten your password, you can use the 'Forgot password' link to reset it.
    </Alert>

    <Alert type="error" v-if="verificationEmailError">
      An error happened when trying to send the verification email.
    </Alert>

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

<script>
import formRules from '@/utils/form-rules'
import PocketBase from 'pocketbase'

let pb = null

export default {
  data: () => ({
    email: null,
    password: null,
    passwordVisible: false,
    formRules,

    userLoginError: false,

    alertKey: 0,
  }),

  methods: {
    async validate() {
      const { valid } = await this.$refs.form.validate()
      return valid
    },

    async submit() {
      const formIsValid = await this.validate()
      if (!formIsValid) return

      try {
        await pb.collection('users').authWithPassword(this.email, this.password);

        if (pb.authStore.isValid) await this.redirectToDashboard()
      } catch(e) {
        console.log("Could not log in user", JSON.stringify(e));
        this.userLoginError = true
        // re-render component (without this it only renders once when true and then doesn't show again if other issues)
        this.alertKey++
      }
    },

    async redirectToDashboard() {
      await navigateTo('/dashboard')
    }
  },

  created() {
    pb = new PocketBase('http://127.0.0.1:8090')
  }
}
</script>
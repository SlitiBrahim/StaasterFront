<template>
  <v-container>
    <Alert type="error" v-if="userCreationError">
      An error happened when creating the user.
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
          title="Create your account"
          v-if="!signupSuccessful"
        >
          <v-form @submit.prevent="submit" ref="form">
            <v-container>
              <v-text-field
                v-model="name"
                :rules="[formRules.required, formRules.length(5)]"
                color="primary"
                label="Name"
                placeholder="Enter your name"
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
        </div>
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
    name: null,
    email: null,
    password: null,
    terms: false,
    passwordVisible: false,
    formRules,

    userCreationError: false,
    verificationEmailError: false,

    signupSuccessful: false,
  }),

  methods: {
    async validate() {
      const { valid } = await this.$refs.form.validate()
      return valid
    },

    async submit() {
      const formIsValid = await this.validate()
      if (!formIsValid) return

      console.log("submit", this.name, this.email, this.password);

      const data = {
        email: this.email,
        emailVisibility: true,
        password: this.password,
        passwordConfirm: this.password,
        name: this.name,
      }

      try {
        await pb.collection('users').create(data);
        
        try {
          await pb.collection('users').requestVerification(this.email)

          this.signupSuccessful = true
        } catch(e) {
          console.log("Could not send email verification, try later");
          this.verificationEmailError = true;
        }
      } catch(e) {
        console.log("Could not create user", JSON.stringify(e));
        this.userCreationError = true;
      }
    }
  },

  created() {
    pb = new PocketBase('http://127.0.0.1:8090')
  }
}
</script>
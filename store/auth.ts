import { defineStore } from 'pinia'
import PocketBase from 'pocketbase'

const pb = new PocketBase('http://127.0.0.1:8090')

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: null,

    signupError: null,
    loginError: null,
    passwordResetError: null,
  }),
  persist: true, // persist state accross reloads by storing state in cookies

  getters: {
    isAuthenticated(): boolean {
        return this.token !== null;
    }
  },

  actions: {
    setUser(user) {
      this.user = user
    },

    setToken(token) {
      this.token = token
    },

    async login(email: string, password: string) {
        this.loginError = null

        try {
            const data = await pb.collection('users').authWithPassword(email, password)
    
            if (pb.authStore.isValid) {
                this.setToken(data.token)
                this.setUser(data.record)
            }
          } catch(e) {
            console.log("Could not log in user", JSON.stringify(e))
            this.loginError = `The email or password you entered is incorrect.
            If you've forgotten your password, you can use the 'Forgot password' link to reset it.`
            throw e
        }
    },

    async logout() {
        await pb.authStore.clear()
        this.setToken(null)
        this.setUser(null)
    },

    async signup(email: string, password: string, name: string) {
        const data = {
            email,
            password,
            passwordConfirm: password,
            emailVisibility: true,
            name,
        }

        // Reset error message before each attempt so alert is displayed again if new error with same prev error message
        // example: (multiple signup attempt with same email that is already used: will display error each time)
        this.signupError = null

        try {
            await pb.collection('users').create(data);
        } catch(e) {
            console.log("Could not create user", JSON.stringify(e));
            this.signupError = "An error happened when creating the user. An account may already exist with this email."
            throw e
        }

        try {
            await pb.collection('users').requestVerification(email)
        } catch(e) {
            console.log("Could not send email verification", JSON.stringify(e))
            this.signupError = "Could not send email verification, please try later."
            throw e
        }
    },

    async resetPassword(email: string) {
        this.passwordResetError = null

        try {
            await pb.collection('users').requestPasswordReset(email);
        } catch(e) {
            console.log("Could not request password reset", JSON.stringify(e));
            this.passwordResetError = "Unable to request password reset, please try later."
            throw e
        }
    },
  },
})

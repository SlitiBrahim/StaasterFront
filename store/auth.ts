import { defineStore } from 'pinia'
import PocketBase from 'pocketbase'

const pb = new PocketBase('http://127.0.0.1:8090')

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: null,

    signupError: null,
    loginError: null,
  }),

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

    logout() {
      this.setUser(null)
      this.setToken(null)
    },
  },
})

import { defineStore } from 'pinia'
import PocketBase from 'pocketbase'

const pb = new PocketBase('http://127.0.0.1:8090')

// local storage key names
const LS_USER_KEY = 'auth_user'
const LS_TOKEN_KEY = 'auth_token'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: JSON.parse(localStorage.getItem(LS_USER_KEY)) ||  null,
    token: localStorage.getItem(LS_TOKEN_KEY) || null,

    signupError: null,
    loginError: null,
    passwordResetError: null,
    passwordChangeError: null,
  }),
  persist: false, // persist state accross reloads by storing state in cookies

  getters: {
    isAuthenticated(): boolean {
        return this.token !== null;
    }
  },

  actions: {
    setUser(user) {
      this.user = user
      if (user !== null) {
        localStorage.setItem(LS_USER_KEY, JSON.stringify(this.user))
      } else {
        localStorage.removeItem(LS_USER_KEY)
      }
    },

    setToken(token) {
      this.token = token
      if (token !== null) {
        localStorage.setItem(LS_TOKEN_KEY, this.token)
      } else {
        localStorage.removeItem(LS_TOKEN_KEY)
      }
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

    async changePassword(oldPassword: string, newPassword: string) {
        try {
            const data = {
                oldPassword,
                password: newPassword,
                passwordConfirm: newPassword,
            }
            const updatedUser = await pb.collection('users').update(pb.authStore.model?.id, data)
            this.setUser(updatedUser)
        } catch(e) {
            console.log("Could not request password change", JSON.stringify(e));
            this.passwordChangeError = "Unable to request password change, please try later."
            throw e
        }
    },

    async authRefresh() {
        try {
            // "instanciate" pb with the user saved token
            // in order to be able to refresh its token if still valid or logging out the user
            pb.authStore.save(this.token, { verified: false });
            const authData = await pb.collection('users').authRefresh()
            this.setToken(authData.token)
            this.setUser(authData.record)
        } catch(e) {
            console.log("Could not refresh user token", e);
            await this.logout()
            throw e
        }
    },
  },
})

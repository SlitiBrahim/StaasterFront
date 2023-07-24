import { defineStore } from 'pinia'
import PocketBase from 'pocketbase'

const pb = new PocketBase('http://127.0.0.1:8090')

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: null,
  }),

  getters: {
    authenticated(): boolean {
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
        try {
            const data = await pb.collection('users').authWithPassword(email, password)
    
            if (pb.authStore.isValid) {
                this.setToken(data.token)
                this.setUser(data.record)
            }
          } catch(e) {
            throw e
        }

    },

    logout() {
      this.setUser(null)
      this.setToken(null)
    },
  },
})

// src/stores/user.js
import { defineStore } from 'pinia'
import { jwtDecode } from 'jwt-decode'

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null
  }),
  actions: {
    loadUser() {
      const token = localStorage.getItem('token')
      if (token) {
        try {
          this.user = jwtDecode(token)
        } catch {
          this.user = null
        }
      }
    },
    logout() {
      localStorage.removeItem('token')
      this.user = null
    }
  }
})

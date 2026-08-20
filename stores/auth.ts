import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    customer: null as any,
    token: null as string | null,
    loading: false,
    error: null as string | null,
  }),

  getters: {
    isLoggedIn: (state) => !!state.token,
  },

  actions: {
    init() {
      if (import.meta.client) {
        this.token = localStorage.getItem('auth_token')
        const stored = localStorage.getItem('auth_customer')
        if (stored) {
          try {
            this.customer = JSON.parse(stored)
          } catch {
            /* ignore */
          }
        }
      }
    },

    setAuth(token: string, customer: any) {
      this.token = token
      this.customer = customer
      if (import.meta.client) {
        localStorage.setItem('auth_token', token)
        localStorage.setItem('auth_customer', JSON.stringify(customer))
      }
    },

    async login(email: string, password: string) {
      const sdk = useMedusa()
      this.loading = true
      this.error = null
      try {
        const token = await sdk.auth.login('customer', 'emailpass', { email, password })
        const { customer } = await sdk.store.customer.retrieve({}, { Authorization: `Bearer ${token}` })
        this.setAuth(token, customer)
      } catch (e: any) {
        this.error = e?.message || 'Login failed'
        throw e
      } finally {
        this.loading = false
      }
    },

    async register(data: { email: string; password: string; first_name: string; last_name: string }) {
      const sdk = useMedusa()
      this.loading = true
      this.error = null
      try {
        await sdk.auth.register('customer', 'emailpass', data)
        await this.login(data.email, data.password)
      } catch (e: any) {
        this.error = e?.message || 'Registration failed'
        throw e
      } finally {
        this.loading = false
      }
    },

    async fetchCustomer() {
      if (!this.token) return
      const sdk = useMedusa()
      try {
        const { customer } = await sdk.store.customer.retrieve({}, { Authorization: `Bearer ${this.token}` })
        this.customer = customer
        if (import.meta.client) {
          localStorage.setItem('auth_customer', JSON.stringify(customer))
        }
      } catch {
        this.logout()
      }
    },

    async logout() {
      const sdk = useMedusa()
      try {
        await sdk.auth.logout()
      } catch {
        /* ignore */
      }
      this.token = null
      this.customer = null
      if (import.meta.client) {
        localStorage.removeItem('auth_token')
        localStorage.removeItem('auth_customer')
      }
    },
  },
})

import { defineStore } from 'pinia'

export const useCartStore = defineStore('cart', {
  state: () => ({
    cart: null as any,
    loading: false,
  }),

  getters: {
    itemCount: (state) => state.cart?.items?.reduce((sum: number, i: any) => sum + i.quantity, 0) ?? 0,
    total: (state) => state.cart?.total ?? 0,
    currency: (state) => state.cart?.currency_code ?? 'usd',
    items: (state) => state.cart?.items ?? [],
    isEmpty: (state) => !state.cart || state.cart.items?.length === 0,
  },

  actions: {
    getCartId(): string | null {
      if (import.meta.client) return localStorage.getItem('cart_id')
      return null
    },

    setCartId(id: string) {
      if (import.meta.client) localStorage.setItem('cart_id', id)
    },

    async ensureCart() {
      if (this.cart) return this.cart
      const sdk = useMedusa()
      const regionId = await useStoreRegionId()
      const id = this.getCartId()

      if (id) {
        try {
          const { cart } = await sdk.store.cart.retrieve(id)
          if (cart && cart.completed_at === null) {
            this.cart = cart
            return this.cart
          }
        } catch {
          // cart expired
        }
      }

      const { cart } = await sdk.store.cart.create(regionId ? { region_id: regionId } : {}, { fields: CART_FIELDS })
      this.setCartId(cart.id)
      this.cart = cart
      return this.cart
    },

    async addItem(variantId: string, quantity = 1) {
      await this.ensureCart()
      const sdk = useMedusa()
      const { cart } = await sdk.store.cart.createLineItem(
        this.cart.id,
        {
          variant_id: variantId,
          quantity,
        },
        { fields: CART_FIELDS },
      )
      this.cart = cart
    },

    async updateItem(lineItemId: string, quantity: number) {
      if (!this.cart) return
      const sdk = useMedusa()
      if (quantity < 1) {
        await sdk.store.cart.deleteLineItem(this.cart.id, lineItemId)
        await this.refresh()
      } else {
        const { cart } = await sdk.store.cart.updateLineItem(
          this.cart.id,
          lineItemId,
          { quantity },
          { fields: CART_FIELDS },
        )
        this.cart = cart
      }
    },

    async removeItem(lineItemId: string) {
      if (!this.cart) return
      const sdk = useMedusa()
      await sdk.store.cart.deleteLineItem(this.cart.id, lineItemId)
      await this.refresh()
    },

    async refresh() {
      if (!this.cart) return
      const sdk = useMedusa()
      try {
        const { cart } = await sdk.store.cart.retrieve(this.cart.id, { fields: CART_FIELDS })
        this.cart = cart
      } catch {
        // stale
      }
    },

    async setShippingMethod(optionId: string) {
      if (!this.cart) return
      const sdk = useMedusa()
      const { cart } = await sdk.store.cart.addShippingMethod(this.cart.id, { option_id: optionId })
      this.cart = cart
    },

    async addPromotion(code: string) {
      if (!this.cart) return
      const sdk = useMedusa()
      const { cart } = await sdk.store.cart.addPromotions(this.cart.id, { promo_codes: [code] })
      this.cart = cart
    },

    async removePromotion(code: string) {
      if (!this.cart) return
      const sdk = useMedusa()
      const { cart } = await sdk.store.cart.removePromotions(this.cart.id, { promo_codes: [code] })
      this.cart = cart
    },

    async updateShippingAddress(address: Record<string, any>) {
      if (!this.cart) return
      const sdk = useMedusa()
      const { cart } = await sdk.store.cart.update(this.cart.id, { shipping_address: address })
      this.cart = cart
    },

    async createPaymentSession(providerId: string) {
      if (!this.cart) return
      const sdk = useMedusa()
      const { payment_collection } = await sdk.store.payment.initiatePaymentSession(this.cart, {
        provider_id: providerId,
      })
      return payment_collection
    },

    async complete() {
      if (!this.cart) return null
      const sdk = useMedusa()
      return sdk.store.cart.complete(this.cart.id)
    },

    clearCart() {
      this.cart = null
      if (import.meta.client) localStorage.removeItem('cart_id')
    },
  },
})

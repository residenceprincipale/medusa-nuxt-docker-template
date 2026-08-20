// ponytail: localStorage cart state in one composable.
// Upgrade: move to a Pinia store if you need SSR cart rendering.

export function useCart() {
  const cart = useState<any>('cart', () => null)
  const medusa = useMedusa()

  async function addRegionIdToParams() {
    const regionId = await useStoreRegionId()
    return regionId ? { region_id: regionId } : {}
  }

  function getCartId(): string | null {
    if (import.meta.client) return localStorage.getItem('cart_id')
    return null
  }

  function setCartId(id: string) {
    if (import.meta.client) localStorage.setItem('cart_id', id)
  }

  async function ensureCart(): Promise<any> {
    if (cart.value) return cart.value

    const id = getCartId()
    if (id) {
      try {
        const regionParams = await addRegionIdToParams()
        const { cart: existing } = await medusa.getCart(id, regionParams)
        if (existing && existing.completed_at === null) {
          cart.value = existing
          return cart.value
        }
      } catch {
        // cart expired or deleted
      }
    }

    const regionParams = await addRegionIdToParams()
    const { cart: newCart } = await medusa.createCart(regionParams)
    setCartId(newCart.id)
    cart.value = newCart
    return cart.value
  }

  async function addItem(variantId: string, quantity = 1) {
    const c = await ensureCart()
    const regionParams = await addRegionIdToParams()
    const { cart: updated } = await medusa.addToCart(c.id, variantId, quantity, regionParams)
    cart.value = updated
  }

  async function updateItem(lineItemId: string, quantity: number) {
    if (!cart.value) return
    const regionParams = await addRegionIdToParams()
    const { cart: updated } = await medusa.updateCartItem(cart.value.id, lineItemId, quantity, regionParams)
    cart.value = updated
  }

  async function refresh() {
    if (!cart.value) return
    try {
      const regionParams = await addRegionIdToParams()
      const { cart: updated } = await medusa.getCart(cart.value.id, regionParams)
      cart.value = updated
    } catch {
      // stale cart
    }
  }

  const itemCount = computed(() => {
    return cart.value?.items?.reduce((sum: number, i: any) => sum + i.quantity, 0) ?? 0
  })

  return { cart, ensureCart, addItem, updateItem, refresh, itemCount }
}

import type { MedusaRequest, MedusaResponse } from '@medusajs/framework/http'

export async function DELETE(req: MedusaRequest, res: MedusaResponse) {
  const customerId = req.headers['x-customer-id'] as string
  const productId = req.params.id

  if (!customerId) {
    return res.status(400).json({ message: 'x-customer-id header is required' })
  }

  const wishlistService: any = req.scope.resolve('wishlist')
  const items = await wishlistService.listWishlists({
    customer_id: customerId,
    product_id: productId,
  })

  if (!items?.length) {
    return res.status(404).json({ message: 'Wishlist item not found' })
  }

  await wishlistService.deleteWishlists(items[0].id)

  res.json({ message: 'Item removed from wishlist' })
}

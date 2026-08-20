import type { MedusaRequest, MedusaResponse } from '@medusajs/framework/http'
import type { WishlistService } from '../../../modules/wishlist/service'

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const customerId = req.headers['x-customer-id'] as string

  if (!customerId) {
    return res.status(400).json({ message: 'x-customer-id header is required' })
  }

  const wishlistService = req.scope.resolve<WishlistService>('wishlist')
  const items = await wishlistService.listWishlists({ customer_id: customerId })

  res.json({ items })
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const customerId = req.headers['x-customer-id'] as string
  const { product_id } = req.body as { product_id: string }

  if (!customerId) {
    return res.status(400).json({ message: 'x-customer-id header is required' })
  }

  if (!product_id) {
    return res.status(400).json({ message: 'product_id is required' })
  }

  const wishlistService = req.scope.resolve<WishlistService>('wishlist')
  const existing = await wishlistService.listWishlists({
    customer_id: customerId,
    product_id,
  })

  if (existing?.length) {
    return res.status(200).json({ item: existing[0] })
  }

  const item = await wishlistService.createWishlists({
    customer_id: customerId,
    product_id,
  })

  res.status(201).json({ item })
}

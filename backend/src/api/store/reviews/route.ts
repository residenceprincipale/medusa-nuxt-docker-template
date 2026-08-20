import type { MedusaRequest, MedusaResponse } from '@medusajs/framework/http'
import type { ReviewsService } from '../../../modules/reviews/service'

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const productId = req.query.product_id as string

  if (!productId) {
    return res.status(400).json({ message: 'product_id query param is required' })
  }

  const reviewsService = req.scope.resolve<ReviewsService>('reviews')
  const items = await reviewsService.listReviews({ product_id: productId })

  res.json({ items })
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const { customer_id, product_id, rating, title, content } = req.body as {
    customer_id: string
    product_id: string
    rating: number
    title: string
    content: string
  }

  if (!customer_id || !product_id || !rating || !title || !content) {
    return res.status(400).json({ message: 'All fields are required' })
  }

  if (rating < 1 || rating > 5) {
    return res.status(400).json({ message: 'Rating must be between 1 and 5' })
  }

  const reviewsService = req.scope.resolve<ReviewsService>('reviews')
  const item = await reviewsService.createReviews({
    customer_id,
    product_id,
    rating,
    title,
    content,
  })

  res.status(201).json({ item })
}

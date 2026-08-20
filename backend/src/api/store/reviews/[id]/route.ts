import type { MedusaRequest, MedusaResponse } from '@medusajs/framework/http'
import type { ReviewsService } from '../../../modules/reviews/service'

export async function DELETE(req: MedusaRequest, res: MedusaResponse) {
  const id = req.params.id

  const reviewsService = req.scope.resolve<ReviewsService>('reviews')
  await reviewsService.deleteReviews(id)

  res.json({ message: 'Review deleted' })
}

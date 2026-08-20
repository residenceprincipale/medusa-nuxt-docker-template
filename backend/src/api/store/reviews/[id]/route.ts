import type { MedusaRequest, MedusaResponse } from '@medusajs/framework/http'

export async function DELETE(req: MedusaRequest, res: MedusaResponse) {
  const id = req.params.id

  const reviewsService: any = req.scope.resolve('reviews')
  await reviewsService.deleteReviews(id)

  res.json({ message: 'Review deleted' })
}

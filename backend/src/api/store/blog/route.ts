import type { MedusaRequest, MedusaResponse } from '@medusajs/framework/http'
import type { BlogService } from '../../../modules/blog/service'

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const blogService = req.scope.resolve<BlogService>('blog')
  const items = await blogService.listPosts()

  res.json({ items })
}

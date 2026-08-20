import type { MedusaRequest, MedusaResponse } from '@medusajs/framework/http'

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const handle = req.params.handle

  const blogService: any = req.scope.resolve('blog')
  const items = await blogService.listPosts({ handle })

  if (!items?.length) {
    return res.status(404).json({ message: 'Post not found' })
  }

  res.json({ item: items[0] })
}

import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const blogService: any = req.scope.resolve("blog")
  const items = await blogService.listPosts()

  res.json({ items })
}

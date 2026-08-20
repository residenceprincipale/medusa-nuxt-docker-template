import { model } from "@medusajs/framework/utils"

export const Review = model.define("review", {
  id: model.id().primaryKey(),
  customer_id: model.text(),
  product_id: model.text(),
  rating: model.number(),
  title: model.text(),
  content: model.text(),
})

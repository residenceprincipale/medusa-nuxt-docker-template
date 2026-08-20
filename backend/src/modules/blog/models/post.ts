import { model } from '@medusajs/framework/utils'

export const Post = model.define('post', {
  id: model.id().primaryKey(),
  title: model.text(),
  handle: model.text().unique(),
  content: model.text(),
  excerpt: model.text().nullable(),
  author: model.text(),
  published_at: model.dateTime().nullable(),
})

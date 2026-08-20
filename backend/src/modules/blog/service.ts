import { MedusaService, defineJoinerConfig } from '@medusajs/framework/utils'
import { Post } from './models/post'

export class BlogService extends MedusaService({ Post }) {
  __joinerConfig() {
    return defineJoinerConfig('blog', {
      models: [Post],
    })
  }
}

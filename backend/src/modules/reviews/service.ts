import { MedusaService, defineJoinerConfig } from '@medusajs/framework/utils'
import { Review } from './models/review'

export class ReviewsService extends MedusaService({ Review }) {
  __joinerConfig() {
    return defineJoinerConfig('reviews', {
      models: [Review],
    })
  }
}

import { MedusaService, defineJoinerConfig } from '@medusajs/framework/utils'
import { Wishlist } from './models/wishlist'

export class WishlistService extends MedusaService({ Wishlist }) {
  __joinerConfig() {
    return defineJoinerConfig('wishlist', {
      models: [Wishlist],
    })
  }
}

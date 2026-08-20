import { Module } from '@medusajs/framework/utils'
import { WishlistService } from './service'

export default Module('wishlist', {
  service: WishlistService,
})

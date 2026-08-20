import { Module } from "@medusajs/framework/utils"
import { ReviewsService } from "./service"

export default Module("reviews", {
  service: ReviewsService,
})

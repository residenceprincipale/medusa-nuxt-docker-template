import { Module } from "@medusajs/framework/utils"
import { BlogService } from "./service"

export default Module("blog", {
  service: BlogService,
})

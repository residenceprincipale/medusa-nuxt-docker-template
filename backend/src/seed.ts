import { Modules } from '@medusajs/framework/utils'
import { createProductsWorkflow } from '@medusajs/medusa/core-flows'
import { MedusaContainer, Logger } from '@medusajs/framework/types'
import { BlogService } from './modules/blog'

export default async function seedDb({ container }: { container: MedusaContainer }) {
  const logger = container.resolve<Logger>('logger')
  logger.info('Seeding database...')

  const storeModule = container.resolve(Modules.STORE)
  const stores = await storeModule.listStores()
  if (stores.length === 0) {
    await storeModule.createStores({
      name: 'Medusa Store',
      supported_currencies: [{ currency_code: 'usd' }, { currency_code: 'eur' }],
      default_currency_code: 'usd',
    })
    logger.info('Created default store')
  }

  const regionModule = container.resolve(Modules.REGION)
  const regions = await regionModule.listRegions()
  if (regions.length === 0) {
    await regionModule.createRegions({
      name: 'United States',
      countries: ['us'],
      currency_code: 'usd',
      payment_providers: ['pp_system_default'],
      fulfillment_providers: ['fp_manual'],
    })
    await regionModule.createRegions({
      name: 'Europe',
      countries: ['fr', 'de', 'es', 'it', 'nl', 'be'],
      currency_code: 'eur',
      payment_providers: ['pp_system_default'],
      fulfillment_providers: ['fp_manual'],
    })
    logger.info('Created regions')
  }

  const salesChannelModule = container.resolve(Modules.SALES_CHANNEL)
  const channels = await salesChannelModule.listSalesChannels()
  if (channels.length === 0) {
    await salesChannelModule.createSalesChannels({ name: 'Default Channel' })
    logger.info('Created default sales channel')
  }

  const productModule = container.resolve(Modules.PRODUCT)
  const categories = await productModule.listProductCategories()
  if (categories.length === 0) {
    const clothing = await productModule.createProductCategories({
      name: 'Clothing',
      handle: 'clothing',
      description: 'Apparel and accessories',
    })
    await productModule.createProductCategories({
      name: 'T-Shirts',
      handle: 't-shirts',
      description: 'Comfortable cotton t-shirts',
      parent_category_id: clothing.id,
    })
    await productModule.createProductCategories({
      name: 'Hoodies',
      handle: 'hoodies',
      description: 'Warm hoodies and sweatshirts',
      parent_category_id: clothing.id,
    })
    const electronics = await productModule.createProductCategories({
      name: 'Electronics',
      handle: 'electronics',
      description: 'Gadgets and accessories',
    })
    await productModule.createProductCategories({
      name: 'Headphones',
      handle: 'headphones',
      description: 'Audio equipment',
      parent_category_id: electronics.id,
    })
    logger.info('Created product categories')
  }

  const defaultChannel = (await salesChannelModule.listSalesChannels())[0]

  const existingProducts = await productModule.listProducts({}, { take: 1000 })
  if (existingProducts.length) {
    await productModule.deleteProducts(existingProducts.map((p) => p.id))
    logger.info(`Cleared ${existingProducts.length} existing product(s)`)
  }

  const sampleProducts = [
    {
      title: 'Classic T-Shirt',
      handle: 'classic-t-shirt',
      description: 'Soft 100% cotton t-shirt, pre-shrunk and comfortable for everyday wear.',
      price: 25,
    },
    {
      title: 'Pullover Hoodie',
      handle: 'pullover-hoodie',
      description: 'Warm fleece-lined hoodie with a front pocket and adjustable drawstring hood.',
      price: 45,
    },
    {
      title: 'Wireless Headphones',
      handle: 'wireless-headphones',
      description: 'Over-ear wireless headphones with noise cancellation and 30h battery life.',
      price: 80,
    },
  ]

  for (const p of sampleProducts) {
    await createProductsWorkflow(container).run({
      input: {
        products: [
          {
            title: p.title,
            handle: p.handle,
            description: p.description,
            status: 'published',
            options: [{ title: 'Size', values: ['One Size'] }],
            variants: [
              {
                title: p.title,
                options: { Size: 'One Size' },
                prices: [{ amount: p.price, currency_code: 'usd' }],
                manage_inventory: false,
              },
            ],
            sales_channels: [{ id: defaultChannel.id }],
          },
        ],
      },
    })
  }
  logger.info(`Created ${sampleProducts.length} sample product(s)`)

  try {
    const blogService = container.resolve<BlogService>('blogService')
    const existing = await blogService.listPosts()
    if (!existing?.length) {
      await blogService.createPosts([
        {
          title: 'Welcome to Our Store',
          handle: 'welcome-to-our-store',
          content: 'We are excited to launch our new e-commerce store powered by MedusaJS.',
          excerpt: 'Discover our new online store.',
          author: 'Admin',
          published_at: new Date(),
        },
        {
          title: 'Behind the Scenes: Our Shipping Process',
          handle: 'shipping-process',
          content: 'Learn how we ensure your orders are packed with care and shipped quickly.',
          excerpt: 'How we ship your orders.',
          author: 'Admin',
          published_at: new Date(),
        },
      ])
      logger.info('Created blog posts')
    }
  } catch {
    // Blog module not available
  }

  logger.info('Seed complete!')
}

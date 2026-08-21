import type Medusa from '@medusajs/js-sdk'

type Store = Medusa['store']

export type Product = Awaited<ReturnType<Store['product']['list']>>['products'][number]
export type ProductVariant = NonNullable<Product['variants']>[number]
export type Category = Awaited<ReturnType<Store['category']['list']>>['product_categories'][number]
export type Cart = Awaited<ReturnType<Store['cart']['retrieve']>>['cart']
export type CartLineItem = NonNullable<Cart['items']>[number]
export type Customer = Awaited<ReturnType<Store['customer']['retrieve']>>['customer']
export type Address = NonNullable<Customer['addresses']>[number]
export type Order = Awaited<ReturnType<Store['order']['list']>>['orders'][number]
export type ShippingOption = Awaited<ReturnType<Store['fulfillment']['listCartOptions']>>['shipping_options'][number]
export type PaymentSession = NonNullable<
  Awaited<ReturnType<Store['payment']['initiatePaymentSession']>>['payment_collection']
>['payment_sessions'][number]

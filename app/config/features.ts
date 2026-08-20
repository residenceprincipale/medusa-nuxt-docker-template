export const features = {
  auth: true,
  search: true,
  categories: true,
  promotions: true,
  newsletter: true,
  i18n: false,
  stripe: false,
  wishlist: false,
  reviews: false,
  blog: false,
  about: true,
  contact: true,
  orderTracking: true,
} as const

export type FeatureFlags = typeof features
export type FeatureKey = keyof FeatureFlags

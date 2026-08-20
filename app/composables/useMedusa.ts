import Medusa from '@medusajs/js-sdk'

let sdk: Medusa | null = null

export function useMedusa() {
  if (sdk) return sdk

  const config = useRuntimeConfig()
  sdk = new Medusa({
    baseUrl: (import.meta.server ? config.medusaBackend : config.public.medusaBackend) as string,
    publishableKey: config.public.medusaPublishableKey as string,
  })

  return sdk
}

let regionId: string | null = null
let regionIdPromise: Promise<string | null> | null = null

export async function useStoreRegionId() {
  if (regionId) return regionId

  if (!regionIdPromise) {
    regionIdPromise = (async () => {
      const client = useMedusa()
      const { regions } = await client.store.region.list({ limit: 1 })
      regionId = regions?.[0]?.id ?? null
      return regionId
    })().finally(() => {
      regionIdPromise = null
    })
  }

  return regionIdPromise
}

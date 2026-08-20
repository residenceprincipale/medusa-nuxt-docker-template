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

let regionIdPromise: Promise<string | null> | null = null

export async function useStoreRegionId() {
  const cached = import.meta.client ? localStorage.getItem('region_id') : null
  if (cached) return cached

  if (!regionIdPromise) {
    regionIdPromise = (async () => {
      const client = useMedusa()
      const { regions } = await client.store.region.list({ limit: 1 })
      const regionId = regions?.[0]?.id ?? null
      if (regionId && import.meta.client) localStorage.setItem('region_id', regionId)
      return regionId
    })().finally(() => {
      regionIdPromise = null
    })
  }

  return regionIdPromise
}

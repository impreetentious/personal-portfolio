import type { MetadataRoute } from 'next'
import { siteConfig } from '@/lib/config'

export default function sitemap(): MetadataRoute.Sitemap {
  if (!siteConfig.isIndexable) return []

  return [
    {
      url: `${siteConfig.url}/`,
      changeFrequency: 'monthly',
      priority: 1,
    },
  ]
}

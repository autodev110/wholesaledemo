import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = "https://www.simplehomeoffer.org";

  return [
    {
      url: `${siteUrl}/`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1.0, // Highest priority for your homepage
    },
    {
      url: `${siteUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.8,
    },
    {
      url: `${siteUrl}/form`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.5, // Lower priority as it's not a primary content page
    },
  ];
}
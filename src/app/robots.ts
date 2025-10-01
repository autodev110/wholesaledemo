// src/app/robots.ts
import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  // IMPORTANT: Make sure this URL matches your deployed domain.
  // We're using .org based on our earlier discussion.
  const siteUrl = "https://www.simplehomeoffer.org"; 

  return {
    rules: {
      userAgent: '*', // Apply these rules to all web crawlers
      allow: '/',     // Allow crawling of all pages on the site
      // If you had specific pages you wanted to block, you would add them here, e.g.:
      // disallow: ['/admin/', '/private-docs/'],
    },
    sitemap: `${siteUrl}/sitemap.xml`, // Point to your sitemap.xml file
  }
}
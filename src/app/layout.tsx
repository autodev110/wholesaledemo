import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Footer from '@/app/components/Footer';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Define core site URL for canonical links and Open Graph meta tags
const siteUrl = "https://www.simplehomeoffer.org"; // **IMPORTANT: Replace with your actual domain**

export const metadata: Metadata = {
  // Primary SEO Tags
  title: "Simple Home Offer | Sell Your House Fast, Stress-Free, All Cash",
  description: "Get a fair, all-cash offer for your house without any hassles, commissions, or repairs. Sell your house on your timeline. Stress-Free, guaranteed.",
  keywords: ["sell house fast", "cash offer home", "sell house as is", "quick home sale", "real estate cash buyer", "no commission home sale", "sell my house", "home buying company", "we buy houses", "fast property sale", "sell house without realtor", "cash for homes", "quick house offer", "sell home online", "real estate solutions", "home selling service", "simple home offer", "simplehomeoffer"],
  
  // Canonical URL (Helps search engines understand the preferred URL)
  metadataBase: new URL(siteUrl),
  alternates: {
    canonical: '/',
  },

  // Open Graph (Used for Facebook, LinkedIn, etc., when shared)
  openGraph: {
    title: "Simple Home Offer | Sell Your House Fast, Stress-Free",
    description: "Get a fair, all-cash offer for your house without any hassles, commissions, or repairs. Sell on your timeline.",
    url: siteUrl,
    siteName: 'Simple Home Offer',
    images: [
      {
        url: `${siteUrl}/images/og-image.jpg`, // **Replace with your social media image path**
        width: 1200,
        height: 630,
        alt: 'Simple Home Offer Logo and Tagline',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },

  // Twitter Card (Used for X/Twitter when shared)
  twitter: {
    card: 'summary_large_image', // Use 'summary_large_image' for better engagement
    title: 'Sell Your House Fast for Cash | Simple Home Offer',
    description: 'Avoid the stress of listing. We buy houses AS-IS, quickly, and with cash.',
    creator: '@yourtwitterhandle', // **Replace with your actual X/Twitter handle**
    images: [`${siteUrl}/images/twitter-image.jpg`], // **Replace with your Twitter image path**
  },

  // Favicons and Icons (Kept your existing setup)
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen`}
      >
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}

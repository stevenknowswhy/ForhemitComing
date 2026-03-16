import type { Metadata, Viewport } from 'next'
import { Cormorant_Garamond, DM_Mono, Outfit, Inter } from 'next/font/google'
import './globals.css'
import { Navigation } from './components/layout/Navigation'
import { GlobalFooter } from './components/layout/GlobalFooter'
import { ConvexClientProvider } from './components/providers/ConvexProvider'
import { ThemeProvider } from './components/providers/ThemeProvider'
import { ErrorBoundary } from './components/ErrorBoundary'
import { SentryProvider } from './components/providers/SentryProvider'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-cormorant',
  display: 'swap',
})

const dmMono = DM_Mono({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-dm-mono',
  display: 'swap',
})

const outfit = Outfit({
  subsets: ['latin'],
  weight: ['200', '300', '400', '500'],
  variable: '--font-outfit',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const baseUrl = 'https://forhemit.com';

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: 'Forhemit Capital | Stewardship Management',
    template: '%s | Forhemit Capital',
  },
  description: 'Stewardship Management Organization Built for Continuity, Not Extraction. We acquire and operate small to mid-sized businesses with a long-term, employee-centered approach.',
  keywords: ['private equity', 'business acquisition', 'ESOP', 'company stewardship', 'business continuity', 'employee ownership'],
  authors: [{ name: 'Forhemit Capital' }],
  creator: 'Forhemit Capital',
  publisher: 'Forhemit Capital',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: baseUrl,
    siteName: 'Forhemit Capital',
    title: 'Forhemit Capital | Stewardship Management',
    description: 'Stewardship Management Organization Built for Continuity, Not Extraction.',
    images: [
      {
        url: `${baseUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: 'Forhemit Capital - Stewardship Management',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Forhemit Capital | Stewardship Management',
    description: 'Stewardship Management Organization Built for Continuity, Not Extraction.',
    images: [`${baseUrl}/og-image.png`],
    creator: '@forhemit',
  },
  alternates: {
    canonical: baseUrl,
    languages: {
      en: baseUrl,
    },
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${cormorant.variable} ${dmMono.variable} ${outfit.variable} ${inter.variable}`} suppressHydrationWarning data-scroll-behavior="smooth">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme');
                  if (theme === 'light') {
                    document.documentElement.setAttribute('data-theme', 'light');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body suppressHydrationWarning>
        <ThemeProvider>
          <ErrorBoundary>
            <SentryProvider>
              <ConvexClientProvider>
                <Navigation />
                {children}
                <GlobalFooter />
              </ConvexClientProvider>
            </SentryProvider>
          </ErrorBoundary>
        </ThemeProvider>
      </body>
    </html>
  )
}

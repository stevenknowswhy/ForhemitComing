import type { Metadata, Viewport } from 'next'
import { Cormorant_Garamond, DM_Mono, Outfit, Inter } from 'next/font/google'
import './globals.css'
import { Navigation } from './components/layout/Navigation'
import { GlobalHeader } from './components/layout/GlobalHeader'
import { GlobalFooter } from './components/layout/GlobalFooter'
import { ConvexClientProvider } from './components/providers/ConvexProvider'
import { ThemeProvider } from './components/providers/ThemeProvider'
import { ErrorBoundary } from './components/ErrorBoundary'
import { SentryProvider } from './components/providers/SentryProvider'
import { env } from '@/lib/env'

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

const baseUrl = env.NEXT_PUBLIC_SITE_URL ?? 'https://www.forhemit.com';

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: 'Forhemit | California Public Benefit Corporation',
    template: '%s | Forhemit',
  },
  description:
    'Forhemit helps founder-led businesses pursue 100% employee-ownership succession with ESOP structuring and post-close stewardship support.',
  keywords: [
    'ESOP',
    'employee ownership',
    'California public benefit corporation',
    'business transition',
    'company stewardship',
    'business continuity',
    'Section 1042',
  ],
  authors: [{ name: 'Forhemit PBC' }],
  creator: 'Forhemit PBC',
  publisher: 'Forhemit PBC',
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
    siteName: 'Forhemit PBC',
    title: 'Forhemit | Founder Exit and ESOP Succession',
    description: 'Founder succession through employee ownership, with ESOP structuring and post-close stewardship support.',
    images: [
      {
        url: `${baseUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: 'Forhemit - Founder Exit and ESOP Succession',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Forhemit | Founder Exit and ESOP Succession',
    description: 'Founder succession through employee ownership, with ESOP structuring and post-close stewardship support.',
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
  themeColor: '#ffffff', // Light theme browser chrome
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" data-theme="light" className={`${cormorant.variable} ${dmMono.variable} ${outfit.variable} ${inter.variable}`} suppressHydrationWarning data-scroll-behavior="smooth" style={{ colorScheme: "light" }}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  localStorage.setItem('forhemit-theme', 'light');
                  document.documentElement.setAttribute('data-theme', 'light');
                  document.documentElement.style.colorScheme = 'light';
                  
                  // Handle blog theme (if on blog page)
                  if (window.location.pathname.startsWith('/blog')) {
                    localStorage.setItem('forhemit-blog-theme', 'light');
                    document.documentElement.classList.add('blog-light');
                    document.documentElement.classList.remove('blog-dark');
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
              <ConvexClientProvider convexUrl={env.NEXT_PUBLIC_CONVEX_URL}>
                <GlobalHeader />
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

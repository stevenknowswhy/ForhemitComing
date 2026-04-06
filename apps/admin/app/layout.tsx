import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ClerkProvider } from '@clerk/nextjs'
import { ConvexClientProvider } from './components/providers/ConvexProvider'
import { ErrorBoundary } from './components/ErrorBoundary'
import { env } from '@/lib/env'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const baseUrl = env.NEXT_PUBLIC_SITE_URL ?? 'https://forhemit.website';

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: 'Forhemit Admin | CRM & Template Management',
    template: '%s | Forhemit Admin',
  },
  description: 'Internal CRM and document template management system for Forhemit PBC.',
  robots: {
    index: false,
    follow: false,
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#1a1a1a',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider
      afterSignOutUrl="/sign-in"
      appearance={{
        layout: {
          socialButtonsPlacement: 'bottom',
          socialButtonsVariant: 'iconButton',
          shimmer: false,
        },
        variables: {
          colorPrimary: '#0A0A0A',
          colorText: '#1a1a1a',
          colorBackground: '#ffffff',
          colorInputBackground: '#fafafa',
          colorInputBorder: '#e5e5e5',
          borderRadius: '0.5rem',
        },
      }}
    >
      <html lang="en" className={`${inter.variable}`} suppressHydrationWarning>
        <body suppressHydrationWarning className="min-h-screen bg-gray-50">
          <ErrorBoundary>
            <ConvexClientProvider convexUrl={env.NEXT_PUBLIC_CONVEX_URL}>
              {children}
            </ConvexClientProvider>
          </ErrorBoundary>
        </body>
      </html>
    </ClerkProvider>
  )
}

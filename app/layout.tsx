import type { Metadata, Viewport } from 'next'
import { Toaster } from 'react-hot-toast'
import './globals.css'

// ============================================================
// LinkedBoost AI — Root Layout
// ============================================================

export const metadata: Metadata = {
  title: 'LinkedBoost AI — Transformez vos idées en posts LinkedIn viraux',
  description:
    'Générez des posts LinkedIn optimisés avec l\'IA. Choisissez votre style, obtenez 3 versions en 10 secondes. Score de qualité, hashtags, suggestions inclus.',
  keywords: [
    'LinkedIn', 'posts LinkedIn', 'personal branding', 'IA', 'intelligence artificielle',
    'générateur de posts', 'LinkedBoost', 'personal branding LinkedIn',
  ],
  authors: [{ name: 'LinkedBoost AI' }],
  openGraph: {
    title: 'LinkedBoost AI',
    description: 'Transformez vos idées en posts LinkedIn viraux avec l\'IA',
    type: 'website',
    locale: 'fr_FR',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LinkedBoost AI',
    description: 'Transformez vos idées en posts LinkedIn viraux avec l\'IA',
  },
}

export const viewport: Viewport = {
  themeColor: '#09090b',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" className="dark">
      <head>
        {/* Preconnect for Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-screen bg-zinc-950 text-zinc-50 antialiased">
        {/* Main app content */}
        {children}

        {/* Toast notifications */}
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: '#18181b',
              color: '#f4f4f5',
              border: '1px solid #27272a',
              borderRadius: '12px',
              fontSize: '14px',
            },
            success: {
              iconTheme: { primary: '#6366f1', secondary: '#f4f4f5' },
            },
            error: {
              iconTheme: { primary: '#ef4444', secondary: '#f4f4f5' },
            },
          }}
        />
      </body>
    </html>
  )
}

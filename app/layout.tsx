import type { Metadata } from 'next'
import { Cormorant_Garamond, DM_Sans } from 'next/font/google'
import './globals.css'
import { AnnounceBar } from '@/components/layout/AnnounceBar'
import { Nav } from '@/components/layout/Nav'
import { Footer } from '@/components/layout/Footer'
import { ChatbotFab } from '@/components/ui/ChatbotFab'
import { CartProvider } from '@/context/CartContext'
import { ToastProvider } from '@/context/ToastContext'
import { GlobalReveal } from '@/components/ui/GlobalReveal'
import { AuthProvider } from '@/context/AuthContext'
import { CustomCursor } from '@/components/ui/CustomCursor'

const display = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  style: ['normal', 'italic'],
  variable: '--font-display',
  display: 'swap',
})

const body = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400'],
  variable: '--font-body',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'OLGA — Mode Féminine Marocaine depuis 1999',
    template: '%s — OLGA DSN',
  },
  description: 'Des pièces légères, élégantes et confortables, pensées pour sublimer chaque instant de votre quotidien.',
  openGraph: {
    siteName: 'OLGA DSN',
    locale: 'fr_MA',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${display.variable} ${body.variable}`}>
      <body>
        <CustomCursor cursorColor="#3D2E24" followerColor="#C4A882" hoverColor="#C4563A" />
        <ToastProvider>
          <AuthProvider>
            <CartProvider>
              <GlobalReveal />
              <AnnounceBar />
              <Nav />
              <main>{children}</main>
              <Footer />
              <ChatbotFab />
            </CartProvider>
          </AuthProvider>
        </ToastProvider>
      </body>
    </html>
  )
}

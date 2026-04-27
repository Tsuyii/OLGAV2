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
<<<<<<< HEAD
import { AuthProvider } from '@/context/AuthContext'
=======
>>>>>>> 5674addbae311b99c3360c6090232deb0fecd1fd

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
        <ToastProvider>
<<<<<<< HEAD
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
=======
          <CartProvider>
            <GlobalReveal />
            <AnnounceBar />
            <Nav />
            <main>{children}</main>
            <Footer />
            <ChatbotFab />
          </CartProvider>
>>>>>>> 5674addbae311b99c3360c6090232deb0fecd1fd
        </ToastProvider>
      </body>
    </html>
  )
}

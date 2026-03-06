import type { Metadata } from 'next'
import { DM_Serif_Display, Lato } from 'next/font/google'
import './globals.css'
import { opticianConfig } from '@/config/optician'
import { detectSeason } from '@/lib/season'
import SeasonalBanner from '@/components/SeasonalBanner'
import WhatsAppFloat from '@/components/WhatsAppFloat'

const dmSerif = DM_Serif_Display({
  weight: ['400'],
  subsets: ['latin'],
  variable: '--font-display',
})

const lato = Lato({
  weight: ['300', '400', '700', '900'],
  subsets: ['latin'],
  variable: '--font-sans',
})

export const metadata: Metadata = {
  title: opticianConfig.name,
  description: opticianConfig.tagline,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const season = opticianConfig.season !== 'default' ? opticianConfig.season : detectSeason()
  return (
    <html lang="en" data-season={season}>
      <body className={`${dmSerif.variable} ${lato.variable} font-sans`}>
        <SeasonalBanner />
        {children}
        <WhatsAppFloat />
      </body>
    </html>
  )
}

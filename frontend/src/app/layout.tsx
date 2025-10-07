import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'TraderInsightsLab - Evaluare Psihologică pentru Traderi',
  description: 'Descoperă-ți profilul psihologic de trader prin analiza AI. Raport personalizat cu recomandări pentru îmbunătățirea performanței în trading.',
  keywords: 'trading, psihologie, evaluare, trader, analiza, raport, AI',
  authors: [{ name: 'TraderInsightsLab' }],
  openGraph: {
    title: 'TraderInsightsLab - Evaluare Psihologică pentru Traderi',
    description: 'Descoperă-ți profilul psihologic de trader prin analiza AI.',
    type: 'website',
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ro">
      <body className={inter.className}>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
          {children}
        </div>
      </body>
    </html>
  )
}
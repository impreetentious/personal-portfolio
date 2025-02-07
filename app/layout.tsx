import type {Metadata} from 'next'
import {Inter, JetBrains_Mono} from 'next/font/google'

import './globals.css'
import {Navigation} from '@/components/Navigation'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Sidakpreet Singh | Portfolio',
  description: 'Interactive personal portfolio for Sidakpreet Singh.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} ${jetbrainsMono.variable} bg-background text-foreground antialiased`}
      >
        <div className="min-h-screen">
          <Navigation />
          <main className="min-h-screen pb-24 md:pb-0">{children}</main>
        </div>
      </body>
    </html>
  )
}

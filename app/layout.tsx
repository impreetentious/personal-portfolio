import type {Metadata} from 'next'
import {Inter, JetBrains_Mono} from 'next/font/google'

import './globals.css'
import {Navigation} from '@/components/Navigation'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Sidakpreet Singh | Portfolio',
  description: "Sidakpreet Singh's interactive portfolio",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
                className={`${inter.className} ${inter.variable} ${jetbrainsMono.variable} bg-background text-foreground antialiased`}
      >
        <div className="min-h-screen">
          <Navigation />
          <main className="min-h-screen pb-3 md:pb-4">{children}</main>
        </div>
      </body>
    </html>
  )
}
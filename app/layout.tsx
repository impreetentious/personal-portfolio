import type { Metadata }         from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'

import './globals.css'
import { LayoutShell } from '@/components/LayoutShell'
import { sanityFetch } from '@/lib/sanity'
import { resumeQuery } from '@/lib/queries'

const inter = Inter({
  subsets : ['latin'],
  display : 'swap',
  variable: '--font-inter',
})

const jetbrainsMono = JetBrains_Mono({
  subsets : ['latin'],
  weight  : ['400', '700'],
  variable: '--font-mono',
  display : 'swap',
})

export const metadata: Metadata = {
  title      : 'Sidakpreet Singh | Portfolio',
  description: "Sidakpreet Singh's interactive portfolio",
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  let resumeUrl: string | undefined
  try {
    const resumeData = await sanityFetch<{ url?: string } | null>(resumeQuery)
    resumeUrl = resumeData?.url
  } catch {
    // Sanity unavailable — palette renders fine without the download action
  }

  return (
    <html lang="en">
      <body
        className={`${inter.className} ${inter.variable} ${jetbrainsMono.variable} bg-background text-foreground antialiased`}
      >
        <div className="min-h-screen">
          <LayoutShell resumeUrl={resumeUrl}>
            {children}
          </LayoutShell>
        </div>
      </body>
    </html>
  )
}
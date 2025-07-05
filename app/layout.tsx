import type { Metadata, Viewport } from 'next'
import { Inter, JetBrains_Mono, Space_Grotesk } from 'next/font/google'

import './globals.css'
import { LayoutShell } from '@/components/LayoutShell'
import { siteConfig } from '@/lib/config'
import { getResumeUrl } from '@/lib/sanity'

export const dynamic = 'force-dynamic'

// Anchors all relative metadata URLs (OG image, canonical) to the real origin.
export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
}

export const viewport: Viewport = {
  themeColor: '#050505',
}

const inter = Inter({
  subsets : ['latin'],
  display : 'swap',
  variable: '--font-inter',
})

const spaceGrotesk = Space_Grotesk({
  subsets : ['latin'],
  weight  : ['500', '600', '700'],
  variable: '--font-display',
  display : 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets : ['latin'],
  weight  : ['400', '700'],
  variable: '--font-mono',
  display : 'swap',
})

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {

  const resumeUrl = await getResumeUrl()

  return (
    <html lang="en">
      <body
        className={`${inter.className} ${inter.variable} ${jetbrainsMono.variable} ${spaceGrotesk.variable} bg-background text-foreground antialiased`}
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

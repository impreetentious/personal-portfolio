import type { Metadata, Viewport } from 'next'
import { Inter, JetBrains_Mono, Space_Grotesk } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'

import './globals.css'
import { LayoutShell } from '@/components/LayoutShell'
import { siteConfig } from '@/lib/config'
import { getResumeUrl } from '@/lib/sanity'

// ISR: statically render and revalidate hourly instead of rendering per request.
export const revalidate = 3600

// Anchors all relative metadata URLs (OG image, canonical) to the real origin.
export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  robots: siteConfig.isIndexable
    ? { index: true, follow: true }
    : { index: false, follow: false },
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
  // 500 & 600 are required because font-medium / font-semibold are applied to
  // `font-mono` copy in ~5 places (SectionLabel, Skills category, Contact tab,
  // WindowsTerminal skills header, Navigation wordmark); loading only 400/700
  // makes the browser synthesise a faux-bold, which looks smudged.
  weight  : ['400', '500', '600', '700'],
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
        {/* No-ops locally; the beacons only fire on Vercel deploys (env-gated
            by the packages themselves). Wired now so the first production
            deploy has a real Core Web Vitals baseline. */}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}

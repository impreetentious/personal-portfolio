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

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  let timerId: ReturnType<typeof setTimeout>

  const timeout = new Promise<never>((_, reject) => {
    timerId = setTimeout(
      () => reject(new Error(`Sanity fetch timed out after ${ms}ms`)),
      ms,
    )
  })

  return Promise.race([promise, timeout]).finally(() => clearTimeout(timerId!))
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  let resumeUrl: string | undefined
  try {
    const resumeData = await withTimeout(
      sanityFetch<{ url?: string } | null>(resumeQuery),
      3_000,
    )
    resumeUrl = resumeData?.url
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    console.error('[RootLayout] Sanity fetch failed or timed out:', message)
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

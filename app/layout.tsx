import { Inter, JetBrains_Mono } from 'next/font/google'

import './globals.css'
import { LayoutShell } from '@/components/LayoutShell'
import { getResumeUrl } from '@/lib/sanity'

export const dynamic = 'force-dynamic'

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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {

  const resumeUrl = await getResumeUrl()

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

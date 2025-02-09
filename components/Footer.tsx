import { DISPLAY_VERSION } from '@/lib/version'

export function Footer() {
  return (
    <footer className="w-full">
      <div className="mx-auto max-w-6xl px-6 sm:px-8 md:px-12 pt-4 pb-6 sm:py-8 flex items-center justify-between">

        {/* Left — copyright */}
        <p className="text-sm text-foreground/40">© 2025 Sidakpreet Singh</p>

        {/* Right — version string */}
        <p className="text-sm font-medium text-foreground/55">{DISPLAY_VERSION}</p>

      </div>
    </footer>
  )
}
import Link from 'next/link'
import {DISPLAY_VERSION} from '@/lib/version'

type BrandIconProps = {
  className?: string
}

function MailIcon({className}: BrandIconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#EA4335"
        d="M20 5H4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2Zm0 4.2-8 5-8-5V7l8 5 8-5v2.2Z"
      />
    </svg>
  )
}

function LinkedInIcon({className}: BrandIconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#0A66C2"
        d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.34V8.99h3.42v1.57h.05c.48-.9 1.64-1.85 3.37-1.85 3.61 0 4.27 2.38 4.27 5.46v6.28ZM5.32 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12Zm1.78 13.02H3.54V8.59H7.1v11.46Z"
      />
    </svg>
  )
}

function WhatsAppIcon({className}: BrandIconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#25D366"
        d="M12.04 2.25a9.63 9.63 0 0 0-8.2 14.68L2.75 21.75l4.94-1.06a9.61 9.61 0 1 0 4.35-18.44Zm0 17.51a7.93 7.93 0 0 1-4.05-1.11l-.29-.17-2.93.63.64-2.86-.19-.3a7.94 7.94 0 1 1 6.82 3.81Zm4.35-5.94c-.24-.12-1.4-.69-1.62-.77-.22-.08-.38-.12-.54.12-.16.24-.62.77-.76.93-.14.16-.28.18-.52.06-.24-.12-1.01-.37-1.93-1.19-.71-.64-1.2-1.42-1.34-1.66-.14-.24-.02-.37.1-.49.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.54-1.3-.74-1.78-.19-.47-.39-.4-.54-.41h-.46c-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2s.86 2.32.98 2.48c.12.16 1.69 2.58 4.1 3.62.57.25 1.02.39 1.37.5.58.18 1.1.16 1.51.1.46-.07 1.4-.57 1.6-1.13.2-.55.2-1.03.14-1.13-.06-.1-.22-.16-.46-.28Z"
      />
    </svg>
  )
}

function GitHubIcon({className}: BrandIconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#F0F6FC"
        d="M12 2.25c-5.38 0-9.75 4.37-9.75 9.75 0 4.31 2.8 7.96 6.68 9.25.49.09.67-.21.67-.47v-1.71c-2.72.59-3.29-1.16-3.29-1.16-.44-1.13-1.08-1.43-1.08-1.43-.89-.61.07-.6.07-.6.98.07 1.5 1.01 1.5 1.01.87 1.49 2.28 1.06 2.84.81.09-.63.34-1.06.62-1.31-2.17-.25-4.45-1.09-4.45-4.83 0-1.07.38-1.94 1.01-2.62-.1-.25-.44-1.24.1-2.59 0 0 .82-.26 2.68 1a9.25 9.25 0 0 1 4.88 0c1.86-1.26 2.68-1 2.68-1 .54 1.35.2 2.34.1 2.59.63.68 1.01 1.55 1.01 2.62 0 3.75-2.29 4.58-4.47 4.82.35.3.66.9.66 1.81v2.68c0 .26.18.57.67.47A9.76 9.76 0 0 0 21.75 12c0-5.38-4.37-9.75-9.75-9.75Z"
      />
    </svg>
  )
}

const socialLinks = [
  {
    label: 'Email',
    href: 'mailto:hello@example.com',
    icon: MailIcon,
  },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com',
    icon: LinkedInIcon,
  },
  {
    label: 'WhatsApp',
    href: 'https://wa.me/10000000000',
    icon: WhatsAppIcon,
  },
  {
    label: 'GitHub',
    href: 'https://github.com/ItsMonarch04',
    icon: GitHubIcon,
  },
]

export function Footer() {
  return (
    <footer className="mt-6 w-full px-6 py-8 sm:px-8 md:px-12">
      <div className="flex flex-col gap-5 md:grid md:grid-cols-3 md:items-center md:gap-0">
        <p className="text-sm text-gray-500">© 2025 Sidakpreet Singh</p>

        <p className="text-sm font-medium text-foreground/80 md:text-center">
          {DISPLAY_VERSION}
        </p>

        <div className="flex items-center gap-3 md:justify-end">
          {socialLinks.map(({label, href, icon: Icon}) => (
            <Link
              key={label}
              href={href}
              aria-label={label}
              className="hover-glow inline-flex h-11 w-11 items-center justify-center border border-white/10 hover:-translate-y-0.5 hover:border-orange-500/45 hover:bg-orange-500/10"
            >
              <Icon className="h-5 w-5" />
            </Link>
          ))}
        </div>
      </div>
    </footer>
  )
}
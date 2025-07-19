"use client";

import { AnimatePresence, motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import type { SocialLink } from "@/lib/queries";
import { Magnetic } from "@/components/ui/Magnetic";

// ─── VS Code Syntax Token Colours ─────────────────────────────────────────────

const TOKEN = {
  identifier : "#9CDCFE",
  string     : "#CE9178",
  fn         : "#dcdcaaff",
  punct      : "#6B7280",
  comment    : "#8f928eff",
  success    : "#4EC9B0",
  dim        : "rgba(255,255,255,0.20)",
} as const;

// ─── Panel Tab ────────────────────────────────────────────────────────────────

function PanelTab({
  label,
  active,
  className = "flex",
}: {
  label     : string
  active?   : boolean
  className?: string
}) {
  return (
    <div
      className={[
        "px-3.5 h-full items-center text-[10.5px] font-mono tracking-widest select-none",
        active
          ? "bg-[#0E0E1C] text-white/70 border-t border-x border-white/[0.08]"
          : "text-white/[0.18] border-t border-x border-transparent",
        className,
      ].join(" ")}
    >
      {label}
    </div>
  );
}

// ─── Console Line ─────────────────────────────────────────────────────────────

interface ConsoleLineProps {
  children   : ReactNode;
  lineNumber?: number;
  timestamp? : string;
  delay?     : number;
  isVisible  : boolean;
}

function ConsoleLine({
  children,
  lineNumber,
  timestamp,
  delay = 0,
  isVisible,
}: ConsoleLineProps) {
  return (
    <motion.div
      className="flex items-start gap-3 min-h-[20px]"
      initial={{ opacity: 0, x: -12 }}
      animate={isVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: -12 }}
      transition={{ type: "tween", ease: "easeOut", duration: 0.38, delay }}
    >
      {lineNumber !== undefined && (
        <span
          className="select-none w-5 text-right shrink-0 text-[11px] font-mono leading-5"
          style={{ color: "rgba(255,255,255,0.10)" }}
        >
          {lineNumber}
        </span>
      )}
      {timestamp && (
        <span
          className="select-none text-[10.5px] font-mono shrink-0 leading-5 tabular-nums"
          style={{ color: TOKEN.dim }}
        >
          {timestamp}
        </span>
      )}
      <div className="font-mono text-[12.5px] leading-5 flex-1">{children}</div>
    </motion.div>
  );
}

// ─── Brand Icons ──────────────────────────────────────────────────────────────

type BrandIconProps = { className?: string }

function PhoneIcon({ className }: BrandIconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#f3c317ff"
        d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"
      />
    </svg>
  )
}

function MailIcon({ className }: BrandIconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#EA4335"
        d="M20 5H4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2Zm0 4.2-8 5-8-5V7l8 5 8-5v2.2Z"
      />
    </svg>
  )
}

function LinkedInIcon({ className }: BrandIconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#0A66C2"
        d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.34V8.99h3.42v1.57h.05c.48-.9 1.64-1.85 3.37-1.85 3.61 0 4.27 2.38 4.27 5.46v6.28ZM5.32 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12Zm1.78 13.02H3.54V8.59H7.1v11.46Z"
      />
    </svg>
  )
}

function WhatsAppIcon({ className }: BrandIconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#25D366"
        d="M12.04 2.25a9.63 9.63 0 0 0-8.2 14.68L2.75 21.75l4.94-1.06a9.61 9.61 0 1 0 4.35-18.44Zm0 17.51a7.93 7.93 0 0 1-4.05-1.11l-.29-.17-2.93.63.64-2.86-.19-.3a7.94 7.94 0 1 1 6.82 3.81Zm4.35-5.94c-.24-.12-1.4-.69-1.62-.77-.22-.08-.38-.12-.54.12-.16.24-.62.77-.76.93-.14.16-.28.18-.52.06-.24-.12-1.01-.37-1.93-1.19-.71-.64-1.2-1.42-1.34-1.66-.14-.24-.02-.37.1-.49.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.54-1.3-.74-1.78-.19-.47-.39-.4-.54-.41h-.46c-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2s.86 2.32.98 2.48c.12.16 1.69 2.58 4.1 3.62.57.25 1.02.39 1.37.5.58.18 1.1.16 1.51.1.46-.07 1.4-.57 1.6-1.13.2-.55.2-1.03.14-1.13-.06-.1-.22-.16-.46-.28Z"
      />
    </svg>
  )
}

function GitHubIcon({ className }: BrandIconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#ffffffff"
        d="M12 2.25c-5.38 0-9.75 4.37-9.75 9.75 0 4.31 2.8 7.96 6.68 9.25.49.09.67-.21.67-.47v-1.71c-2.72.59-3.29-1.16-3.29-1.16-.44-1.13-1.08-1.43-1.08-1.43-.89-.61.07-.6.07-.6.98.07 1.5 1.01 1.5 1.01.87 1.49 2.28 1.06 2.84.81.09-.63.34-1.06.62-1.31-2.17-.25-4.45-1.09-4.45-4.83 0-1.07.38-1.94 1.01-2.62-.1-.25-.44-1.24.1-2.59 0 0 .82-.26 2.68 1a9.25 9.25 0 0 1 4.88 0c1.86-1.26 2.68-1 2.68-1 .54 1.35.2 2.34.1 2.59.63.68 1.01 1.55 1.01 2.62 0 3.75-2.29 4.58-4.47 4.82.35.3.66.9.66 1.81v2.68c0 .26.18.57.67.47A9.76 9.76 0 0 0 21.75 12c0-5.38-4.37-9.75-9.75-9.75Z"
      />
    </svg>
  )
}

function TwitterIcon({ className }: BrandIconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#ffffffff"
        d="M18.9 2.25h2.86l-6.25 7.15 7.35 9.72h-5.76l-4.51-5.9-5.16 5.9H4.57l6.68-7.64-7.05-9.23h5.9l4.07 5.39 4.73-5.39Z"
      />
    </svg>
  )
}

// ─── Social Links Data ────────────────────────────────────────────────────────

const FALLBACK_SOCIAL_LINKS: SocialLink[] = [
  { platform: 'phone', url: 'tel:+919034431886', order: 0, label: 'Phone', copyValue: '+91 90344 31886' },
  { platform: 'email', url: 'mailto:work@sidakpreetsingh.com', order: 1, label: 'Email', copyValue: 'work@sidakpreetsingh.com' },
  { platform: 'linkedin', url: 'https://linkedin.com/in/sidakpreetsinghk', order: 2, label: 'LinkedIn' },
  { platform: 'whatsapp', url: 'https://wa.me/+919034431886', order: 3, label: 'WhatsApp' },
  { platform: 'github', url: 'https://github.com/ItsMonarch04', order: 4, label: 'GitHub' },
]

const PLATFORM_ICONS = {
  phone: PhoneIcon,
  email: MailIcon,
  linkedin: LinkedInIcon,
  whatsapp: WhatsAppIcon,
  github: GitHubIcon,
  twitter: TwitterIcon,
} as const

type ContactProps = {
  socialLinks?: SocialLink[]
}

// ─── Contact Section ──────────────────────────────────────────────────────────

export function Contact({ socialLinks }: ContactProps) {
  const sectionRef          = useRef<HTMLElement>(null)
  const isInView            = useInView(sectionRef, { once: true, amount: 0.15 })
  const [copied, setCopied] = useState<string | null>(null)

  const copyTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current)
    }
  }, [])

  const resolvedSocialLinks = (socialLinks?.length ? socialLinks : FALLBACK_SOCIAL_LINKS)
    .filter((link) => Boolean(link?.url))
    .map((link, index) => ({ ...link, _fallbackIndex: index }))
    .sort((a, b) => {
      const aOrder = a.order ?? Number.MAX_SAFE_INTEGER
      const bOrder = b.order ?? Number.MAX_SAFE_INTEGER
      return aOrder === bOrder ? a._fallbackIndex - b._fallbackIndex : aOrder - bOrder
    })

  const socialLinkCount = resolvedSocialLinks.length

  return (
    <section
      ref={sectionRef}
      id="contact"
      aria-label="Contact"
      className="relative mx-auto w-full max-w-6xl px-4 md:pl-28 lg:pl-32 xl:px-8 pt-14 pb-6 sm:pt-20 sm:pb-10"
    >
      {/* ── Panel Title Bar ── */}
      <div className="flex items-center justify-between px-4 sm:px-6 border-b border-white/[0.06] h-[44px] shrink-0">
        <div className="flex h-full items-end gap-0">
          <PanelTab label="OUTPUT"        active />
          <PanelTab label="TERMINAL"      className="hidden sm:flex" />
          <PanelTab label="PROBLEMS"      className="hidden sm:flex" />
          <PanelTab label="DEBUG CONSOLE" className="hidden sm:flex" />
        </div>
        <div className="ml-auto flex flex-col items-end justify-center pb-1">
          <code className="block font-mono font-medium text-[10px] sm:text-[12px] tracking-wide text-metaphor/70 select-none mb-3 sm:mb-4">
            npm run connect
          </code>
          <p className="font-display font-semibold text-[21px] sm:text-2xl tracking-tight text-white/[0.92] mb-6 sm:mb-11">
            Contact
          </p>
        </div>
      </div>

      {/* ── Channel Bar ── */}
      <div
        className="flex items-center gap-2.5 px-5 sm:px-6 py-[7px] border-b border-white/[0.04] shrink-0"
        style={{ backgroundColor: "#050505" }}
      >
        <span className="text-[10px] font-mono" style={{ color: TOKEN.dim }}>Channel:</span>
        <span className="text-[10px] font-mono text-white/35">Contact API v1.0</span>
        <div className="ml-auto hidden sm:flex items-center gap-3">
          <span className="text-[10px] font-mono text-white/[0.13]">UTF-8</span>
          <span className="text-white/[0.09] text-[10px]">·</span>
          <span className="text-[10px] font-mono text-white/[0.13]">TypeScript</span>
        </div>
      </div>

      {/* ── Console Output Body ── */}
      <div className="flex-1 px-3 sm:px-8 py-7 sm:py-8 space-y-3.5">

        <ConsoleLine lineNumber={1} timestamp="04:07:01" delay={0.1} isVisible={isInView}>
          <span className="text-[11px] sm:text-[11.5px]" style={{ color: TOKEN.comment }}>
            {`// Initializing contact module....`}
          </span>
        </ConsoleLine>

        <ConsoleLine lineNumber={2} timestamp="04:07:02" delay={0.2} isVisible={isInView}>
          <span className="text-[11px] sm:text-[11.5px]" style={{ color: TOKEN.comment }}>
            {`// Loading endpoint configuration....`}
          </span>
        </ConsoleLine>

        <ConsoleLine lineNumber={3} timestamp="04:07:03" delay={0.3} isVisible={isInView}>
          <span className="text-[11px] sm:text-[11.5px]" style={{ color: TOKEN.comment }}>
            {`// All systems nominal. Ready to receive....`}
          </span>
        </ConsoleLine>

        <div className="h-5" aria-hidden="true" />

        <ConsoleLine lineNumber={5} delay={0.4} isVisible={isInView}>
          <span style={{ color: TOKEN.dim }}>{">"}&nbsp;</span>
          <span style={{ color: TOKEN.identifier }}>contact</span>
          <span style={{ color: TOKEN.punct }}>.</span>
          <span style={{ color: TOKEN.fn }}>getSocialLinks</span>
          <span style={{ color: TOKEN.punct }}>{"()"}</span>
        </ConsoleLine>

        {/* ── Social icon buttons ── */}
        <ConsoleLine delay={0.5} isVisible={isInView}>
          <div className="flex w-full gap-3 py-2 sm:w-auto sm:justify-start sm:gap-5">
            {resolvedSocialLinks.map(({ platform, label, url, copyValue }) => {
              const Icon = PLATFORM_ICONS[platform]
              const resolvedLabel = label ?? platform

              return (
              <div key={`${platform}-${url}`} className="relative flex flex-1 justify-center sm:flex-none">
                <Magnetic>
                <a
                  href={url}
                  aria-label={copyValue ? `${resolvedLabel} — click to copy` : resolvedLabel}
                  target={!copyValue && url.startsWith('http') ? '_blank' : undefined}
                  rel={!copyValue && url.startsWith('http') ? 'noopener noreferrer' : undefined}
                  onClick={
                    copyValue
                      ? async (e) => {
                          e.preventDefault()
                          try {
                            await navigator.clipboard.writeText(copyValue)
                            if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current)
                            // Key on the guaranteed-unique url, not the display
                            // label — two links can share a label/platform.
                            setCopied(url)
                            copyTimeoutRef.current = setTimeout(() => {
                              setCopied(null)
                              copyTimeoutRef.current = null
                            }, 2500)
                          } catch {
                            window.location.href = url
                          }
                        }
                      : undefined
                  }
                  className={`hover-glow inline-flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center border border-white/10 transition-all duration-150 hover:-translate-y-0.5 hover:border-orange-500/45 hover:bg-orange-500/10 active:translate-y-0 active:scale-95 active:border-orange-500/60${copyValue ? ' cursor-copy' : ''}`}
                >
                  <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
                </a>
                </Magnetic>

                <AnimatePresence>
                  {copied === url && (
                    <div className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2">
                      <motion.span
                        key="tip"
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 4 }}
                        transition={{ type: 'tween', ease: 'easeOut', duration: 0.18 }}
                        className="whitespace-nowrap rounded bg-accent/90 px-2 py-0.5 font-mono text-[9px] font-bold text-background"
                      >
                      ✓ Copied
                      </motion.span>
                    </div>
                  )}
                </AnimatePresence>
              </div>
            )})}
          </div>
        </ConsoleLine>

        <div className="h-5" aria-hidden="true" />

        <ConsoleLine lineNumber={8} timestamp="04:07:04" delay={0.6} isVisible={isInView}>
          <span style={{ color: TOKEN.success }}>[SUCCESS]&nbsp;</span>
          <span style={{ color: "rgba(255,255,255,0.35)" }}>
            - {socialLinkCount} endpoint{socialLinkCount === 1 ? '' : 's'} securely loaded.
          </span>
        </ConsoleLine>

        <ConsoleLine lineNumber={9} delay={0.80} isVisible={isInView}>
          <span style={{ color: TOKEN.dim }}>{">"}&nbsp;</span>
          <span
            className="animate-cursor-blink inline-block w-[7px] h-[13px] translate-y-[2px] bg-accent/75"
            aria-hidden="true"
          />
        </ConsoleLine>

        {/* ── Copy feedback line ── */}
        <AnimatePresence>
          {copied !== null && (
            <motion.div
              key="copy-feedback"
              role="status"
              aria-live="polite"
              className="flex items-start gap-3 min-h-[20px]"
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              transition={{ type: 'tween', ease: 'easeOut', duration: 0.25 }}
            >
              <span
                className="select-none w-5 text-right shrink-0 text-[11px] font-mono leading-5"
                style={{ color: 'rgba(255,255,255,0.10)' }}
              >
                10
              </span>
              <div className="font-mono text-[12.5px] leading-5 flex-1">
                <span style={{ color: TOKEN.success }}>[COPIED]&nbsp;</span>
                <span style={{ color: 'rgba(255,255,255,0.35)' }}>
                  {'— '}
                  {resolvedSocialLinks.find((link) => link.url === copied)?.copyValue ?? ''}
                  {' → clipboard'}
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── VS Code Status Bar ── */}
      <div
        className="h-[22px] border-t border-white/[0.04] px-4 flex items-center gap-3 shrink-0"
        style={{ backgroundColor: "#060608" }}
      >
        <span
          className="text-[10px] font-mono flex items-center gap-1.5"
          style={{ color: TOKEN.success }}
        >
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-current" aria-hidden="true" />
          READY
        </span>
        <span className="text-white/[0.07] text-[10px]" aria-hidden="true">|</span>
        <span className="text-[10px] font-mono text-white/[0.22]">contact.ts</span>
        <span className="ml-auto hidden sm:block text-[10px] font-mono text-white/[0.18]">
          TypeScript JSX
        </span>
      </div>
    </section>
  )
}

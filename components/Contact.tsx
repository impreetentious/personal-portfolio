'use client'

import { AnimatePresence, motion, useInView } from 'framer-motion'
import { Github, Linkedin, Mail, MessageCircle, Phone, Twitter } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import type { SocialLink } from '@/lib/queries'
import { FALLBACK_SOCIAL_LINKS } from '@/lib/identity'
import { Magnetic } from '@/components/ui/Magnetic'

// ─── VS Code Syntax Token Colours ─────────────────────────────────────────────

const TOKEN = {
  identifier: '#9CDCFE',
  string: '#CE9178',
  fn: '#dcdcaaff',
  punct: '#6B7280',
  comment: '#8f928eff',
  success: '#4EC9B0',
  dim: 'rgba(255,255,255,0.70)',
} as const

// ─── Panel Tab ────────────────────────────────────────────────────────────────

function PanelTab({
  label,
  active,
  className = 'flex',
}: {
  label: string
  active?: boolean
  className?: string
}) {
  return (
    <div
      className={[
        'px-3.5 h-full items-center text-[10.5px] font-mono tracking-widest select-none',
        active
          ? 'bg-[#0E0E1C] text-white/70 border-t border-x border-white/[0.08]'
          : 'text-white/70 border-t border-x border-transparent',
        className,
      ].join(' ')}
    >
      {label}
    </div>
  )
}

// ─── Console Line ─────────────────────────────────────────────────────────────

interface ConsoleLineProps {
  children: ReactNode
  lineNumber?: number
  timestamp?: string
  delay?: number
  isVisible: boolean
}

function ConsoleLine({ children, lineNumber, timestamp, delay = 0, isVisible }: ConsoleLineProps) {
  return (
    <motion.div
      className="flex items-start gap-3 min-h-[20px]"
      initial={{ opacity: 0, x: -12 }}
      animate={isVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: -12 }}
      transition={{ type: 'tween', ease: 'easeOut', duration: 0.38, delay }}
    >
      {lineNumber !== undefined && (
        <span
          aria-hidden="true"
          className="select-none w-5 text-right shrink-0 text-[11px] font-mono leading-5"
          style={{ color: 'rgba(255,255,255,0.10)' }}
        >
          {lineNumber}
        </span>
      )}
      {timestamp && (
        <span
          aria-hidden="true"
          className="select-none text-[10.5px] font-mono shrink-0 leading-5 tabular-nums"
          style={{ color: TOKEN.dim }}
        >
          {timestamp}
        </span>
      )}
      <div className="font-mono text-[12.5px] leading-5 flex-1">{children}</div>
    </motion.div>
  )
}

// ─── Brand Icons ──────────────────────────────────────────────────────────────

// ─── Social Links Data ────────────────────────────────────────────────────────

const PLATFORM_ICONS = {
  phone: Phone,
  email: Mail,
  linkedin: Linkedin,
  whatsapp: MessageCircle,
  github: Github,
  twitter: Twitter,
} as const

type ContactProps = {
  socialLinks?: SocialLink[]
}

// ─── Contact Section ──────────────────────────────────────────────────────────

export function Contact({ socialLinks }: ContactProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { once: true, amount: 0.15 })
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
          <PanelTab label="OUTPUT" active />
          <PanelTab label="TERMINAL" className="hidden sm:flex" />
          <PanelTab label="PROBLEMS" className="hidden sm:flex" />
          <PanelTab label="DEBUG CONSOLE" className="hidden sm:flex" />
        </div>
        <div className="ml-auto flex flex-col items-end justify-center pb-1">
          <code className="block font-mono font-medium text-[10px] sm:text-[12px] tracking-wide text-metaphor/70 select-none mb-3 sm:mb-4">
            npm run connect
          </code>
          {/* Real <h2> so the document outline is h1 → h2 → h3 across sections
              (every other section uses SectionLabel which renders an h2). The
              section's aria-label already named this landmark "Contact" for AT,
              but heading navigation (screen-reader H key) needs a real heading. */}
          <h2 className="font-display font-semibold text-[21px] sm:text-2xl tracking-tight text-white/[0.92] mb-6 sm:mb-11">
            Contact
          </h2>
        </div>
      </div>

      {/* ── Channel Bar ── */}
      <div
        className="flex items-center gap-2.5 px-5 sm:px-6 py-[7px] border-b border-white/[0.04] shrink-0"
        style={{ backgroundColor: '#050505' }}
      >
        <span className="text-[10px] font-mono" style={{ color: TOKEN.dim }}>
          Channel:
        </span>
        <span className="text-[10px] font-mono text-white/70">Contact API v1.0</span>
        <div className="ml-auto hidden sm:flex items-center gap-3">
          <span className="text-[10px] font-mono text-white/70">UTF-8</span>
          <span className="text-white/[0.09] text-[10px]">·</span>
          <span className="text-[10px] font-mono text-white/70">TypeScript</span>
        </div>
      </div>

      {/* ── Console Output Body ── */}
      <div className="flex-1 px-3 sm:px-8 py-7 sm:py-8 space-y-3.5">
        <ConsoleLine lineNumber={1} timestamp="04:07:01" delay={0.1} isVisible={isInView}>
          <span className="text-[11px] sm:text-[11.5px]" style={{ color: TOKEN.comment }}>
            {`// Contact endpoints ready.`}
          </span>
        </ConsoleLine>

        <div className="h-5" aria-hidden="true" />

        <ConsoleLine lineNumber={2} delay={0.3} isVisible={isInView}>
          <span style={{ color: TOKEN.dim }}>{'>'}&nbsp;</span>
          <span style={{ color: TOKEN.identifier }}>contact</span>
          <span style={{ color: TOKEN.punct }}>.</span>
          <span style={{ color: TOKEN.fn }}>getSocialLinks</span>
          <span style={{ color: TOKEN.punct }}>{'()'}</span>
        </ConsoleLine>

        {/* ── Social icon buttons ── */}
        <ConsoleLine delay={0.4} isVisible={isInView}>
          <div className="flex w-full gap-3 py-2 sm:w-auto sm:justify-start sm:gap-5">
            {resolvedSocialLinks.map(({ platform, label, url, copyValue }) => {
              const Icon = PLATFORM_ICONS[platform]
              // A future Sanity schema addition (e.g. new platform value) that
              // hasn't been wired into PLATFORM_ICONS yet would otherwise throw
              // "Icon is not a function". Drop the item silently instead —
              // rendering nothing is strictly better than a client crash.
              if (!Icon) return null
              const resolvedLabel = label ?? platform

              return (
                <div
                  key={`${platform}-${url}`}
                  className="relative flex flex-1 justify-center sm:flex-none"
                >
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
              )
            })}
          </div>
        </ConsoleLine>

        <div className="h-5" aria-hidden="true" />

        <ConsoleLine lineNumber={3} timestamp="04:07:02" delay={0.5} isVisible={isInView}>
          <span style={{ color: TOKEN.success }}>[SUCCESS]&nbsp;</span>
          <span style={{ color: 'rgba(255,255,255,0.70)' }}>
            - {socialLinkCount} endpoint{socialLinkCount === 1 ? '' : 's'} securely loaded.
          </span>
        </ConsoleLine>

        <ConsoleLine lineNumber={4} delay={0.7} isVisible={isInView}>
          <span style={{ color: TOKEN.dim }}>{'>'}&nbsp;</span>
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
                5
              </span>
              <div className="font-mono text-[12.5px] leading-5 flex-1">
                <span style={{ color: TOKEN.success }}>[COPIED]&nbsp;</span>
                <span style={{ color: 'rgba(255,255,255,0.70)' }}>
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
        style={{ backgroundColor: '#060608' }}
      >
        <span
          className="text-[10px] font-mono flex items-center gap-1.5"
          style={{ color: TOKEN.success }}
        >
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-current" aria-hidden="true" />
          READY
        </span>
        <span className="text-white/[0.07] text-[10px]" aria-hidden="true">
          |
        </span>
        <span className="text-[10px] font-mono text-white/70">contact.ts</span>
        <span className="ml-auto hidden sm:block text-[10px] font-mono text-white/70">
          TypeScript JSX
        </span>
      </div>
    </section>
  )
}

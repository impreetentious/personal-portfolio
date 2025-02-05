'use client'

import Link from 'next/link'
import {useEffect, useState, type ComponentType} from 'react'
import {motion} from 'framer-motion'
import type {HeroData, SocialLink} from '@/lib/queries'

const FALLBACK_HERO: HeroData = {
  name: 'Sidakpreet Singh',
  tagline: 'Building thoughtful products with code, systems, and clarity.',
  bio: 'A dark, interactive portfolio foundation with room for your story, experience, and strongest work to unfold section by section.',
  socialLinks: [
    {platform: 'email', url: 'mailto:hello@example.com', label: 'Email'},
    {platform: 'linkedin', url: 'https://www.linkedin.com', label: 'LinkedIn'},
  ],
}

type IconProps = {className?: string}

function MailIcon({className}: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <rect width="24" height="24" rx="2" fill="#EA4335" />
      {/*
        Envelope body: x 2→22, y 4→20 — equal 4 px top/bottom in the
        24×24 viewBox so the icon sits visually centred inside the red box.
      */}
      <path
        fill="#ffffff"
        d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z"
      />
    </svg>
  )
}

function LinkedInIcon({className}: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <rect width="24" height="24" rx="2" fill="#0A66C2" />
      <path
        fill="#ffffff"
        d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.34V8.99h3.42v1.57h.05c.48-.9 1.64-1.85 3.37-1.85 3.61 0 4.27 2.38 4.27 5.46v6.28ZM5.32 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12Zm1.78 13.02H3.54V8.99H7.1v11.46Z"
      />
    </svg>
  )
}

function WhatsAppIcon({className}: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#25D366"
        d="M12.04 2.25a9.63 9.63 0 0 0-8.2 14.68L2.75 21.75l4.94-1.06a9.61 9.61 0 1 0 4.35-18.44Zm0 17.51a7.93 7.93 0 0 1-4.05-1.11l-.29-.17-2.93.63.64-2.86-.19-.3a7.94 7.94 0 1 1 6.82 3.81Zm4.35-5.94c-.24-.12-1.4-.69-1.62-.77-.22-.08-.38-.12-.54.12-.16.24-.62.77-.76.93-.14.16-.28.18-.52.06-.24-.12-1.01-.37-1.93-1.19-.71-.64-1.2-1.42-1.34-1.66-.14-.24-.02-.37.1-.49.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.54-1.3-.74-1.78-.19-.47-.39-.4-.54-.41h-.46c-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2s.86 2.32.98 2.48c.12.16 1.69 2.58 4.1 3.62.57.25 1.02.39 1.37.5.58.18 1.1.16 1.51.1.46-.07 1.4-.57 1.6-1.13.2-.55.2-1.03.14-1.13-.06-.1-.22-.16-.46-.28Z"
      />
    </svg>
  )
}

function GitHubIcon({className}: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#F0F6FC"
        d="M12 2.25c-5.38 0-9.75 4.37-9.75 9.75 0 4.31 2.8 7.96 6.68 9.25.49.09.67-.21.67-.47v-1.71c-2.72.59-3.29-1.16-3.29-1.16-.44-1.13-1.08-1.43-1.08-1.43-.89-.61.07-.6.07-.6.98.07 1.5 1.01 1.5 1.01.87 1.49 2.28 1.06 2.84.81.09-.63.34-1.06.62-1.31-2.17-.25-4.45-1.09-4.45-4.83 0-1.07.38-1.94 1.01-2.62-.1-.25-.44-1.24.1-2.59 0 0 .82-.26 2.68 1a9.25 9.25 0 0 1 4.88 0c1.86-1.26 2.68-1 2.68-1 .54 1.35.2 2.34.1 2.59.63.68 1.01 1.55 1.01 2.62 0 3.75-2.29 4.58-4.47 4.82.35.3.66.9.66 1.81v2.68c0 .26.18.57.67.47A9.76 9.76 0 0 0 21.75 12c0-5.38-4.37-9.75-9.75-9.75Z"
      />
    </svg>
  )
}

function TwitterIcon({className}: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#FFFFFF"
        d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.908-5.622Zm-1.161 17.52h1.833L7.084 4.126H5.117z"
      />
    </svg>
  )
}

const PLATFORM_ICONS: Record<SocialLink['platform'], ComponentType<IconProps>> = {
  email: MailIcon,
  linkedin: LinkedInIcon,
  whatsapp: WhatsAppIcon,
  github: GitHubIcon,
  twitter: TwitterIcon,
}

const PLATFORM_LABELS: Record<SocialLink['platform'], string> = {
  email: 'Email',
  linkedin: 'LinkedIn',
  whatsapp: 'WhatsApp',
  github: 'GitHub',
  twitter: 'Twitter',
}

type HeroProps = {
  data: HeroData | null
}

export function Hero({data}: HeroProps) {
  const hero = data ?? FALLBACK_HERO

  const nameParts = hero.name.trim().split(/\s+/)
  const firstName = nameParts[0] ?? ''
  const lastName = nameParts.slice(1).join(' ')

  const [visibleText, setVisibleText] = useState('')
  const [scrollY, setScrollY] = useState(0)
  const [viewportHeight, setViewportHeight] = useState(0)

  useEffect(() => {
    setVisibleText('')
    let currentIndex = 0

    const interval = window.setInterval(() => {
      currentIndex += 1
      setVisibleText(hero.tagline.slice(0, currentIndex))

      if (currentIndex >= hero.tagline.length) {
        window.clearInterval(interval)
      }
    }, 42)

    return () => window.clearInterval(interval)
  }, [hero.tagline])

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY)
    const onResize = () => setViewportHeight(window.innerHeight)

    setScrollY(window.scrollY)
    setViewportHeight(window.innerHeight)

    window.addEventListener('scroll', onScroll, {passive: true})
    window.addEventListener('resize', onResize, {passive: true})

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  // scrollY and viewportHeight together drive the delayed indicator fade-out.
  // viewportHeight initialises to 0 so SSR/hydration is always safe.
  // Stays fully visible until the user scrolls past 50% of the viewport,
  // then fades to 0 over the next 150 px.
  const scrollThreshold = viewportHeight * 0.5
  const scrollIndicatorOpacity =
    viewportHeight === 0 || scrollY <= scrollThreshold
      ? 1
      : Math.max(0, 1 - (scrollY - scrollThreshold) / 150)

  return (
    <section
      id="home"
      className="relative min-h-screen overflow-hidden px-6 py-16 sm:px-8 md:px-12 md:py-20"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_24%,rgba(78,168,248,0.16),transparent_26rem)]" />

      <div className="relative mx-auto flex min-h-[calc(100vh-8rem)] max-w-6xl items-center">
        <motion.div
          initial={{opacity: 0, y: 24}}
          animate={{opacity: 1, y: 0}}
          transition={{type: 'tween', ease: 'easeOut', duration: 0.6}}
          className="w-full border-l border-accent/30 pl-6 sm:pl-8 md:pl-10"
        >
          <motion.p
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            transition={{delay: 0.3, type: 'tween', ease: 'easeOut', duration: 0.6}}
            className="mb-5 text-base uppercase tracking-[0.35em] text-orange-500"
          >
            Personal Portfolio
          </motion.p>

          <motion.h1
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            transition={{delay: 0.5, type: 'tween', ease: 'easeOut', duration: 0.6}}
            className="max-w-4xl text-5xl font-extrabold text-white sm:text-6xl md:text-8xl"
          >
            <span className="block">{firstName}</span>
            {lastName && <span className="block">{lastName}</span>}
          </motion.h1>

          <motion.div
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            transition={{delay: 0.5, type: 'tween', ease: 'easeOut', duration: 0.6}}
            className="mt-7 min-h-[3.5rem] max-w-3xl text-lg leading-8 text-foreground sm:text-xl"
          >
            <span>{visibleText}</span>
            <motion.span
              aria-hidden="true"
              animate={{opacity: [0, 1, 0]}}
              transition={{repeat: Infinity, duration: 1}}
              className="ml-1 inline-block text-accent"
            >
              |
            </motion.span>
          </motion.div>

          <motion.p
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            transition={{delay: 0.65, type: 'tween', ease: 'easeOut', duration: 0.6}}
            className="mt-8 max-w-2xl text-base leading-7 text-foreground/80 sm:text-lg"
          >
            {hero.bio}
          </motion.p>

          {hero.socialLinks.length > 0 && (
            <motion.div
              initial={{opacity: 0, y: 16}}
              animate={{opacity: 1, y: 0}}
              transition={{delay: 0.8, type: 'tween', ease: 'easeOut', duration: 0.6}}
              className="mt-10 flex gap-3"
            >
              {hero.socialLinks.map((link) => {
                const Icon = PLATFORM_ICONS[link.platform]
                const label = link.label ?? PLATFORM_LABELS[link.platform]
                const isEmail = link.platform === 'email'

                return isEmail ? (
                  <Link
                    key={link.platform}
                    href={link.url}
                    aria-label={label}
                    className="hover-glow inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/15 bg-white/[0.04] hover:-translate-y-0.5 hover:border-accent/50 hover:bg-accent/10"
                  >
                    <Icon className="h-6 w-6" />
                  </Link>
                ) : (
                  <Link
                    key={link.platform}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="hover-glow inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-accent/30 hover:-translate-y-0.5 hover:border-accent hover:bg-accent/5"
                  >
                    <Icon className="h-6 w-6" />
                  </Link>
                )
              })}
            </motion.div>
          )}
        </motion.div>
      </div>

      {/*
        Scroll indicator — two-layer opacity system:
          1. Outer div: CSS transition driven by scrollY state → smooth fade-out
             as user scrolls. pointerEvents:none prevents layout interference.
          2. Inner motion.div: timed entry animation (delay 1.4s) completely
             independent of the scroll fade so both can coexist without conflict.
      */}
      <div
        aria-hidden="true"
        className="absolute bottom-6 left-1/2 -translate-x-1/2"
        style={{
          opacity: scrollIndicatorOpacity,
          transition: 'opacity 0.2s ease-out',
          pointerEvents: 'none',
        }}
      >
        <motion.div
          initial={{opacity: 0}}
          animate={{opacity: 1}}
          transition={{delay: 1.4, type: 'tween', ease: 'easeOut', duration: 0.6}}
          className="flex flex-col items-center gap-3 text-xs font-medium uppercase tracking-[0.35em] text-accent"
        >
          <motion.span
            animate={{opacity: [0.35, 1, 0.35]}}
            transition={{duration: 1.8, repeat: Infinity, ease: 'easeInOut'}}
          >
            Scroll
          </motion.span>
          <motion.span
            initial={{scaleY: 0}}
            animate={{scaleY: [0.35, 1, 0.35]}}
            transition={{duration: 1.8, repeat: Infinity, ease: 'easeInOut'}}
            className="h-12 w-px origin-top bg-accent/70"
          />
        </motion.div>
      </div>
    </section>
  )
}
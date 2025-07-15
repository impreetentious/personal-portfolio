import type { Metadata } from 'next'
import { NotFoundClient } from '@/components/NotFoundClient'

// Server component: framer-motion + hover interactions live in NotFoundClient
// (marked 'use client'). Keeping this file server-only is what lets us export
// metadata for the 404 tab title — client components can't.
export const metadata: Metadata = {
  title: '404 — Page Not Found | Sidakpreet Singh',
}

export default function NotFound() {
  return <NotFoundClient />
}

'use client'

import { createContext, useContext, type ReactNode } from 'react'

type PaletteContextValue = {
  // Optional initialQuery pre-fills the palette search so a trigger can land
  // directly on a view (e.g. 'help' or 'nav') instead of the blank idle prompt
  openPalette: (initialQuery?: string) => void
}

const PaletteContext = createContext<PaletteContextValue>({ openPalette: () => {} })

export function PaletteProvider({
  value,
  children,
}: {
  value: PaletteContextValue
  children: ReactNode
}) {
  return <PaletteContext.Provider value={value}>{children}</PaletteContext.Provider>
}

export function usePalette() {
  return useContext(PaletteContext)
}

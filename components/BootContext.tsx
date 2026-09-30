// Boot sequence state. First visit plays it; a return visit skips straight to content.
'use client'

import { createContext, useContext, type ReactNode } from 'react'
const BootContext = createContext(true)

export function BootProvider({ value, children }: { value: boolean; children: ReactNode }) {
  return <BootContext.Provider value={value}>{children}</BootContext.Provider>
}

export function useBootComplete() {
  return useContext(BootContext)
}

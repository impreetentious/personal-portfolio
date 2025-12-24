'use client'

import { createContext, useContext, type ReactNode } from 'react'
const BootContext = createContext(true)

export function BootProvider({ value, children }: { value: boolean; children: ReactNode }) {
  return <BootContext.Provider value={value}>{children}</BootContext.Provider>
}

export function useBootComplete() {
  return useContext(BootContext)
}

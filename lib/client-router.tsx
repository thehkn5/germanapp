"use client"

import { type ReactNode, createContext, useContext } from "react"

interface ClientRouterContextType {
  navigateTo: (path: string) => void
}

const ClientRouterContext = createContext<ClientRouterContextType>({
  navigateTo: (path: string) => {
    window.location.href = path
  },
})

export function ClientRouterProvider({ children }: { children: ReactNode }) {
  const navigateTo = (path: string) => {
    // Use direct navigation to avoid routing issues
    window.location.href = path
  }

  return <ClientRouterContext.Provider value={{ navigateTo }}>{children}</ClientRouterContext.Provider>
}

export function useClientRouter() {
  return useContext(ClientRouterContext)
}

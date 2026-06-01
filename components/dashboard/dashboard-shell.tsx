"use client"

import { useState, useCallback } from "react"
import { Sidebar } from "./sidebar"
import { TopBar } from "./top-bar"

interface DashboardShellProps {
  children: React.ReactNode
  itemTypes: { id: string; name: string; slug: string; icon: string; color: string; count: number }[]
  collections: { id: string; name: string; isFavorite: boolean; itemCount: number; dominantColor: string | null }[]
  user: { name: string | null; email: string } | null
}

export function DashboardShell({ children, itemTypes, collections, user }: DashboardShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)

  const toggleSidebar = useCallback(() => {
    setSidebarOpen((prev) => !prev)
  }, [])

  const toggleMobileSidebar = useCallback(() => {
    setMobileSidebarOpen((prev) => !prev)
  }, [])

  const closeMobileSidebar = useCallback(() => {
    setMobileSidebarOpen(false)
  }, [])

  return (
    <div className="flex h-screen flex-col">
      <TopBar onMenuToggle={toggleMobileSidebar} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          isOpen={sidebarOpen}
          isMobileOpen={mobileSidebarOpen}
          onToggle={toggleSidebar}
          onMobileClose={closeMobileSidebar}
          itemTypes={itemTypes}
          collections={collections}
          user={user}
        />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}

"use client"

import { useState, useCallback } from "react"
import { Sidebar } from "@/components/dashboard/sidebar"
import { TopBar } from "@/components/dashboard/top-bar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
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
        />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}

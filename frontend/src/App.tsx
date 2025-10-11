"use client"

import { useState, useEffect } from "react"
import { KanbanBoard } from "../src/components/kanban-board"
import { Sidebar } from "../src/components/sidebar"
import { TopNav } from "../src/components/top-nav"
import { AuthPage } from "../src/components/auth-page"

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(true)
      } else {
        setSidebarOpen(false)
      }
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  if (!isAuthenticated) {
    return <AuthPage onGetStarted={() => setIsAuthenticated(true)} />
  }

  return (
    <div className="flex h-screen flex-col bg-background">
      {/* Top Navigation - Full Width */}
      <TopNav onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

      {/* Main Content Area - Below Header */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

        {sidebarOpen && (
          <div className="fixed inset-0 top-14 bg-black/50 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />
        )}

        {/* Main Content */}
        <main className={`flex-1 overflow-auto transition-all duration-300 ${sidebarOpen ? "lg:ml-64" : "ml-0"}`}>
          <KanbanBoard />
        </main>
      </div>
    </div>
  )
}

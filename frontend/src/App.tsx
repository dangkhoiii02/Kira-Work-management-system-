"use client"

import { useState, useEffect } from "react"
import { TopNav } from "../src/components/top-nav";
import { Sidebar } from "../src/components/sidebar";
import { KanbanBoard } from "../src/components/kanban-board";

export default function Home() {
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

  return (
    <div className="flex h-screen flex-col bg-background">
      {/* Top Navigation - Full Width */}
      <TopNav onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

      {/* Main Content Area - Below Header */}
      <div className="flex flex-1 overflow-hidden">
        {/* Mobile Overlay */}
        {sidebarOpen && (
          <div className="fixed inset-0 top-14 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
        )}

        {/* Sidebar */}
        <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

        {/* Main Content */}
        <main className={`flex-1 overflow-auto transition-all duration-300 ${sidebarOpen ? "lg:ml-64" : "ml-0"}`}>
          <KanbanBoard />
        </main>
      </div>
    </div>
  )
}

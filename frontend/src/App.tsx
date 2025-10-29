"use client"

import { useState } from "react"
import { Sidebar } from "./components/sidebar"
import { TopNav } from "./components/top-nav"
import { AuthPage } from "./components/auth-page"
import { SummaryView } from "./components/summary-view"
import { ListView } from "./components/list-view"

// Khai báo kiểu User cục bộ để tránh import type từ BE
type FEUser = {
  id: number
  nick_name: string
  email: string
}

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [activeView, setActiveView] = useState<"summary" | "list">("summary")
  const [user, setUser] = useState<FEUser | null>(null)
  const [projectId, setProjectId] = useState<number | undefined>(undefined)

  /** Sau khi đăng nhập/đăng ký thành công */
  function handleAuthSuccess(u: FEUser, projId?: number) {
    setUser(u)
    setProjectId(projId)
    setIsAuthenticated(true)
    setActiveView("list") // chuyển thẳng sang List để tạo task
  }

  // Chưa đăng nhập → chỉ hiện trang Auth
  if (!isAuthenticated || !user) {
    return <AuthPage onAuthSuccess={handleAuthSuccess} />
  }

  return (
    <div className="flex h-screen flex-col bg-background">
      {/* Top Navigation - Full Width */}
      {/* onMenuClick không làm gì để tránh mở sidebar */}
      <TopNav onMenuClick={() => {}} />

      {/* Main Content Area - Below Header */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar luôn đóng */}
        <Sidebar isOpen={false} onToggle={() => {}} />

        {/* KHÔNG có overlay vì sidebar luôn đóng */}

        {/* Main Content */}
        <main className="flex-1 overflow-auto transition-all duration-300 ml-0">
          {/* Công tắc view nhỏ gọn */}
          <div className="px-4 pt-4">
            <div className="inline-flex gap-2">
              <button
                className={`px-3 py-1 rounded border text-sm ${
                  activeView === "summary" ? "bg-muted" : "bg-transparent"
                }`}
                onClick={() => setActiveView("summary")}
              >
                Summary
              </button>
              <button
                className={`px-3 py-1 rounded border text-sm ${
                  activeView === "list" ? "bg-muted" : "bg-transparent"
                }`}
                onClick={() => setActiveView("list")}
              >
                List
              </button>
            </div>
          </div>

          {activeView === "summary" ? (
            <SummaryView projectId={projectId} />
          ) : (
            <ListView user={user} projectId={projectId} />
          )}
        </main>
      </div>
    </div>
  )
}

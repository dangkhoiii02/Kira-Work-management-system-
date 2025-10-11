"use client"

import { Home, Folder, Plus, ChevronRight, MoreHorizontal, X } from "lucide-react"
import { Button } from "../components/ui/button"
import { cn } from "../lib/utils"

interface SidebarProps {
  isOpen: boolean
  onToggle: () => void
}

export function Sidebar({ isOpen, onToggle }: SidebarProps) {
  return (
    <aside
      className={cn(
        "fixed left-0 top-14 z-40 flex h-[calc(100vh-3.5rem)] flex-col border-r border-border bg-sidebar transition-all duration-300",
        isOpen ? "w-64" : "w-0 overflow-hidden",
      )}
    >
      <div className="w-64 flex flex-col gap-1 p-3">
        <div className="flex items-center justify-between mb-2 lg:hidden">
          <span className="font-semibold text-sidebar-foreground">Menu</span>
          <Button variant="ghost" size="icon" onClick={onToggle}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <Button
  variant="ghost"
  className="pl-2 justify-start text-sidebar-foreground hover:bg-sidebar-accent"
>
  <Home className="h-4 w-4" /> 
  For you
</Button>


        <div className="mt-2">
          <div className="flex items-center justify-between px-2 py-1">
            <div className="flex items-center gap-1 text-sm font-medium text-sidebar-foreground">
              <Folder className="mr-1 h-4 w-4" />
              <span>Projects</span>
            </div>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" className="h-6 w-6">
                <Plus className="h-3 w-3" />
              </Button>
              <Button variant="ghost" size="icon" className="h-6 w-6">
                <MoreHorizontal className="h-3 w-3" />
              </Button>
            </div>
          </div>

          <div className="mt-1 space-y-1">
            <div className="text-xs font-medium text-muted-foreground px-2 py-1">Recent</div>
            <Button variant="ghost" className="w-full justify-start bg-sidebar-accent text-sidebar-accent-foreground">
              <div className="mr-2 h-5 w-5 rounded bg-red-600 flex items-center justify-center text-white text-xs font-bold">
                M
              </div>
              My Kanban Project
            </Button>
          </div>

          <Button variant="ghost" className="mt-1 w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent">
            <span className="text-sm">More projects</span>
            <ChevronRight className="ml-auto h-4 w-4" />
          </Button>
        </div>

        <Button variant="ghost" className="mt-4 justify-start text-sidebar-foreground hover:bg-sidebar-accent">
          <MoreHorizontal className="mr-2 h-4 w-4" />
          More
        </Button>
      </div>
    </aside>
  )
}

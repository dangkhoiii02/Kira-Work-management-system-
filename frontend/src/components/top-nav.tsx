"use client"

import { Search, Plus, Bell, HelpCircle, Settings, Menu } from "lucide-react"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar"

interface TopNavProps {
  onMenuClick: () => void
}

export function TopNav({ onMenuClick }: TopNavProps) {
  return (
    <header className="flex h-14 items-center justify-between border-b border-border bg-card px-2 sm:px-4">
      <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0">
        <Button variant="ghost" size="icon" className="shrink-0 hover:bg-muted bg-muted/50" onClick={onMenuClick}>
          <Menu className="h-5 w-5" />
        </Button>

        <div className="flex items-center gap-2 shrink-0">
          <div className="flex h-8 w-8 items-center justify-center rounded bg-blue-600">
            <svg viewBox="0 0 24 24" className="h-5 w-5 text-white" fill="currentColor">
              <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z" />
            </svg>
          </div>
          <span className="font-semibold text-foreground hidden sm:inline">Kira</span>
        </div>

        <div className="relative flex-1 max-w-md hidden md:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input type="search" placeholder="Search" className="pl-9 bg-muted/50 border-border" />
        </div>
      </div>

      <div className="flex items-center gap-1 sm:gap-2">
        <Button className="bg-blue-600 hover:bg-blue-700 text-white h-9 px-2 sm:px-4">
          <Plus className="h-4 w-4 sm:mr-1" />
          <span className="hidden sm:inline">Create</span>
        </Button>
        <Button variant="ghost" size="icon" className="hidden sm:flex">
          <Bell className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" className="hidden md:flex">
          <HelpCircle className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" className="hidden md:flex">
          <Settings className="h-5 w-5" />
        </Button>
        <Avatar className="h-8 w-8">
          <AvatarImage src="/placeholder.svg?height=32&width=32" />
          <AvatarFallback>AK</AvatarFallback>
        </Avatar>
      </div>
    </header>
  )
}

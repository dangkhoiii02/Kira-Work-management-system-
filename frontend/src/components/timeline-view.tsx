"use client"

import { useState } from "react"
import { Search, ChevronRight, Info, ChevronLeft, Plus } from "lucide-react"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../components/ui/dropdown-menu"

export function TimelineView() {
  const [viewMode, setViewMode] = useState<"today" | "weeks" | "months" | "quarters">("months")

  const months = ["September", "October", "November", "December", "January '26"]
  const currentMonth = "October"

  return (
    <div className="flex h-full flex-col">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-border bg-card px-3 sm:px-6 py-3">
        <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto overflow-x-auto">
          <div className="relative shrink-0">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search timeline"
              className="pl-9 w-full sm:w-48 h-9 bg-muted/50 border-border"
            />
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <Avatar className="h-7 w-7 border-2 border-background">
              <AvatarImage src="/placeholder.svg?height=28&width=28" />
              <AvatarFallback className="bg-blue-500 text-white text-xs">JD</AvatarFallback>
            </Avatar>
            <Button variant="ghost" size="icon" className="h-7 w-7 rounded-full border border-border bg-muted/50">
              <Plus className="h-3 w-3" />
            </Button>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-9 bg-transparent shrink-0">
                <span className="hidden sm:inline">Status category</span>
                <span className="sm:hidden">Status</span>
                <ChevronRight className="ml-2 h-4 w-4 rotate-90" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>To Do</DropdownMenuItem>
              <DropdownMenuItem>In Progress</DropdownMenuItem>
              <DropdownMenuItem>Done</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="h-9 w-9 hidden sm:flex">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
              />
            </svg>
          </Button>
          <Button variant="ghost" size="icon" className="h-9 w-9 hidden sm:flex">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-auto bg-background">
        <div className="flex h-full min-w-max">
          <div className="w-32 sm:w-48 border-r border-border bg-card shrink-0">
            <div className="p-2 sm:p-4 border-b border-border">
              <h3 className="text-xs sm:text-sm font-medium text-foreground">Work</h3>
            </div>
            <div className="p-2 sm:p-4">
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start h-9 text-muted-foreground hover:text-foreground text-xs sm:text-sm"
              >
                <Plus className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Create Epic</span>
                <span className="sm:hidden">Epic</span>
              </Button>
            </div>
          </div>

          <div className="flex-1 overflow-x-auto">
            <div className="min-w-max">
              <div className="flex border-b border-border bg-card sticky top-0 z-10">
                {months.map((month, index) => (
                  <div
                    key={month}
                    className="flex-1 min-w-[180px] sm:min-w-[240px] px-2 sm:px-4 py-3 text-center text-xs sm:text-sm font-medium text-foreground border-r border-border"
                  >
                    {month}
                  </div>
                ))}
              </div>

              <div className="relative flex h-[400px] sm:h-[600px]">
                {months.map((month, index) => (
                  <div
                    key={month}
                    className={`flex-1 min-w-[180px] sm:min-w-[240px] border-r border-border ${
                      index % 2 === 0 ? "bg-muted/20" : "bg-background"
                    }`}
                  />
                ))}

                <div className="absolute top-0 bottom-0 w-0.5 bg-blue-500 z-20" style={{ left: "28%" }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-t border-border bg-card px-3 sm:px-6 py-3">
        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
          <Button
            variant={viewMode === "today" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setViewMode("today")}
            className="h-9 shrink-0"
          >
            Today
          </Button>
          <Button
            variant={viewMode === "weeks" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setViewMode("weeks")}
            className="h-9 shrink-0"
          >
            Weeks
          </Button>
          <Button
            variant={viewMode === "months" ? "default" : "ghost"}
            size="sm"
            onClick={() => setViewMode("months")}
            className="h-9 shrink-0"
          >
            Months
          </Button>
          <Button
            variant={viewMode === "quarters" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setViewMode("quarters")}
            className="h-9 shrink-0"
          >
            Quarters
          </Button>

          <Button variant="ghost" size="icon" className="h-9 w-9 ml-2 shrink-0">
            <Info className="h-4 w-4" />
          </Button>

          <div className="flex items-center gap-1 ml-2 shrink-0">
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

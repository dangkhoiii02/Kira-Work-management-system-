"use client"
import { LayoutGrid, Calendar, List, Clock, Plus } from "lucide-react"
import { Button } from "../components/ui/button"
import { cn } from "../lib/utils"

const tabs = [
  { id: "summary", label: "Summary", icon: LayoutGrid },
  { id: "board", label: "Board", icon: LayoutGrid },
  { id: "calendar", label: "Calendar", icon: Calendar },
  { id: "list", label: "List", icon: List },
  { id: "timeline", label: "Timeline", icon: Clock },
]

interface ProjectTabsProps {
  activeTab?: string
  onTabChange?: (tabId: string) => void
}

export function ProjectTabs({ activeTab = "board", onTabChange }: ProjectTabsProps) {
  return (
    <div className="flex items-center gap-1 mt-3 border-b border-border -mb-4 overflow-x-auto scrollbar-hide">
      {tabs.map((tab) => {
        const Icon = tab.icon
        return (
          <Button
            key={tab.id}
            variant="ghost"
            className={cn(
              "h-10 rounded-b-none border-b-2 border-transparent hover:bg-transparent shrink-0 px-3 sm:px-4",
              activeTab === tab.id && "border-blue-600 text-blue-600",
            )}
            onClick={() => onTabChange?.(tab.id)}
          >
            <Icon className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">{tab.label}</span>
          </Button>
        )
      })}
      <Button variant="ghost" size="icon" className="h-10 w-10 rounded-b-none shrink-0">
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  )
}

"use client"

import { useState } from "react"
import { Search, Filter, Plus, MoreHorizontal, Users, Share2, Maximize2 } from "lucide-react"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { KanbanColumn } from "../components/kanban-column"
import { ProjectTabs } from "../components/project-tabs"
import { SummaryView } from "../components/summary-view"
import { CalendarView } from "../components/calendar-view"
import { ListView } from "../components/list-view"
import { TimelineView } from "../components/timeline-view"
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../components/ui/dropdown-menu"

export interface Task {
  id: string
  title: string
  description?: string
  assignee?: string
  priority?: "low" | "medium" | "high"
}

export interface Column {
  id: string
  title: string
  tasks: Task[]
}

export function KanbanBoard() {
  const [activeTab, setActiveTab] = useState("summary")
  const [columns, setColumns] = useState<Column[]>([
    {
      id: "in-progress",
      title: "IN PROGRESS",
      tasks: [],
    },
    {
      id: "done",
      title: "DONE",
      tasks: [],
    },
  ])

  const addColumn = () => {
    const newColumn: Column = {
      id: `column-${Date.now()}`,
      title: "NEW COLUMN",
      tasks: [],
    }
    setColumns([...columns, newColumn])
  }

  const addTask = (columnId: string) => {
    const newTask: Task = {
      id: `task-${Date.now()}`,
      title: "New Task",
      description: "Task description",
    }

    setColumns(columns.map((col) => (col.id === columnId ? { ...col, tasks: [...col.tasks, newTask] } : col)))
  }

  return (
    <div className="flex h-full flex-col">
      {/* Project Header */}
      <div className="border-b border-border bg-card px-3 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
            <div className="h-8 w-8 sm:h-10 sm:w-10 rounded bg-red-600 flex items-center justify-center text-white font-bold shrink-0">
              M
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-base sm:text-xl font-semibold text-foreground truncate">My Kanban Project</h1>
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0 hidden sm:flex">
              <Users className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0 hidden md:flex">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            <Button variant="ghost" size="icon" className="h-8 w-8 hidden sm:flex">
              <Share2 className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 hidden md:flex">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 hidden lg:flex">
              <Maximize2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <ProjectTabs activeTab={activeTab} onTabChange={setActiveTab} />
      </div>

      {activeTab === "summary" ? (
        <div className="flex-1 overflow-auto bg-background">
          <SummaryView />
        </div>
      ) : activeTab === "calendar" ? (
        <div className="flex-1 overflow-auto bg-background">
          <CalendarView />
        </div>
      ) : activeTab === "list" ? (
        <div className="flex-1 overflow-auto bg-background">
          <ListView />
        </div>
      ) : activeTab === "timeline" ? (
        <div className="flex-1 overflow-auto bg-background">
          <TimelineView />
        </div>
      ) : activeTab === "board" ? (
        <>
          {/* Board Controls */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-border bg-card px-3 sm:px-6 py-3">
            <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
              <div className="relative shrink-0">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search board"
                  className="pl-9 w-full sm:w-64 h-9 bg-muted/50 border-border"
                />
              </div>

              <Button variant="outline" size="sm" className="h-9 bg-transparent shrink-0 hidden sm:flex">
                <Avatar className="h-5 w-5 mr-2">
                  <AvatarImage src="/placeholder.svg?height=20&width=20" />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
              </Button>

              <Button variant="outline" size="sm" className="h-9 bg-transparent shrink-0">
                <Filter className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Filter</span>
              </Button>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="h-9 bg-transparent">
                    Group
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>By Status</DropdownMenuItem>
                  <DropdownMenuItem>By Assignee</DropdownMenuItem>
                  <DropdownMenuItem>By Priority</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button variant="ghost" size="icon" className="h-9 w-9 hidden sm:flex">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </Button>

              <Button variant="ghost" size="icon" className="h-9 w-9 hidden md:flex">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                  />
                </svg>
              </Button>

              <Button variant="ghost" size="icon" className="h-9 w-9">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Kanban Columns */}
          <div className="flex-1 overflow-x-auto bg-muted/30 p-3 sm:p-6">
            <div className="flex gap-3 sm:gap-4 h-full min-w-max">
              {columns.map((column) => (
                <KanbanColumn key={column.id} column={column} onAddTask={() => addTask(column.id)} />
              ))}

              <Button
                variant="ghost"
                className="h-10 w-10 shrink-0 rounded-md border-2 border-dashed border-border hover:border-foreground/50 hover:bg-muted"
                onClick={addColumn}
              >
                <Plus className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </>
      ) : (
        <div className="flex-1 flex items-center justify-center bg-background">
          <p className="text-muted-foreground">This view is not yet implemented</p>
        </div>
      )}
    </div>
  )
}

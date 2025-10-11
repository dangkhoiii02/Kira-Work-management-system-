"use client"

import { useState } from "react"
import { Search, Plus, MoreHorizontal } from "lucide-react"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../components/ui/dropdown-menu"
import { Checkbox } from "../components/ui/checkbox"

export function ListView() {
  const [hasItems, setHasItems] = useState(false)

  return (
    <div className="flex h-full flex-col">
      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-border bg-card px-3 sm:px-6 py-3">
        <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-initial">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search list"
              className="pl-9 w-full sm:w-64 h-9 bg-background border-border"
            />
          </div>

          <Avatar className="h-8 w-8 border-2 border-green-500 shrink-0">
            <AvatarImage src="/placeholder.svg?height=32&width=32" />
            <AvatarFallback className="bg-blue-500 text-white text-xs">JD</AvatarFallback>
          </Avatar>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-9 bg-transparent shrink-0">
                Filter
                <svg className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>All items</DropdownMenuItem>
              <DropdownMenuItem>My items</DropdownMenuItem>
              <DropdownMenuItem>Recently updated</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-9 bg-transparent">
                Group
                <svg className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>None</DropdownMenuItem>
              <DropdownMenuItem>By Status</DropdownMenuItem>
              <DropdownMenuItem>By Assignee</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="ghost" size="icon" className="h-9 w-9 hidden sm:flex">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </Button>

          <Button variant="ghost" size="icon" className="h-9 w-9">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto bg-background">
        <div className="min-w-[1200px]">
          {/* Table Header */}
          <div className="border-b border-border bg-muted/30">
            <div className="grid grid-cols-[40px_80px_100px_1fr_120px_120px_120px_100px_100px_120px_40px] gap-4 px-6 py-3 text-xs font-medium text-muted-foreground">
              <div className="flex items-center">
                <Checkbox />
              </div>
              <div>Type</div>
              <div>Key</div>
              <div>Summary</div>
              <div>Status</div>
              <div>Assignee</div>
              <div>Due date</div>
              <div>Priority</div>
              <div>Comments</div>
              <div>Labels</div>
              <div className="flex justify-center">
                <Plus className="h-4 w-4" />
              </div>
            </div>
          </div>

          {/* Create Button Row */}
          <div className="border-b border-border px-6 py-3">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 text-muted-foreground hover:text-foreground"
              onClick={() => setHasItems(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Create
            </Button>
          </div>
        </div>

        {/* Empty State */}
        {!hasItems && (
          <div className="flex flex-col items-center justify-center py-12 sm:py-20 px-4 sm:px-6">
            <div className="relative mb-8">
              {/* Blue blob background */}
              <div className="absolute inset-0 -z-10">
                <svg width="400" height="300" viewBox="0 0 400 300" fill="none" className="w-full max-w-sm">
                  <path
                    d="M200 50C250 50 300 75 325 125C350 175 350 225 300 250C250 275 150 275 100 250C50 225 25 175 50 125C75 75 150 50 200 50Z"
                    fill="#3B82F6"
                    opacity="0.8"
                  />
                </svg>
              </div>

              {/* Document illustration */}
              <div className="relative bg-white rounded-lg shadow-lg p-4 sm:p-8 w-full max-w-xs sm:max-w-sm">
                {/* Document header */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-3 w-24 bg-gray-200 rounded" />
                  <div className="h-3 w-12 bg-gray-200 rounded" />
                  <div className="h-3 w-12 bg-gray-200 rounded" />
                </div>

                {/* Document rows */}
                <div className="space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="h-2 w-16 bg-gray-200 rounded" />
                      <div className="h-2 flex-1 bg-blue-400 rounded" />
                      <div className="h-3 w-3 rounded-full bg-pink-400" />
                    </div>
                  ))}

                  <div className="flex items-center gap-2">
                    <div className="h-2 w-16 bg-gray-200 rounded" />
                    <div className="h-6 flex-1 border-2 border-blue-500 rounded bg-white" />
                    <div className="h-3 w-3 rounded-full bg-green-400" />
                  </div>

                  <div className="h-px bg-gray-200 my-3" />

                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="h-2 w-16 bg-gray-200 rounded" />
                      <div className="h-2 flex-1 bg-green-400 rounded" />
                      <div className="h-3 w-3 rounded-full bg-orange-400" />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <h2 className="text-lg sm:text-xl font-semibold text-foreground mb-2 text-center">
              View your work in a list
            </h2>
            <p className="text-sm sm:text-base text-center text-muted-foreground mb-6 max-w-md px-4">
              Manage and sort all your project's work into a single list that can be easily scanned and sorted by
              category.
            </p>

            <Button onClick={() => setHasItems(true)}>Create work item</Button>
          </div>
        )}
      </div>
    </div>
  )
}

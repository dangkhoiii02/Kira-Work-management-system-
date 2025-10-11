"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, Search, ChevronDown, CalendarIcon, Printer, Settings2 } from "lucide-react"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../components/ui/dropdown-menu"

export function CalendarView() {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 9, 10)) // Oct 10, 2025
  const [viewMode, setViewMode] = useState("Month")

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    return { daysInMonth, startingDayOfWeek, year, month }
  }

  const generateCalendarDays = () => {
    const { daysInMonth, startingDayOfWeek, year, month } = getDaysInMonth(currentDate)
    const days = []

    // Get previous month's last days
    const prevMonth = new Date(year, month, 0)
    const prevMonthDays = prevMonth.getDate()
    const startDay = startingDayOfWeek === 0 ? 6 : startingDayOfWeek - 1 // Adjust for Monday start

    for (let i = startDay - 1; i >= 0; i--) {
      days.push({
        day: prevMonthDays - i,
        isCurrentMonth: false,
        isToday: false,
      })
    }

    // Current month days
    const today = new Date()
    for (let day = 1; day <= daysInMonth; day++) {
      const isToday =
        day === currentDate.getDate() && month === currentDate.getMonth() && year === currentDate.getFullYear()
      days.push({
        day,
        isCurrentMonth: true,
        isToday,
      })
    }

    // Next month days to fill the grid
    const remainingDays = 35 - days.length // 5 weeks * 7 days
    for (let day = 1; day <= remainingDays; day++) {
      days.push({
        day,
        isCurrentMonth: false,
        isToday: false,
      })
    }

    return days
  }

  const goToToday = () => {
    setCurrentDate(new Date(2025, 9, 10))
  }

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
  }

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
  }

  const calendarDays = generateCalendarDays()
  const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Filter Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-border bg-card px-3 sm:px-6 py-3">
        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
          <div className="relative shrink-0">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search calendar"
              className="pl-9 w-full sm:w-64 h-9 bg-muted/50 border-border"
            />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-9 bg-transparent shrink-0">
                <span className="hidden sm:inline">Assignee</span>
                <span className="sm:hidden">Assign</span>
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>All assignees</DropdownMenuItem>
              <DropdownMenuItem>Unassigned</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-9 bg-transparent shrink-0">
                Type
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>All types</DropdownMenuItem>
              <DropdownMenuItem>Epic</DropdownMenuItem>
              <DropdownMenuItem>Task</DropdownMenuItem>
              <DropdownMenuItem>Subtask</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-9 bg-transparent shrink-0 hidden sm:flex">
                Status
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>All statuses</DropdownMenuItem>
              <DropdownMenuItem>To Do</DropdownMenuItem>
              <DropdownMenuItem>In Progress</DropdownMenuItem>
              <DropdownMenuItem>Done</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-9 bg-transparent shrink-0 hidden md:flex">
                More filters
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>Priority</DropdownMenuItem>
              <DropdownMenuItem>Labels</DropdownMenuItem>
              <DropdownMenuItem>Due date</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Calendar Navigation */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
          <Button variant="outline" size="sm" className="h-9 bg-transparent" onClick={goToToday}>
            Today
          </Button>

          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="h-9 w-9" onClick={previousMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-9 w-9" onClick={nextMonth}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="text-sm font-medium text-foreground min-w-[100px] text-center">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-9 bg-transparent">
                {viewMode}
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setViewMode("Day")}>Day</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setViewMode("Week")}>Week</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setViewMode("Month")}>Month</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setViewMode("Quarter")}>Quarter</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="ghost" size="icon" className="h-9 w-9 hidden sm:flex">
            <CalendarIcon className="h-4 w-4" />
          </Button>

          <Button variant="ghost" size="icon" className="h-9 w-9 hidden md:flex">
            <Printer className="h-4 w-4" />
          </Button>

          <Button variant="ghost" size="icon" className="h-9 w-9 hidden lg:flex">
            <Settings2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="flex-1 overflow-auto p-3 sm:p-6">
        <div className="grid grid-cols-5 lg:grid-cols-7 gap-0 border border-border bg-card min-w-[600px]">
          {weekDays.slice(0, window.innerWidth >= 1024 ? 7 : 5).map((day) => (
            <div
              key={day}
              className="border-b border-r border-border bg-muted/30 px-2 sm:px-4 py-2 sm:py-3 text-center text-xs sm:text-sm font-medium text-muted-foreground last:border-r-0"
            >
              {day}
            </div>
          ))}

          {calendarDays.slice(0, 35).map((dayInfo, index) => {
            if (window.innerWidth < 1024 && index % 7 >= 5) return null

            return (
              <div
                key={index}
                className={`min-h-[80px] sm:min-h-[120px] border-b border-r border-border p-1 sm:p-2 last:border-r-0 ${
                  !dayInfo.isCurrentMonth ? "bg-muted/20" : "bg-card"
                } hover:bg-muted/50 transition-colors`}
              >
                <div className="flex justify-between items-start">
                  <span
                    className={`text-xs sm:text-sm font-medium ${
                      dayInfo.isToday
                        ? "bg-primary text-primary-foreground rounded-full h-5 w-5 sm:h-6 sm:w-6 flex items-center justify-center"
                        : dayInfo.isCurrentMonth
                          ? "text-foreground"
                          : "text-muted-foreground"
                    }`}
                  >
                    {dayInfo.isCurrentMonth && index < 7 ? `Oct ${dayInfo.day}` : dayInfo.day}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

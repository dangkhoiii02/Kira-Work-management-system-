"use client"

import { CheckCircle2, Edit3, FileText, Calendar, TrendingUp, Minus, ChevronDown } from "lucide-react"
import { Card } from "../components/ui/card"
import { Button } from "../components/ui/button"

const stats = [
  { label: "0 completed", sublabel: "in the last 7 days", icon: CheckCircle2 },
  { label: "0 updated", sublabel: "in the last 7 days", icon: Edit3 },
  { label: "0 created", sublabel: "in the last 7 days", icon: FileText },
  { label: "0 due soon", sublabel: "in the next 7 days", icon: Calendar },
]

const workTypes = [
  { type: "Epic", icon: "⚡", color: "text-purple-600", distribution: 0 },
  { type: "Task", icon: "✓", color: "text-blue-600", distribution: 0 },
  { type: "Subtask", icon: "🔗", color: "text-blue-600", distribution: 0 },
]

const priorities = [
  { label: "Highest", icon: TrendingUp, color: "text-red-600" },
  { label: "High", icon: TrendingUp, color: "text-orange-600" },
  { label: "Medium", icon: Minus, color: "text-yellow-600" },
  { label: "Low", icon: ChevronDown, color: "text-green-600" },
  { label: "Lowest", icon: ChevronDown, color: "text-blue-600" },
]

export function SummaryView() {
  return (
    <div className="p-3 sm:p-6 space-y-4 sm:space-y-6">
      {/* Filter Button */}
      <div>
        <Button variant="outline" className="gap-2 bg-transparent h-9 text-sm">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h18M3 12h12M3 20h6" />
          </svg>
          Filter
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card key={index} className="p-3 sm:p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start gap-2 sm:gap-3">
                <div className="p-1.5 sm:p-2 rounded-lg bg-muted shrink-0">
                  <Icon className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                </div>
                <div className="min-w-0">
                  <div className="font-semibold text-base sm:text-lg truncate">{stat.label}</div>
                  <div className="text-xs sm:text-sm text-muted-foreground">{stat.sublabel}</div>
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Status Overview */}
        <Card className="p-4 sm:p-6">
          <h2 className="text-base sm:text-lg font-semibold mb-2">Status overview</h2>
          <p className="text-xs sm:text-sm text-muted-foreground mb-6 sm:mb-8">
            The status overview for this project will display here after you{" "}
            <a href="#" className="text-blue-600 hover:underline">
              create some work items
            </a>
          </p>
          <div className="flex flex-col items-center justify-center py-8 sm:py-12">
            <div className="text-4xl sm:text-6xl font-bold text-foreground mb-2">0</div>
            <div className="text-xs sm:text-sm text-muted-foreground font-medium">Total work</div>
            <div className="text-xs sm:text-sm text-muted-foreground font-medium">items</div>
          </div>
        </Card>

        {/* Activity */}
        <Card className="p-4 sm:p-6 flex flex-col items-center justify-center">
          <div className="mb-4 sm:mb-6">
            <div className="relative w-20 h-20 sm:w-24 sm:h-24">
              <div className="absolute inset-0 bg-gray-200 rounded-lg"></div>
              <div className="absolute bottom-0 right-0 w-14 h-14 sm:w-16 sm:h-16 bg-blue-600 rounded-lg flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
            </div>
          </div>
          <h3 className="text-base sm:text-lg font-semibold mb-2">No activity yet</h3>
          <p className="text-xs sm:text-sm text-muted-foreground text-center max-w-md px-2">
            Create a few work items and invite some teammates to your project to see your project activity.
          </p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Priority Breakdown */}
        <Card className="p-4 sm:p-6">
          <h2 className="text-base sm:text-lg font-semibold mb-2">Priority breakdown</h2>
          <p className="text-xs sm:text-sm text-muted-foreground mb-4 sm:mb-6">
            Get a holistic view of how work is being prioritized.{" "}
            <a href="#" className="text-blue-600 hover:underline">
              How to manage priorities for projects
            </a>
          </p>
          <div className="relative h-40 sm:h-48 border-l border-b border-border">
            {/* Y-axis labels */}
            <div className="absolute -left-6 sm:-left-8 top-0 text-xs text-muted-foreground">1</div>
            <div className="absolute -left-6 sm:-left-8 top-1/2 text-xs text-muted-foreground">0.5</div>
            <div className="absolute -left-6 sm:-left-8 bottom-0 text-xs text-muted-foreground">0</div>

            {/* X-axis labels */}
            <div className="absolute -bottom-8 left-0 right-0 flex justify-between px-2 sm:px-4">
              {priorities.map((priority, index) => {
                const Icon = priority.icon
                return (
                  <div key={index} className="flex items-center gap-0.5 sm:gap-1 text-xs">
                    <Icon className={`h-3 w-3 ${priority.color}`} />
                    <span className={`${priority.color} hidden sm:inline`}>{priority.label}</span>
                    <span className={`${priority.color} sm:hidden`}>{priority.label.slice(0, 3)}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </Card>

        {/* Types of Work */}
        <Card className="p-4 sm:p-6">
          <h2 className="text-base sm:text-lg font-semibold mb-2">Types of work</h2>
          <p className="text-xs sm:text-sm text-muted-foreground mb-4 sm:mb-6">
            Create some work items to view a breakdown of total work by work type.{" "}
            <a href="#" className="text-blue-600 hover:underline">
              What are work types?
            </a>
          </p>
          <div className="space-y-3 sm:space-y-4">
            <div className="grid grid-cols-[80px_1fr] sm:grid-cols-[100px_1fr] gap-3 sm:gap-4 text-xs sm:text-sm font-medium text-muted-foreground mb-2">
              <div>Type</div>
              <div>Distribution</div>
            </div>
            {workTypes.map((workType, index) => (
              <div
                key={index}
                className="grid grid-cols-[80px_1fr] sm:grid-cols-[100px_1fr] gap-3 sm:gap-4 items-center"
              >
                <div className="flex items-center gap-1 sm:gap-2">
                  <span className={workType.color}>{workType.icon}</span>
                  <span className="text-xs sm:text-sm">{workType.type}</span>
                </div>
                <div className="h-6 sm:h-8 bg-muted rounded"></div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}

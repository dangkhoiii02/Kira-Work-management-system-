"use client"

import { Plus, Check } from "lucide-react"
import { Button } from "../components/ui/button"
import { Card } from "../components/ui/card"
import type { Column } from "../components/kanban-board"

interface KanbanColumnProps {
  column: Column
  onAddTask: () => void
}

export function KanbanColumn({ column, onAddTask }: KanbanColumnProps) {
  const isDone = column.id === "done"

  return (
    <div className="flex w-80 shrink-0 flex-col rounded-lg bg-muted/50">
      <div className="flex items-center justify-between p-3 border-b border-border">
        <div className="flex items-center gap-2">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{column.title}</h3>
          {isDone && <Check className="h-4 w-4 text-green-600" />}
        </div>
      </div>

      <div className="flex-1 space-y-2 p-3">
        {column.tasks.map((task) => (
          <Card key={task.id} className="p-3 cursor-pointer hover:shadow-md transition-shadow bg-card">
            <p className="text-sm font-medium text-foreground">{task.title}</p>
            {task.description && <p className="mt-1 text-xs text-muted-foreground">{task.description}</p>}
          </Card>
        ))}

        <Button
          variant="ghost"
          className="w-full justify-start text-muted-foreground hover:text-foreground"
          onClick={onAddTask}
        >
          <Plus className="mr-2 h-4 w-4" />
          Create
        </Button>
      </div>
    </div>
  )
}

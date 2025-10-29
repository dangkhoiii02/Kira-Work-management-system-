"use client"

import { useEffect, useMemo, useState } from "react"
import { Search, Plus, MoreHorizontal } from "lucide-react"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../components/ui/dropdown-menu"
import { Checkbox } from "../components/ui/checkbox"
import { beCreateTask, beAssignByEmail, beListByProject } from "../lib/be"

type FE_Task = {
  id: number
  title: string
  percent_done?: number
  status_name?: string
  priority_name?: string
  assignee_name?: string
  due_date?: string
}

interface ListViewProps {
  projectId?: number
  user: { id: number; nick_name: string; email: string }
}

export function ListView({ projectId, user }: ListViewProps) {
  const [hasItems, setHasItems] = useState(false)
  const [items, setItems] = useState<FE_Task[]>([])
  const [creating, setCreating] = useState(false)
  const [title, setTitle] = useState("")
  const [assigneeEmail, setAssigneeEmail] = useState("")
  const [dueDate, setDueDate] = useState("")
  const [priority, setPriority] = useState<"LOW" | "MEDIUM" | "HIGH" | "URGENT">("MEDIUM")
  const [status, setStatus] = useState<"OPEN" | "IN_PROGRESS" | "DONE">("OPEN")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const statusId = useMemo(() => ({ OPEN: 1, IN_PROGRESS: 2, DONE: 3 }[status]), [status])
  const priorityId = useMemo(() => ({ LOW: 1, MEDIUM: 2, HIGH: 3, URGENT: 4 }[priority]), [priority])

  async function load() {
    if (!projectId) return
    try {
      const res = await beListByProject(projectId, 1, 100)
      setItems(res.items as any)
      setHasItems((res.items?.length ?? 0) > 0)
    } catch (e: any) {
      console.error(e)
      setError(e?.message || "Load failed")
    }
  }

  useEffect(() => {
    if (projectId) load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId])

  function toIsoDateOnly(d: string) {
    if (!d) return undefined
    try {
      const dt = new Date(d + "T00:00:00")
      return dt.toISOString()
    } catch {
      return undefined
    }
  }

  async function handleCreate() {
    if (!title.trim()) {
      setError("Please fill the title")
      return
    }
    if (!projectId) {
      setError("Missing projectId (login did not return project)")
      return
    }

    setLoading(true)
    setError(null)
    try {
      const payload = {
        project_id: projectId,
        title: title.trim(),
        status_id: statusId!,
        priority_id: priorityId!,
        creator_id: user.id,
        due_date: toIsoDateOnly(dueDate),
      }

      const newTask = await beCreateTask(payload as any)

      if (assigneeEmail.trim()) {
        await beAssignByEmail(newTask.id ?? newTask?.task_id ?? newTask?.data?.id, assigneeEmail.trim())
      }

      await load()

      setTitle("")
      setAssigneeEmail("")
      setDueDate("")
      setCreating(false)
      setHasItems(true)
    } catch (e: any) {
      setError(e?.message || "Create failed")
    } finally {
      setLoading(false)
    }
  }

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
            <AvatarFallback className="bg-blue-500 text-white text-xs">
              {(user.nick_name?.slice(0, 2) || "U").toUpperCase()}
            </AvatarFallback>
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
          {/* Header */}
          <div className="border-b border-border bg-muted/30">
            <div className="grid grid-cols-[40px_80px_100px_1fr_120px_120px_120px_100px_100px_120px_40px] gap-4 px-6 py-3 text-xs font-medium text-muted-foreground">
              <div className="flex items-center"><Checkbox /></div>
              <div>Type</div>
              <div>Key</div>
              <div>Summary</div>
              <div>Status</div>
              <div>Assignee</div>
              <div>Due date</div>
              <div>Priority</div>
              <div>Comments</div>
              <div>Labels</div>
              <div className="flex justify-center"><Plus className="h-4 w-4" /></div>
            </div>
          </div>

          {/* Create Button Row */}
          <div className="border-b border-border px-6 py-3">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 text-muted-foreground hover:text-foreground"
              onClick={() => {
                setCreating(true)
                setHasItems(true)
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Create
            </Button>
          </div>

          {/* Create Row */}
          {creating && (
            <div className="grid grid-cols-[40px_80px_100px_1fr_120px_120px_120px_100px_100px_120px_40px] gap-4 px-6 py-3 border-b items-center">
              <div />
              <div>Task</div>
              <div>—</div>
              <div>
                <Input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
              </div>
              <div>
                <select className="w-full h-9 border rounded px-2" value={status} onChange={(e) => setStatus(e.target.value as any)}>
                  <option value="OPEN">Open</option>
                  <option value="IN_PROGRESS">In progress</option>
                  <option value="DONE">Done</option>
                </select>
              </div>
              <div>
                <Input placeholder="Assignee email" value={assigneeEmail} onChange={(e) => setAssigneeEmail(e.target.value)} />
              </div>
              <div>
                <Input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
              </div>
              <div>
                <select className="w-full h-9 border rounded px-2" value={priority} onChange={(e) => setPriority(e.target.value as any)}>
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                  <option value="URGENT">Urgent</option>
                </select>
              </div>
              <div>—</div>
              <div>—</div>
              <div className="flex justify-center">
                <Button size="sm" onClick={handleCreate} disabled={loading || !title.trim()}>
                  {loading ? "Saving..." : "Save"}
                </Button>
              </div>
            </div>
          )}

          {/* Data rows */}
          {items.map((it) => (
            <div key={it.id} className="grid grid-cols-[40px_80px_100px_1fr_120px_120px_120px_100px_100px_120px_40px] gap-4 px-6 py-3 border-b items-center">
              <div><Checkbox /></div>
              <div>Task</div>
              <div>#{it.id}</div>
              <div className="truncate">{it.title}</div>
              <div>{it.status_name || "—"}</div>
              <div>{it.assignee_name || "—"}</div>
              <div>{it.due_date ? new Date(it.due_date).toLocaleDateString() : "—"}</div>
              <div>{it.priority_name || "—"}</div>
              <div>—</div>
              <div>—</div>
              <div />
            </div>
          ))}
        </div>

        {!hasItems && (
          <div className="flex flex-col items-center justify-center py-12 sm:py-20 px-4 sm:px-6">
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

      {error && <div className="px-6 py-2 text-sm text-red-600">{error}</div>}
    </div>
  )
}

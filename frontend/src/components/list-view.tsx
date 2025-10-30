"use client"

import { useEffect, useMemo, useState } from "react"
import { Search, Plus, MoreHorizontal, Send } from "lucide-react"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../components/ui/dropdown-menu"
import { Checkbox } from "../components/ui/checkbox"
import { Label } from "../components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog"

import { beCreateTask, beAssignByEmail, beListByProject, beUpdateProgress } from "../lib/be"

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

  // modal: create task
  const [taskOpen, setTaskOpen] = useState(false)

  // form create
  const [title, setTitle] = useState("")
  const [dueDate, setDueDate] = useState("")
  const [priority, setPriority] = useState<"LOW" | "MEDIUM" | "HIGH" | "URGENT">("MEDIUM")
  const [status, setStatus] = useState<"OPEN" | "IN_PROGRESS" | "DONE">("OPEN")

  // modal: assign by email
  const [assignOpen, setAssignOpen] = useState(false)
  const [assignTaskId, setAssignTaskId] = useState<number | null>(null)
  const [assignEmail, setAssignEmail] = useState("")
  const [assignLoading, setAssignLoading] = useState(false)
  const [assignError, setAssignError] = useState<string | null>(null)
  const [assignOK, setAssignOK] = useState<string | null>(null)

  // misc
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // per-row save state
  const [saving, setSaving] = useState<Record<number, boolean>>({})
  const [rowErr, setRowErr] = useState<Record<number, string | undefined>>({})

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
    try { return new Date(d + "T00:00:00").toISOString() } catch { return undefined }
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
      await beCreateTask(payload as any)
      await load()

      // reset & close
      setTitle("")
      setDueDate("")
      setStatus("OPEN")
      setPriority("MEDIUM")
      setTaskOpen(false)
      setHasItems(true)
    } catch (e: any) {
      setError(e?.message || "Create failed")
    } finally {
      setLoading(false)
    }
  }

  // ===== Progress helpers =====
  function setLocalProgress(taskId: number, p: number) {
    setItems((prev) => prev.map((t) => (t.id === taskId ? { ...t, percent_done: p } : t)))
  }

  async function saveProgress(taskId: number, p: number) {
    setSaving((s) => ({ ...s, [taskId]: true }))
    setRowErr((r) => ({ ...r, [taskId]: undefined }))
    try {
      await beUpdateProgress(taskId, p)
    } catch (e: any) {
      setRowErr((r) => ({ ...r, [taskId]: e?.message || "Failed to update progress" }))
    } finally {
      setSaving((s) => ({ ...s, [taskId]: false }))
    }
  }

  function onProgressCommit(taskId: number, p: number) {
    const val = Math.max(0, Math.min(100, Math.round(p)))
    setLocalProgress(taskId, val)
    saveProgress(taskId, val)
  }

  // ===== Assign helpers =====
  function openAssign(taskId: number) {
    setAssignTaskId(taskId)
    setAssignEmail("")
    setAssignError(null)
    setAssignOK(null)
    setAssignOpen(true)
  }

  async function submitAssign() {
    if (!assignTaskId) return
    if (!assignEmail.trim()) {
      setAssignError("Vui lòng nhập email")
      return
    }
    setAssignLoading(true)
    setAssignError(null)
    setAssignOK(null)
    try {
      await beAssignByEmail(assignTaskId, assignEmail.trim())
      setAssignOK("Giao việc thành công")
      await load()
      setTimeout(() => setAssignOpen(false), 400)
    } catch (e: any) {
      setAssignError(e?.message || "Giao việc thất bại")
    } finally {
      setAssignLoading(false)
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
            <div className="grid grid-cols-[40px_80px_100px_1fr_120px_120px_120px_100px_120px_160px_40px] gap-4 px-6 py-3 text-xs font-medium text-muted-foreground">
              <div className="flex items-center"><Checkbox /></div>
              <div>Type</div>
              <div>Key</div>
              <div>Summary</div>
              <div>Status</div>
              <div>Assignee</div>
              <div>Due date</div>
              <div>Priority</div>
              <div>Assign</div>
              <div>Progress</div>
              <div className="flex justify-center"><Plus className="h-4 w-4" /></div>
            </div>
          </div>

          {/* Create Button Row */}
          <div className="border-b border-border px-6 py-3">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 text-muted-foreground hover:text-foreground"
              onClick={() => setTaskOpen(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Create
            </Button>
          </div>

          {/* Data rows */}
          {items.map((it) => {
            const p = it.percent_done ?? 0
            const isSaving = !!saving[it.id]
            const err = rowErr[it.id]
            return (
              <div
                key={it.id}
                className="grid grid-cols-[40px_80px_100px_1fr_120px_120px_120px_100px_120px_160px_40px] gap-4 px-6 py-3 border-b items-center"
              >
                <div><Checkbox /></div>
                <div>Task</div>
                <div>#{it.id}</div>
                <div className="truncate">{it.title}</div>
                <div>{it.status_name || "—"}</div>
                <div>{it.assignee_name || "—"}</div>
                <div>{it.due_date ? new Date(it.due_date).toLocaleDateString() : "—"}</div>
                <div>{it.priority_name || "—"}</div>

                {/* Assign cell */}
                <div>
                  <Button variant="outline" size="sm" className="h-8 gap-2" onClick={() => openAssign(it.id)}>
                    <Send className="w-4 h-4" />
                    Assign
                  </Button>
                </div>

                {/* Progress cell */}
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={p}
                    onChange={(e) => setLocalProgress(it.id, Number(e.target.value))}
                    onPointerUp={(e) => onProgressCommit(it.id, Number((e.target as HTMLInputElement).value))}
                    onBlur={(e) => onProgressCommit(it.id, Number((e.target as HTMLInputElement).value))}
                    className="w-28"
                  />
                  <span className="w-10 text-right tabular-nums">{p}%</span>
                  {isSaving && <span className="text-xs text-muted-foreground">Saving…</span>}
                  {!isSaving && err && <span className="text-xs text-red-600">{err}</span>}
                </div>

                <div />
              </div>
            )
          })}
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

      {/* ===== Create Task Modal (KHÔNG có ô Assignee) ===== */}
      <Dialog open={taskOpen} onOpenChange={setTaskOpen}>
        <DialogContent className="sm:max-w-[560px]">
          <DialogHeader>
            <DialogTitle>Create task</DialogTitle>
            <DialogDescription>Fill the fields below to add a new task to this project.</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-2">
            <div className="grid grid-cols-4 items-center gap-3">
              <Label htmlFor="title" className="text-right">Title</Label>
              <Input
                id="title"
                className="col-span-3"
                placeholder="Short, clear summary"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-3">
              <Label htmlFor="status" className="text-right">Status</Label>
              <select
                id="status"
                className="col-span-3 h-9 border rounded px-2 bg-background"
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
              >
                <option value="OPEN">Open</option>
                <option value="IN_PROGRESS">In progress</option>
                <option value="DONE">Done</option>
              </select>
            </div>

            <div className="grid grid-cols-4 items-center gap-3">
              <Label htmlFor="due" className="text-right">Due date</Label>
              <Input
                id="due"
                type="date"
                className="col-span-3"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-3">
              <Label htmlFor="priority" className="text-right">Priority</Label>
              <select
                id="priority"
                className="col-span-3 h-9 border rounded px-2 bg-background"
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="URGENT">Urgent</option>
              </select>
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setTaskOpen(false)} disabled={loading}>
              Cancel
            </Button>
            <Button onClick={handleCreate} disabled={loading || !title.trim()}>
              {loading ? "Saving..." : "Save task"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ===== Assign by Email Modal ===== */}
      <Dialog open={assignOpen} onOpenChange={setAssignOpen}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle>Giao việc qua email</DialogTitle>
            <DialogDescription>Nhập email người được giao. </DialogDescription>
          </DialogHeader>

          <div className="grid gap-3 py-2">
            <div className="grid grid-cols-4 items-center gap-3">
              <Label htmlFor="ass-email" className="text-right">Email</Label>
              <Input
                id="ass-email"
                className="col-span-3"
                placeholder="ooad.ptithcm@gmail.com"
                value={assignEmail}
                onChange={(e) => setAssignEmail(e.target.value)}
              />
            </div>
            {assignError && <p className="text-sm text-red-600">{assignError}</p>}
            {assignOK && <p className="text-sm text-green-600">{assignOK}</p>}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setAssignOpen(false)} disabled={assignLoading}>
              Close
            </Button>
            <Button onClick={submitAssign} disabled={assignLoading || !assignEmail.trim()}>
              {assignLoading ? "Assigning…" : "Assign"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

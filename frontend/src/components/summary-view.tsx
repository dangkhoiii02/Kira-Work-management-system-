"use client"

import { useEffect, useMemo, useState } from "react"
import { CheckCircle2, RefreshCcw, Clock4, TrendingUp, AlertTriangle } from "lucide-react"
import { Card } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { beListByProject } from "../lib/be"

type FE_Task = {
  id: number
  title?: string
  percent_done?: number
  created_at?: string
  updated_at?: string
  due_date?: string
  priority_name?: string
  assignee_name?: string
}

interface SummaryViewProps {
  projectId?: number
}

function ProgressBar({ value }: { value: number }) {
  const v = Math.max(0, Math.min(100, Math.round(value || 0)))
  return (
    <div className="h-2 w-full bg-muted rounded">
      <div
        className="h-full bg-blue-600 rounded"
        style={{ width: `${v}%` }}
        aria-valuenow={v}
        aria-valuemin={0}
        aria-valuemax={100}
      />
    </div>
  )
}

export function SummaryView({ projectId }: SummaryViewProps) {
  const [items, setItems] = useState<FE_Task[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function load() {
    if (!projectId) return
    setLoading(true)
    setError(null)
    try {
      const res = await beListByProject(projectId, 1, 500)
      setItems((res.items as any) || [])
    } catch (e: any) {
      setError(e?.message || "Failed to load tasks")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId])

  // ===== KPIs =====
  const now = Date.now()
  const weekMs = 7 * 24 * 3600 * 1000
  const next7 = now + weekMs
  const weekAgo = now - weekMs

  const total = items.length
  const avgProgress = useMemo(() => {
    if (!total) return 0
    const sum = items.reduce((s, t) => s + (t.percent_done ?? 0), 0)
    return sum / total
  }, [items, total])

  const completed = useMemo(() => items.filter((t) => (t.percent_done ?? 0) >= 100), [items])
  const updated7 = useMemo(
    () =>
      items.filter((t) => {
        const u = t.updated_at ? Date.parse(t.updated_at) : 0
        return u && u >= weekAgo
      }),
    [items, weekAgo]
  )
  const dueSoon = useMemo(
    () =>
      items.filter((t) => {
        const d = t.due_date ? Date.parse(t.due_date) : 0
        return d && d >= now && d <= next7
      }),
    [items, now, next7]
  )

  // Phân bố theo mức tiến độ
  const buckets = useMemo(() => {
    const B = { b0: 0, b25: 0, b50: 0, b75: 0, b99: 0, b100: 0 }
    items.forEach((t) => {
      const p = t.percent_done ?? 0
      if (p >= 100) B.b100++
      else if (p >= 76) B.b99++
      else if (p >= 51) B.b75++
      else if (p >= 26) B.b50++
      else if (p >= 1) B.b25++
      else B.b0++
    })
    return B
  }, [items])

  // Top chậm: tiến độ thấp, còn <= 7 ngày, sort theo due_date gần nhất
  const topLagging = useMemo(() => {
    return items
      .filter((t) => {
        const d = t.due_date ? Date.parse(t.due_date) : 0
        const p = t.percent_done ?? 0
        return d && d >= now && d <= next7 && p < 60
      })
      .sort((a, b) => (Date.parse(a.due_date || "") || 0) - (Date.parse(b.due_date || "") || 0))
      .slice(0, 5)
  }, [items, now, next7])

  // Top cập nhật gần nhất
  const topUpdated = useMemo(() => {
    return items
      .filter((t) => t.updated_at)
      .sort((a, b) => (Date.parse(b.updated_at || "") || 0) - (Date.parse(a.updated_at || "") || 0))
      .slice(0, 5)
  }, [items])

  return (
    <div className="p-3 sm:p-6 space-y-4 sm:space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="outline" className="gap-2 bg-transparent h-9 text-sm" onClick={load} disabled={loading}>
          <RefreshCcw className="w-4 h-4" />
          {loading ? "Refreshing…" : "Refresh"}
        </Button>
        {error && <span className="text-sm text-red-600">{error}</span>}
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Card className="p-4">
          <div className="text-sm text-muted-foreground mb-2">Avg. progress</div>
          <div className="flex items-end gap-2">
            <div className="text-2xl font-semibold">{avgProgress.toFixed(0)}%</div>
            <TrendingUp className="w-4 h-4 text-muted-foreground mb-1" />
          </div>
          <div className="mt-3">
            <ProgressBar value={avgProgress} />
          </div>
        </Card>

        <Card className="p-4">
          <div className="text-sm text-muted-foreground mb-2">Completed</div>
          <div className="flex items-center gap-2">
            <div className="text-2xl font-semibold">{completed.length}</div>
            <CheckCircle2 className="w-5 h-5 text-green-600" />
          </div>
          <div className="text-xs text-muted-foreground mt-1">{total} total tasks</div>
        </Card>

        <Card className="p-4">
          <div className="text-sm text-muted-foreground mb-2">Updated (7 days)</div>
          <div className="flex items-center gap-2">
            <div className="text-2xl font-semibold">{updated7.length}</div>
            <Clock4 className="w-5 h-5 text-blue-600" />
          </div>
          <div className="text-xs text-muted-foreground mt-1">recent activity</div>
        </Card>

        <Card className="p-4">
          <div className="text-sm text-muted-foreground mb-2">Due soon (≤ 7 days)</div>
          <div className="flex items-center gap-2">
            <div className="text-2xl font-semibold">{dueSoon.length}</div>
            <AlertTriangle className="w-5 h-5 text-orange-600" />
          </div>
          <div className="text-xs text-muted-foreground mt-1">need attention</div>
        </Card>
      </div>

      {/* Distribution & Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Distribution */}
        <Card className="p-4 sm:p-6">
          <h2 className="text-base sm:text-lg font-semibold mb-3">Phân bố tiến độ</h2>
          <div className="space-y-3">
            {[
              { label: "0%", val: buckets.b0 },
              { label: "1–25%", val: buckets.b25 },
              { label: "26–50%", val: buckets.b50 },
              { label: "51–75%", val: buckets.b75 },
              { label: "76–99%", val: buckets.b99 },
              { label: "100%", val: buckets.b100 },
            ].map((row, i) => {
              const totalBar = Math.max(1, total)
              const pct = (row.val / totalBar) * 100
              return (
                <div key={i} className="grid grid-cols-[80px_1fr_60px] items-center gap-3 text-sm">
                  <div className="text-muted-foreground">{row.label}</div>
                  <div className="h-2 bg-muted rounded">
                    <div className="h-full bg-blue-600 rounded" style={{ width: `${pct}%` }} />
                  </div>
                  <div className="text-right tabular-nums">{row.val}</div>
                </div>
              )
            })}
          </div>
          <div className="text-xs text-muted-foreground mt-3">Tổng: {total} task</div>
        </Card>

        {/* Top lagging */}
        <Card className="p-4 sm:p-6">
          <h2 className="text-base sm:text-lg font-semibold mb-3">Đang chậm (sắp đến hạn)</h2>
          <div className="space-y-3">
            {topLagging.length === 0 && <div className="text-sm text-muted-foreground">Không có mục nào.</div>}
            {topLagging.map((t) => {
              const d = t.due_date ? new Date(t.due_date) : null
              return (
                <div key={t.id} className="flex items-center gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="font-medium truncate">{t.title || `#${t.id}`}</div>
                    <div className="text-xs text-muted-foreground">
                      {d ? `Due ${d.toLocaleDateString()}` : "No due date"} · {t.assignee_name || "Unassigned"}
                    </div>
                    <div className="mt-2"><ProgressBar value={t.percent_done ?? 0} /></div>
                  </div>
                  <div className="w-12 text-right tabular-nums">{Math.round(t.percent_done ?? 0)}%</div>
                </div>
              )
            })}
          </div>
        </Card>
      </div>

      {/* Recently updated */}
      <Card className="p-4 sm:p-6">
        <h2 className="text-base sm:text-lg font-semibold mb-3">Cập nhật gần đây</h2>
        <div className="space-y-3">
          {topUpdated.length === 0 && <div className="text-sm text-muted-foreground">Chưa có hoạt động.</div>}
          {topUpdated.map((t) => {
            const u = t.updated_at ? new Date(t.updated_at) : null
            return (
              <div key={t.id} className="grid grid-cols-1 sm:grid-cols-[1fr_120px_120px] gap-2 sm:gap-4 items-center">
                <div className="min-w-0">
                  <div className="font-medium truncate">{t.title || `#${t.id}`}</div>
                  <div className="text-xs text-muted-foreground">
                    {t.assignee_name || "Unassigned"} · Priority {t.priority_name || "—"}
                  </div>
                </div>
                <div className="hidden sm:block"><ProgressBar value={t.percent_done ?? 0} /></div>
                <div className="text-xs text-muted-foreground sm:text-right">
                  {u ? u.toLocaleString() : "—"}
                </div>
              </div>
            )
          })}
        </div>
      </Card>
    </div>
  )
}

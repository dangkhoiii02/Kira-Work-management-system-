// FE-only BE client (fetch). Không export type Task để tránh lỗi “does not provide an export named 'Task'”.

const BASE =
  (import.meta as any)?.env?.VITE_API_BASE?.replace(/\/+$/, "") ||
  "http://localhost:3000/api"; // nhớ set VITE_API_BASE trong .env.local

type Json = Record<string, any>;

/** Generic HTTP wrapper */
async function http<T = any>(
  path: string,
  opts: RequestInit & { query?: Record<string, string | number | boolean | undefined> } = {}
): Promise<T> {
  const url = new URL(`${BASE}${path}`);
  if (opts.query) {
    Object.entries(opts.query).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== "") url.searchParams.set(k, String(v));
    });
  }

  const resp = await fetch(url.toString(), {
    method: opts.method || "GET",
    headers: {
      "Content-Type": "application/json",
      ...(opts.headers || {}),
    },
    credentials: "include", // cần cho cookie JWT
    body: opts.body,
  });

  const text = await resp.text();
  let data: any = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text; // non-JSON
  }

  if (!resp.ok) {
    const msg = (data && (data.message || data.error)) || `HTTP ${resp.status}`;
    console.error("HTTP ERROR", resp.status, msg, "→", { path, url: url.toString(), data });
    throw new Error(msg);
  }
  return data as T;
}

/* ========= TYPES ========= */

export interface User {
  id: number;
  nick_name: string;
  email: string;
  username?: string | null;
  avatar?: string | null;
  created_at: string;
}

export interface Project {
  id: number;
  name: string;
  code: string;
  owner_id: number;
  created_at: string;
}

/* ========= AUTH ========= */

/** Đăng ký → { user, project } */
export async function beRegister(payload: {
  nick_name: string;
  email: string;
  password: string;
  avatar?: string;
  username?: string;
}): Promise<{ user: User; project: Project }> {
  return http<{ user: User; project: Project }>("/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

/** Đăng nhập → { user, project } */
export async function beLogin(payload: {
  email: string;
  password: string;
}): Promise<{ user: User; project?: Project | null }> {
  return http<{ user: User; project?: Project | null }>("/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

/* ========= TASKS ========= */

export type CreateTaskInput = {
  project_id: number;
  title: string;
  description?: string;
  status_id?: number;
  priority_id?: number;
  percent_done?: number;
  start_date?: string; // ISO
  due_date?: string; // ISO
  implementer_id?: number;
  creator_id?: number;
};

export async function beCreateTask(payload: CreateTaskInput) {
  return http<any>("/tasks", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function beAssignByEmail(taskId: number, assigneeEmail: string) {
  if (!assigneeEmail) return { ok: true };
  return http<any>(`/tasks/${taskId}/assign-email`, {
    method: "POST",
    body: JSON.stringify({ email: assigneeEmail }),
  });
}

export async function beListByProject(projectId: number, page = 1, limit = 50) {
  return http<{ items: any[]; total: number }>(`/tasks/project/${projectId}`, {
    method: "GET",
    query: { page, limit },
  });
}

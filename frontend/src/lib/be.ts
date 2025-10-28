import { api } from "./api";

export type User = { id: number; nick_name: string; email: string; created_at: string };
export type Task = { id: number; title: string; percent_done: number; status_name?: string; priority_name?: string; assignee_name?: string };

export async function register(payload: {nick_name:string; email:string; username?:string; password:string}) {
  const { data } = await api.post("/auth/register", payload);
  return data as { user: User; project?: { id:number; name:string } };
}

export async function login(payload: {email:string; password:string}) {
  const { data } = await api.post("/auth/login", payload);
  return data as { user: User };
}

export async function logout() {
  await api.post("/auth/logout");
}

export async function createTask(p: {project_id:number; title:string; description?:string; status_id:number; priority_id?:number; creator_id:number;}) {
  const { data } = await api.post("/tasks", p);
  return data as Task;
}

export async function assignByEmail(taskId:number, email:string) {
  const { data } = await api.post(`/tasks/${taskId}/assign-email`, { email });
  return data;
}

export async function updateProgress(taskId:number, percent:number) {
  const { data } = await api.patch(`/tasks/${taskId}/progress`, { percent_done: percent });
  return data as Task;
}

export async function listByProject(projectId:number, page=1, pageSize=20) {
  const { data } = await api.get(`/tasks/project/${projectId}?page=${page}&page_size=${pageSize}`);
  return data as { items: Task[]; pageInfo: { total:number } };
}

import type { Task } from "@/types/task";

export const TASK_STORAGE_KEY = "taskflow-tasks";

type StorageFailure = { ok: false; reason: "invalid" | "unavailable" };
type ReadResult = { ok: true; tasks: Task[] } | StorageFailure;
type WriteResult = { ok: true } | StorageFailure;

function isTask(value: unknown): value is Task {
  if (typeof value !== "object" || value === null) return false;
  const task = value as Record<string, unknown>;
  return typeof task.id === "string" && task.id.trim().length > 0
    && typeof task.title === "string" && task.title.trim().length > 0
    && typeof task.description === "string"
    && (task.priority === "Alta" || task.priority === "Media" || task.priority === "Baja")
    && typeof task.completed === "boolean"
    && typeof task.createdAt === "string" && Number.isFinite(Date.parse(task.createdAt));
}

function isTaskList(value: unknown): value is Task[] {
  return Array.isArray(value) && value.every(isTask)
    && new Set(value.map((task) => task.id)).size === value.length;
}

export function readTasks(): ReadResult {
  let raw: string | null;
  try {
    // Browser access is deferred until this function is called after mounting.
    if (typeof window === "undefined") return { ok: false, reason: "unavailable" };
    raw = window.localStorage.getItem(TASK_STORAGE_KEY);
  } catch {
    return { ok: false, reason: "unavailable" };
  }

  if (raw === null) return { ok: true, tasks: [] };
  try {
    const value: unknown = JSON.parse(raw);
    return isTaskList(value)
      ? { ok: true, tasks: value }
      : { ok: false, reason: "invalid" };
  } catch {
    return { ok: false, reason: "invalid" };
  }
}

export function writeTasks(tasks: readonly Task[]): WriteResult {
  if (!isTaskList(tasks)) return { ok: false, reason: "invalid" };
  try {
    if (typeof window === "undefined") return { ok: false, reason: "unavailable" };
    window.localStorage.setItem(TASK_STORAGE_KEY, JSON.stringify(tasks));
    return { ok: true };
  } catch {
    return { ok: false, reason: "unavailable" };
  }
}

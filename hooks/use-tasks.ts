"use client";

import { useEffect, useRef, useState } from "react";
import type { Task, TaskInput } from "@/types/task";
import { readTasks, writeTasks } from "@/lib/task-storage";

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [storageWarning, setStorageWarning] = useState<string | null>(null);
  const currentTasks = useRef<Task[]>([]);
  const loaded = useRef(false);
  const canWrite = useRef(false);

  useEffect(() => {
    let active = true;

    // Defer restoration until after mounting; cancellation also handles Strict Mode.
    async function restoreTasks() {
      await Promise.resolve();
      if (!active) return;

      const result = readTasks();
      if (result.ok) {
        currentTasks.current = result.tasks;
        setTasks(result.tasks);
        canWrite.current = true;
      } else {
        // Preserve existing storage when it could not be read or validated.
        canWrite.current = false;
        setStorageWarning(result.reason === "invalid"
          ? "Hay datos guardados que no pudimos recuperar. Los conservamos sin sobrescribirlos. Puedes trabajar durante esta sesión, pero los cambios no se guardarán."
          : "No pudimos acceder a las tareas guardadas. Puedes trabajar durante esta sesión, pero los cambios podrían no conservarse.");
      }
      loaded.current = true;
      setIsLoading(false);
    }

    void restoreTasks();
    return () => { active = false; };
  }, []);

  function commitTasks(next: Task[]) {
    // Keep event handlers current without putting storage side effects in a state updater.
    currentTasks.current = next;
    setTasks(next);
    if (!canWrite.current) return;

    const result = writeTasks(next);
    setStorageWarning(result.ok ? null
      : "No pudimos guardar los últimos cambios en este navegador. Puedes seguir trabajando, pero los cambios podrían no conservarse al cerrar o recargar.");
  }

  function saveTask(input: TaskInput, editingId?: string) {
    const values = { ...input, title: input.title.trim(), description: input.description.trim() };
    if (!loaded.current || !values.title) return false;

    if (editingId) {
      commitTasks(currentTasks.current.map((task) =>
        task.id === editingId ? { ...task, ...values } : task,
      ));
    } else {
      const task: Task = {
        ...values,
        id: crypto.randomUUID(),
        completed: false,
        createdAt: new Date().toISOString(),
      };
      commitTasks([task, ...currentTasks.current]);
    }
    return true;
  }

  function deleteTask(id: string) {
    if (!loaded.current) return;
    commitTasks(currentTasks.current.filter((task) => task.id !== id));
  }

  function toggleTask(id: string) {
    if (!loaded.current) return;
    commitTasks(currentTasks.current.map((task) =>
      task.id === id ? { ...task, completed: !task.completed } : task,
    ));
  }

  return { tasks, isLoading, storageWarning, saveTask, deleteTask, toggleTask };
}

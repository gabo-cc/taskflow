"use client";

import { useRef, useState } from "react";
import { ArrowUpRight, CheckCheck, Info, LayoutGrid, Plus } from "lucide-react";
import type { Task, TaskInput } from "@/types/task";
import { useTasks } from "@/hooks/use-tasks";
import { TaskForm } from "./task-form";
import { TaskList } from "./task-list";
import { TaskStats } from "./task-stats";

export function TaskDashboard() {
  const { tasks, isLoading, storageWarning, saveTask, deleteTask, toggleTask } = useTasks();
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string>();
  const [message, setMessage] = useState("");
  const createButton = useRef<HTMLButtonElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);
  const editingTask = tasks.find((task) => task.id === editingId);

  function openForm(task?: Task) {
    if (isLoading) return;
    returnFocus.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    setEditingId(task?.id);
    setFormOpen(true);
    setMessage("");
    // Also focus when the currently open form is reused for the same task.
    if (formOpen && editingId === task?.id) {
      document.getElementById("task-form")?.scrollIntoView({ block: "start" });
      document.getElementById("task-title")?.focus({ preventScroll: true });
    }
  }

  function closeForm() {
    setFormOpen(false);
    setEditingId(undefined);
    const target = returnFocus.current;
    if (target?.isConnected) target.focus({ preventScroll: true });
    else createButton.current?.focus({ preventScroll: true });
  }

  function handleSave(input: TaskInput) {
    if (!saveTask(input, editingId)) return;
    setMessage(editingId ? "Cambios guardados." : "Tarea creada.");
    closeForm();
  }

  function handleDelete(task: Task) {
    if (!window.confirm(`¿Eliminar la tarea «${task.title}»? Esta acción no se puede deshacer.`)) return;
    deleteTask(task.id);
    if (editingId === task.id) closeForm();
    createButton.current?.focus({ preventScroll: true });
    setMessage("Tarea eliminada.");
  }

  function handleToggle(task: Task) {
    toggleTask(task.id);
    setMessage(task.completed ? "Tarea marcada como pendiente." : "Tarea completada.");
  }

  return (
    <>
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:z-10 focus:rounded-lg focus:bg-white focus:p-4">Ir al contenido principal</a>
      <header className="border-b border-slate-200/80 bg-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-5 px-5 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <div className="flex items-center gap-3"><span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-sm"><CheckCheck aria-hidden="true" size={26} strokeWidth={2.5} /></span><div><p className="text-xl font-bold tracking-tight">Task<span className="text-indigo-600">Flow</span></p><p className="mt-0.5 text-xs text-slate-500 sm:text-sm">Organiza tus tareas de forma sencilla</p></div></div>
          <button ref={createButton} type="button" disabled={isLoading} onClick={() => openForm()} aria-expanded={formOpen} aria-controls={formOpen ? "task-form" : undefined} className="primary-button disabled:opacity-60"><Plus aria-hidden="true" size={18} />Nueva tarea</button>
        </div>
      </header>
      <main id="main-content" className="mx-auto w-full max-w-6xl flex-1 space-y-8 px-5 py-8 sm:px-8 sm:py-10">
        <div className="flex flex-wrap items-end justify-between gap-4"><div><p className="mb-3 flex items-center gap-2 text-xs font-semibold tracking-widest text-indigo-600 uppercase"><LayoutGrid aria-hidden="true" size={14} />Mi espacio personal</p><h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Mis tareas</h1><p className="mt-3 text-sm leading-6 text-slate-500 sm:text-base">Menos pendientes en tu cabeza. Más espacio para lo que importa.</p></div><span className="flex items-center gap-1.5 text-xs text-slate-500"><ArrowUpRight aria-hidden="true" size={15} />Un paso a la vez</span></div>
        <aside role="status" aria-atomic="true" className={`flex items-start gap-2.5 rounded-xl border p-4 text-sm ${storageWarning ? "border-amber-200 bg-amber-50 text-amber-900" : "border-indigo-100 bg-indigo-50/70 text-indigo-900"}`}><Info aria-hidden="true" size={18} className="mt-0.5 shrink-0" /><p>{isLoading ? "Recuperando tus tareas…" : storageWarning ?? "Tus tareas se guardan automáticamente en este navegador."}</p></aside>
        <p role="status" aria-atomic="true" className="text-sm text-indigo-700 empty:hidden">{message}</p>
        {isLoading ? (
          <div aria-busy="true" aria-label="Cargando tareas" className="surface min-h-64 p-6">
            <div aria-hidden="true" className="grid gap-4 sm:grid-cols-3">
              {[0, 1, 2].map((index) => <div key={index} className="h-28 rounded-xl bg-slate-100" />)}
            </div>
          </div>
        ) : (
          <>
            <TaskStats tasks={tasks} />
            {formOpen && <TaskForm key={editingId ?? "new"} task={editingTask} onSave={handleSave} onCancel={closeForm} />}
            <TaskList tasks={tasks} onCreate={() => openForm()} onEdit={openForm} onDelete={handleDelete} onToggle={handleToggle} />
          </>
        )}
      </main>
      <footer className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-2 px-5 py-7 text-xs text-slate-500 sm:px-8"><span>TaskFlow · Tu día, con más claridad.</span><span>Hecho para avanzar a tu ritmo.</span></footer>
    </>
  );
}

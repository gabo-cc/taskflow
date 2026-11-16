"use client";

import { useRef, useState } from "react";
import { Inbox, Plus, Search, SearchX, SlidersHorizontal, X } from "lucide-react";
import type { Task } from "@/types/task";
import { TaskCard } from "./task-card";

interface TaskListProps {
  tasks: readonly Task[];
  onCreate: () => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onToggle: (task: Task) => void;
}

const statusFilters = ["Todas", "Pendientes", "Completadas"] as const;
type StatusFilter = (typeof statusFilters)[number];

export function TaskList({ tasks, onCreate, onEdit, onDelete, onToggle }: TaskListProps) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<StatusFilter>("Todas");
  const searchInput = useRef<HTMLInputElement>(null);
  const query = search.trim().toLowerCase();

  // Derive the visible list; the original tasks still drive CRUD and statistics.
  const visibleTasks = tasks.filter((task) => {
    const matchesStatus = status === "Todas"
      || (status === "Completadas" ? task.completed : !task.completed);
    const matchesSearch = task.title.toLowerCase().includes(query)
      || task.description.toLowerCase().includes(query);
    return matchesStatus && matchesSearch;
  });

  function clearSearch() {
    setSearch("");
    searchInput.current?.focus();
  }

  function resetFilters() {
    setStatus("Todas");
    clearSearch();
  }

  return (
    <section aria-labelledby="task-list-heading" className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 id="task-list-heading" className="text-lg font-semibold">
          Tu lista de tareas
          <span className="ml-2 rounded-md bg-slate-200/60 px-2 py-0.5 text-xs font-medium text-slate-600">{tasks.length}</span>
        </h2>
        <span className="text-xs text-slate-500">Tu espacio, a tu ritmo</span>
      </div>
      <div className="surface flex flex-col gap-4 p-3 sm:p-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-1 rounded-xl bg-slate-100 p-1" role="group" aria-label="Filtrar por estado">
          {statusFilters.map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => setStatus(filter)}
              aria-pressed={status === filter}
              aria-controls="task-results"
              className={`min-h-10 flex-1 rounded-lg px-3 text-sm font-medium transition-colors sm:px-4 ${status === filter ? "bg-white text-indigo-700 shadow-sm" : "text-slate-500 hover:bg-white/60 hover:text-slate-700"}`}
            >
              {filter}
            </button>
          ))}
        </div>
        <div className="relative w-full lg:max-w-xs">
          <label htmlFor="task-search" className="sr-only">Buscar por título o descripción</label>
          <Search aria-hidden="true" size={18} className="pointer-events-none absolute top-3.5 left-3.5 text-slate-400" />
          <input
            ref={searchInput}
            id="task-search"
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            aria-controls="task-results"
            aria-describedby="task-result-count"
            placeholder="Buscar tareas…"
            className="field pr-12 pl-10 [&::-webkit-search-cancel-button]:appearance-none"
          />
          {search && (
            <button type="button" onClick={clearSearch} aria-label="Limpiar búsqueda" title="Limpiar búsqueda" className="absolute top-0.5 right-0.5 flex size-11 items-center justify-center rounded-lg text-slate-500 hover:text-indigo-700">
              <X aria-hidden="true" size={17} />
            </button>
          )}
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p id="task-result-count" role="status" aria-atomic="true" className="flex items-center gap-2 text-xs leading-5 text-slate-500">
          <SlidersHorizontal aria-hidden="true" size={14} className="shrink-0" />
          Mostrando {visibleTasks.length} de {tasks.length} tareas
        </p>
        {(search || status !== "Todas") && (
          <button type="button" onClick={resetFilters} className="min-h-10 rounded-lg px-3 text-xs font-semibold text-indigo-700 underline underline-offset-4 hover:bg-indigo-50">
            Restablecer filtros
          </button>
        )}
      </div>
      <div id="task-results">
        {tasks.length === 0 ? (
          <div className="surface flex flex-col items-center px-6 py-14 text-center">
            <span className="mb-5 rounded-2xl bg-indigo-50 p-4 text-indigo-500"><Inbox aria-hidden="true" size={30} /></span>
            <h3 className="text-lg font-semibold">Todavía no tienes tareas</h3>
            <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">Las grandes ideas empiezan con un pequeño paso. Crea tu primera tarea y organiza lo que viene.</p>
            <button type="button" onClick={onCreate} className="primary-button mt-6"><Plus aria-hidden="true" size={17} />Crear mi primera tarea</button>
          </div>
        ) : visibleTasks.length === 0 ? (
          <div className="surface flex flex-col items-center px-6 py-14 text-center">
            <span className="mb-5 rounded-2xl bg-indigo-50 p-4 text-indigo-500"><SearchX aria-hidden="true" size={30} /></span>
            <h3 className="text-lg font-semibold">No se encontraron resultados</h3>
            <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">Ninguna tarea coincide con tu búsqueda y el estado seleccionado. Prueba otras palabras o restablece los filtros.</p>
            <button type="button" onClick={resetFilters} className="secondary-button mt-6">Restablecer filtros</button>
          </div>
        ) : (
          <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {visibleTasks.map((task) => (
              <TaskCard key={task.id} task={task} onEdit={onEdit} onDelete={onDelete} onToggle={onToggle} />
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

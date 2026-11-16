import { Check, Circle, CircleCheck, Flag, Pencil, RotateCcw, Trash2 } from "lucide-react";
import type { Task } from "@/types/task";

const priorityStyles = {
  Alta: "bg-rose-50 text-rose-700 ring-rose-100",
  Media: "bg-amber-50 text-amber-800 ring-amber-100",
  Baja: "bg-sky-50 text-sky-700 ring-sky-100",
};

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onToggle: (task: Task) => void;
}

export function TaskCard({ task, onEdit, onDelete, onToggle }: TaskCardProps) {
  return (
    <li className="surface flex flex-col p-5 sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <span className={`inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${priorityStyles[task.priority]}`}>
          <Flag aria-hidden="true" size={12} /> Prioridad {task.priority.toLowerCase()}
        </span>
        {task.completed ? <CircleCheck aria-hidden="true" size={21} className="text-emerald-600" /> : <Circle aria-hidden="true" size={21} className="text-slate-300" />}
      </div>
      <h3 className={`mt-5 text-base font-semibold leading-6 wrap-anywhere ${task.completed ? "text-slate-500 line-through decoration-slate-300" : "text-slate-800"}`}>{task.title}</h3>
      <p className="mt-2 flex-1 text-sm leading-6 whitespace-pre-wrap wrap-anywhere text-slate-500">{task.description || "Sin descripción"}</p>
      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
        <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${task.completed ? "text-emerald-700" : "text-slate-500"}`}>
          <span className={`size-1.5 rounded-full ${task.completed ? "bg-emerald-500" : "bg-amber-400"}`} />
          {task.completed ? "Completada" : "Pendiente"}
        </span>
        <div className="flex gap-1" aria-label={`Acciones para ${task.title}`}>
          {[
            { label: "Editar", Icon: Pencil, action: onEdit, color: "hover:bg-indigo-50 hover:text-indigo-700" },
            { label: task.completed ? "Marcar como pendiente" : "Completar", Icon: task.completed ? RotateCcw : Check, action: onToggle, color: "hover:bg-emerald-50 hover:text-emerald-700" },
            { label: "Eliminar", Icon: Trash2, action: onDelete, color: "hover:bg-rose-50 hover:text-rose-700" },
          ].map(({ label, Icon, action, color }) => (
            <button key={label} type="button" onClick={() => action(task)} aria-label={`${label}: ${task.title}`} title={label} className={`flex size-10 items-center justify-center rounded-lg text-slate-500 transition-colors ${color}`}>
              <Icon aria-hidden="true" size={17} />
            </button>
          ))}
        </div>
      </div>
    </li>
  );
}

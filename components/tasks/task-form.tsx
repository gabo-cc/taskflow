import { ClipboardPen, X } from "lucide-react";
import { useEffect, useRef, useState, type FormEvent } from "react";
import type { Task, TaskInput } from "@/types/task";

interface TaskFormProps {
  task?: Task;
  onSave: (input: TaskInput) => void;
  onCancel: () => void;
}

export function TaskForm({ task, onSave, onCancel }: TaskFormProps) {
  const titleInput = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState(task?.title ?? "");
  const [description, setDescription] = useState(task?.description ?? "");
  const [priority, setPriority] = useState<Task["priority"]>(task?.priority ?? "Media");
  const [error, setError] = useState("");

  useEffect(() => {
    titleInput.current?.closest("section")?.scrollIntoView({ block: "start" });
    titleInput.current?.focus({ preventScroll: true });
  }, []);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      setError("Escribe un título que no contenga solamente espacios.");
      titleInput.current?.focus();
      return;
    }
    onSave({ title: trimmedTitle, description: description.trim(), priority });
  }

  return (
    <section id="task-form" aria-labelledby="form-heading" className="surface scroll-mt-6 p-5 sm:p-7">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="rounded-xl bg-indigo-50 p-2.5 text-indigo-600">
            <ClipboardPen aria-hidden="true" size={21} />
          </span>
          <div>
            <h2 id="form-heading" className="text-lg font-semibold">{task ? "Editar tarea" : "Nueva tarea"}</h2>
            <p className="mt-1 text-sm text-slate-500">
              {task ? "Ajusta los detalles y sigue avanzando." : "Un pequeño paso para un día más organizado."}
            </p>
          </div>
        </div>
        <button type="button" onClick={onCancel} aria-label="Cerrar formulario" className="flex size-10 shrink-0 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100">
          <X aria-hidden="true" size={19} />
        </button>
      </div>
      <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
        <div className="grid gap-5 md:grid-cols-[1fr_200px]">
          <div>
            <label htmlFor="task-title" className="mb-2 block text-sm font-medium">
              Título de la tarea <span className="text-indigo-600">*</span>
            </label>
            <input
              ref={titleInput}
              id="task-title"
              name="title"
              required
              maxLength={100}
              value={title}
              onChange={(event) => { setTitle(event.target.value); setError(""); }}
              aria-invalid={error ? true : undefined}
              aria-describedby={error ? "task-title-error" : undefined}
              className="field"
              placeholder="¿Qué necesitas hacer?"
            />
            {error && <p id="task-title-error" role="alert" className="mt-2 text-sm text-rose-700">{error}</p>}
          </div>
          <div>
            <label htmlFor="task-priority" className="mb-2 block text-sm font-medium">Prioridad</label>
            <select id="task-priority" name="priority" value={priority} onChange={(event) => {
              const value = event.target.value;
              if (value === "Alta" || value === "Media" || value === "Baja") setPriority(value);
            }} className="field">
              <option>Alta</option><option>Media</option><option>Baja</option>
            </select>
          </div>
        </div>
        <div>
          <label htmlFor="task-description" className="mb-2 block text-sm font-medium">
            Descripción <span className="font-normal text-slate-400">(opcional)</span>
          </label>
          <textarea id="task-description" name="description" maxLength={500} rows={3} value={description} onChange={(event) => setDescription(event.target.value)} className="field resize-y" placeholder="Añade los detalles que quieras recordar…" />
        </div>
        <div className="flex flex-col gap-4 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs leading-5 text-slate-500">* Campo obligatorio</p>
          <div className="flex gap-3">
            <button type="button" onClick={onCancel} className="secondary-button flex-1">Cancelar</button>
            <button type="submit" className="primary-button flex-1 whitespace-nowrap">{task ? "Guardar cambios" : "Guardar tarea"}</button>
          </div>
        </div>
      </form>
    </section>
  );
}

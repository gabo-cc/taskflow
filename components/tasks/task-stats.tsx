import { CircleCheck, Clock3, Layers } from "lucide-react";
import type { Task } from "@/types/task";

export function TaskStats({ tasks }: { tasks: readonly Task[] }) {
  const completed = tasks.filter((task) => task.completed).length;
  const stats = [
    { label: "Total de tareas", value: tasks.length, Icon: Layers, color: "bg-indigo-50 text-indigo-600", note: "Todo en un solo lugar" },
    { label: "Tareas pendientes", value: tasks.length - completed, Icon: Clock3, color: "bg-amber-50 text-amber-600", note: "Tu próximo paso empieza aquí" },
    { label: "Tareas completadas", value: completed, Icon: CircleCheck, color: "bg-emerald-50 text-emerald-600", note: "Cada avance cuenta" },
  ];
  return (
    <section aria-label="Resumen de tareas" className="grid gap-4 sm:grid-cols-3">
      {stats.map(({ label, value, Icon, color, note }) => (
        <div key={label} className="surface p-5 sm:p-6">
          <div className="flex items-center justify-between gap-2"><h2 className="text-sm font-medium text-slate-500">{label}</h2><span className={`rounded-xl p-2.5 ${color}`}><Icon aria-hidden="true" size={20} /></span></div>
          <p className="mt-2 text-3xl font-semibold tracking-tight">{value.toString().padStart(2, "0")}</p>
          <p className="mt-2 text-xs text-slate-500">{note}</p>
        </div>
      ))}
    </section>
  );
}

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: "Alta" | "Media" | "Baja";
  completed: boolean;
  createdAt: string;
}

export type TaskInput = Pick<Task, "title" | "description" | "priority">;

import type { DomainTask, UpdateTaskModel } from "@/features/todolists/api/tasksApi.types.ts"

export const buildUpdateTaskModel = (task: DomainTask, updates: Partial<UpdateTaskModel>): UpdateTaskModel => {
  return {
    description: updates.description ?? task.description,
    priority: updates.priority ?? task.priority,
    startDate: updates.startDate ?? task.startDate,
    deadline: updates.deadline ?? task.deadline,
    status: updates.status ?? task.status,
    title: updates.title ?? task.title,
  }
}

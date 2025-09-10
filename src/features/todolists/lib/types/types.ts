import type { Todolist } from "@/features/todolists/api/todolistsApi.types.ts"

export type FilterValues = "all" | "active" | "completed"

export type DomainTodolist = Todolist & {
  filter: FilterValues
}
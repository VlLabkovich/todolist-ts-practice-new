import { CreateItemForm } from "@/common/components/CreateItemForm/CreateItemForm"
import { useCreateTaskMutation } from "@/features/todolists/api/tasksApi.ts"
import type { DomainTodolist } from "@/features/todolists/model/todolists-slice.ts"
import { FilterButtons } from "./FilterButtons/FilterButtons"

import { Tasks } from "./Tasks/Tasks"
import { TodolistTitle } from "./TodolistTitle/TodolistTitle"

type Props = {
  todolist: DomainTodolist
}

export const TodolistItem = ({ todolist }: Props) => {
  const { entityStatus } = todolist

  const [createTaskMutation] = useCreateTaskMutation()

  return (
    <div>
      <TodolistTitle todolist={todolist} />
      <CreateItemForm
        onCreateItem={(title) => createTaskMutation({ todolistId: todolist.id, title })}
        disabled={entityStatus === "loading"}
      />
      <Tasks todolist={todolist} />
      <FilterButtons todolist={todolist} />
    </div>
  )
}

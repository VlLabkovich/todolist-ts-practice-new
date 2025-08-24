import { EditableSpan } from "@/common/components/EditableSpan/EditableSpan"
import { TaskStatus } from "@/common/enums"
import { useDeleteTaskMutation, useUpdateTaskMutation } from "@/features/todolists/api/tasksApi.ts"
import type { DomainTask, UpdateTaskModel } from "@/features/todolists/api/tasksApi.types.ts"
import type { DomainTodolist } from "@/features/todolists/lib/types"
import DeleteIcon from "@mui/icons-material/Delete"
import Checkbox from "@mui/material/Checkbox"
import IconButton from "@mui/material/IconButton"
import ListItem from "@mui/material/ListItem"
import type { ChangeEvent } from "react"
import { getListItemSx } from "./TaskItem.styles"

type Props = {
  task: DomainTask
  todolistId: string
  todolist: DomainTodolist
}

export const TaskItem = ({ task, todolistId, todolist }: Props) => {

  const [deleteTask] = useDeleteTaskMutation()

  const [updateTask] = useUpdateTaskMutation()

  const buildUpdateTaskModel = (task: DomainTask, updates: Partial<UpdateTaskModel>): UpdateTaskModel  => {
    return {
      description: updates.description ?? task.description,
      priority: updates.priority ?? task.priority,
      startDate: updates.startDate ?? task.startDate,
      deadline: updates.deadline ?? task.deadline,
      status: updates.status ?? task.status,
      title: updates.title ?? task.title,
    }
  }

  const changeTaskStatus = (e: ChangeEvent<HTMLInputElement>) => {
    const status = e.currentTarget.checked ? TaskStatus.Completed : TaskStatus.New
    const model = buildUpdateTaskModel(task, { status })
    updateTask({ todolistId, taskId: task.id, model })
  }

  const changeTaskTitle = (title: string) => {
    const model = buildUpdateTaskModel(task, { title })
    updateTask({ todolistId, taskId: task.id, model })
  }

  const isTaskCompleted = task.status === TaskStatus.Completed

  const todolistStatus = todolist.entityStatus === "loading"

  return (
    <ListItem sx={getListItemSx(isTaskCompleted)}>
      <div>
        <Checkbox checked={isTaskCompleted} onChange={changeTaskStatus} disabled={todolistStatus} />
        <EditableSpan value={task.title} onChange={changeTaskTitle} disabled={todolistStatus} />
      </div>
      <IconButton onClick={() => deleteTask({ todolistId, taskId: task.id })} disabled={todolistStatus}>
        <DeleteIcon />
      </IconButton>
    </ListItem>
  )
}

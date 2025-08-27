import { EditableSpan } from "@/common/components/EditableSpan/EditableSpan"
import { TaskStatus } from "@/common/enums"
import { buildUpdateTaskModel } from "@/common/utils/buildUpdateTaskModel.ts"
import { useDeleteTaskMutation, useUpdateTaskMutation } from "@/features/todolists/api/tasksApi.ts"
import type { DomainTask } from "@/features/todolists/api/tasksApi.types.ts"
import type { DomainTodolist } from "@/features/todolists/lib/types"
import DeleteIcon from "@mui/icons-material/Delete"
import Checkbox from "@mui/material/Checkbox"
import IconButton from "@mui/material/IconButton"
import ListItem from "@mui/material/ListItem"
import type { ChangeEvent } from "react"
import { getListItemSx } from "./TaskItem.styles"

type Props = {
  task: DomainTask
  todolist: DomainTodolist
}

export const TaskItem = ({ task, todolist }: Props) => {
  const [deleteTask] = useDeleteTaskMutation()

  const [updateTask] = useUpdateTaskMutation()

  const changeTaskStatus = (e: ChangeEvent<HTMLInputElement>) => {
    const status = e.currentTarget.checked ? TaskStatus.Completed : TaskStatus.New
    const model = buildUpdateTaskModel(task, { status })
    updateTask({ todolistId: todolist.id, taskId: task.id, model })
  }
  const changeTaskTitle = (title: string) => {
    const model = buildUpdateTaskModel(task, { title })
    updateTask({ todolistId: todolist.id, taskId: task.id, model })
  }

  const isTaskCompleted = task.status === TaskStatus.Completed

  const todolistStatus = todolist.entityStatus === "loading"

  return (
    <ListItem sx={getListItemSx(isTaskCompleted)}>
      <div>
        <Checkbox checked={isTaskCompleted} onChange={changeTaskStatus} disabled={todolistStatus} />
        <EditableSpan value={task.title} onChange={changeTaskTitle} disabled={todolistStatus} />
      </div>
      <IconButton onClick={() => deleteTask({ todolistId: todolist.id, taskId: task.id })} disabled={todolistStatus}>
        <DeleteIcon />
      </IconButton>
    </ListItem>
  )
}

import { EditableSpan } from "@/common/components/EditableSpan/EditableSpan"
import { useChangeTodolistTitleMutation, useDeleteTodolistMutation } from "@/features/todolists/api/todolistsApi.ts"
import type { DomainTodolist } from "@/features/todolists/lib/types"
import DeleteIcon from "@mui/icons-material/Delete"
import IconButton from "@mui/material/IconButton"
import styles from "./TodolistTitle.module.css"

type Props = {
  todolist: DomainTodolist
}

export const TodolistTitle = ({ todolist }: Props) => {
  const { id, title, entityStatus } = todolist
  const [changeTodolistTitle] = useChangeTodolistTitleMutation()

  const [removeTodolist] = useDeleteTodolistMutation()

  const todolistDisabled = entityStatus === "loading"

  return (
    <div className={styles.container}>
      <h3>
        <EditableSpan
          value={title}
          onChange={(title) => changeTodolistTitle({ id, title })}
          disabled={todolistDisabled}
        />
      </h3>
      <IconButton onClick={() => removeTodolist(id)} disabled={todolistDisabled}>
        <DeleteIcon />
      </IconButton>
    </div>
  )
}
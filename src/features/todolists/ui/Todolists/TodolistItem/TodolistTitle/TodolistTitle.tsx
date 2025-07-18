import { EditableSpan } from "@/common/components/EditableSpan/EditableSpan"
import { useChangeTodolistTitleMutation, useDeleteTodolistMutation } from "@/features/todolists/api/todolistsApi.ts"
import { type DomainTodolist } from "@/features/todolists/model/todolists-slice.ts"
import DeleteIcon from "@mui/icons-material/Delete"
import IconButton from "@mui/material/IconButton"
import styles from "./TodolistTitle.module.css"

type Props = {
  todolist: DomainTodolist
}

export const TodolistTitle = ({ todolist }: Props) => {
  const { id, title, entityStatus } = todolist

  const [changeTodolistTitle] = useChangeTodolistTitleMutation()

  const [deleteTodolist] = useDeleteTodolistMutation()

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
      <IconButton onClick={() => deleteTodolist(id)} disabled={todolistDisabled}>
        <DeleteIcon />
      </IconButton>
    </div>
  )
}

// const dispatch = useAppDispatch()
//
// const deleteTodolist = () => {
//   dispatch(deleteTodolistTC(id))
// }
// const changeTodolistTitle = (title: string) => {
//   dispatch(changeTodolistTitleTC({ id, title }))
// }

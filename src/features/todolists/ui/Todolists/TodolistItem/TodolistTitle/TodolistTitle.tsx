import { EditableSpan } from "@/common/components/EditableSpan/EditableSpan"
import { useAppDispatch } from "@/common/hooks"
import type { RequestStatus } from "@/common/types"
import {
  todolistsApi,
  useChangeTodolistTitleMutation,
  useDeleteTodolistMutation
} from "@/features/todolists/api/todolistsApi.ts"
import type { DomainTodolist } from "@/features/todolists/lib/types"
import DeleteIcon from "@mui/icons-material/Delete"
import IconButton from "@mui/material/IconButton"
import styles from "./TodolistTitle.module.css"

type Props = {
  todolist: DomainTodolist
}

export const TodolistTitle = ({ todolist }: Props) => {
  const { id, title, entityStatus } = todolist
  const dispatch = useAppDispatch()
  const [changeTodolistTitle] = useChangeTodolistTitleMutation()

  const [removeTodolist] = useDeleteTodolistMutation()

  const todolistDisabled = entityStatus === "loading"

  const changeTodolistStatus = (entityStatus: RequestStatus) => {
    dispatch(
      todolistsApi.util.updateQueryData("getTodolists", undefined, (state) => {
        const todolist = state.find((todolist) => todolist.id === id)
        if (todolist) {
          todolist.entityStatus = entityStatus
        }
      }),
    )
  }

  const deleteTodolist = () => {
    changeTodolistStatus("loading")
    removeTodolist(id)
      .unwrap()
      .catch(() => {
        changeTodolistStatus("idle")
      })
  }


    return (
    <div className={styles.container}>
      <h3>
        <EditableSpan
          value={title}
          onChange={(title) => changeTodolistTitle({ id, title })}
          disabled={todolistDisabled}
        />
      </h3>
      <IconButton onClick={deleteTodolist} disabled={todolistDisabled}>
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

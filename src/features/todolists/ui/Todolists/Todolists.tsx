import { useAppDispatch, useAppSelector } from "@/common/hooks"
import { selectTodolists, setTodolistsTC } from "@/features/todolists/model/todolists-slice.ts"
import Grid from "@mui/material/Grid2"
import Paper from "@mui/material/Paper"
import { useEffect } from "react"
import { TodolistItem } from "./TodolistItem/TodolistItem"

export const Todolists = () => {
  // 6
  const todolists = useAppSelector(selectTodolists)

  const dispatch = useAppDispatch()

  // 1
  useEffect(() => {
    dispatch(setTodolistsTC())
  }, [])

  return (
    <>
      {todolists.map((todolist) => (
        <Grid key={todolist.id}>
          <Paper sx={{ p: "0 20px 20px 20px" }}>
            <TodolistItem todolist={todolist} />
          </Paper>
        </Grid>
      ))}
    </>
  )
}

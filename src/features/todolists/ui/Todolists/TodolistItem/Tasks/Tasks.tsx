import { TaskStatus } from "@/common/enums"
import { useAppDispatch, useAppSelector } from "@/common/hooks"
import { fetchTasksTC, selectTasks } from "@/features/todolists/model/tasks-slice.ts"
import type { DomainTodolist } from "@/features/todolists/model/todolists-slice.ts"
import List from "@mui/material/List"
import { useEffect } from "react"
import { TaskItem } from "./TaskItem/TaskItem"

type Props = {
  todolist: DomainTodolist
}

export const Tasks = ({ todolist }: Props) => {
  const { id, filter } = todolist

  const tasks = useAppSelector(selectTasks)

  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(fetchTasksTC(id))
  }, [])

  const todolistTasks = tasks[id]
  let filteredTasks = todolistTasks
  if (filter === "active") {
    filteredTasks = todolistTasks.filter((task) => task.status === TaskStatus.New)
  }
  if (filter === "completed") {
    filteredTasks = todolistTasks.filter((task) => task.status === TaskStatus.Completed)
  }

  return (
    <>
      {filteredTasks && filteredTasks.length === 0 ? (
        <p>Тасок нет</p>
      ) : (
        <List>
          {filteredTasks && filteredTasks.map((task) => <TaskItem
            key={task.id}
            task={task}
            todolistId={id}
            todolist={todolist} />)}
        </List>
      )}
    </>
  )
}

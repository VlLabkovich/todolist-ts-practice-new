import { TaskStatus } from "@/common/enums"
import { useGetTasksQuery } from "@/features/todolists/api/tasksApi.ts"
import type { DomainTodolist } from "@/features/todolists/model/todolists-slice.ts"
import { TasksSkeleton } from "@/features/todolists/ui/Todolists/TodolistItem/Tasks/TasksSkeleton"
import List from "@mui/material/List"
import { TaskItem } from "./TaskItem/TaskItem"

type Props = {
  todolist: DomainTodolist
}

export const Tasks = ({ todolist }: Props) => {
  const { id, filter } = todolist

  // const dispatch = useAppDispatch()

  const { data, isLoading, error, isError } = useGetTasksQuery(id)

  // useEffect(() => {
  //   if (!error) return // проверка на error на undefined
  //   if ('status' in error) {
  //     const errMsg = 'error' in error ? error.error : JSON.stringify(error.data)
  //     dispatch(setAppErrorAC({ error: errMsg }))
  //   } else {
  //     dispatch(setAppErrorAC({ error: error.message || 'Some error occurred' }))
  //   }
  // }, [error])

  if (isLoading) {
    return <TasksSkeleton />
  }

  let filteredTasks = data?.items
  if (filter === "active") {
    filteredTasks = filteredTasks?.filter((task) => task.status === TaskStatus.New)
  }
  if (filter === "completed") {
    filteredTasks = filteredTasks?.filter((task) => task.status === TaskStatus.Completed)
  }

  return (
    <>
      {filteredTasks && filteredTasks.length === 0 ? (
        <p>Тасок нет</p>
      ) : (
        <List>
          {filteredTasks &&
            filteredTasks.map((task) => <TaskItem key={task.id} task={task} todolistId={id} todolist={todolist} />)}
        </List>
      )}
    </>
  )
}

// Old code with RTK-query
// const tasks = useAppSelector(selectTasks)
// const dispatch = useAppDispatch()
// useEffect(() => {
//   dispatch(fetchTasksTC(id))
// }, [])
// const todolistTasks = tasks[id]

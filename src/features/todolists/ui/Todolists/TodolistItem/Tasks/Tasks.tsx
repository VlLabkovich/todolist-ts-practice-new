import { TaskStatus } from "@/common/enums"
import { useGetTasksQuery } from "@/features/todolists/api/tasksApi.ts"
import type { DomainTodolist } from "@/features/todolists/model/todolists-slice.ts"
import List from "@mui/material/List"
import { TaskItem } from "./TaskItem/TaskItem"

type Props = {
  todolist: DomainTodolist
}

export const Tasks = ({ todolist }: Props) => {
  const { id, filter } = todolist

  const { data } = useGetTasksQuery(id)

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

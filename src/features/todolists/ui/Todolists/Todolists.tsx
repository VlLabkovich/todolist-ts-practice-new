import { containerSx } from "@/common/styles"
import { useGetTodolistsQuery } from "@/features/todolists/api/todolistsApi.ts"
import { TodolistSkeleton } from "@/features/todolists/ui/Todolists/TodolistSkeleton"
import Box from "@mui/material/Box"
import Grid from "@mui/material/Grid2"
import Paper from "@mui/material/Paper"

import { TodolistItem } from "./TodolistItem/TodolistItem"

export const Todolists = () => {
  const { data: todolists, isLoading } = useGetTodolistsQuery()

  if (isLoading) {
    return (
      <Box sx={containerSx} style={{ gap: "32px" }}>
        {Array(3)
          .fill(null)
          .map((_, id) => (
            <TodolistSkeleton key={id} />
          ))}
      </Box>
    )
  }

  return (
    <>
      {todolists?.map((todolist) => (
        <Grid key={todolist.id}>
          <Paper sx={{ p: "0 20px 20px 20px" }}>
            <TodolistItem todolist={todolist} />
          </Paper>
        </Grid>
      ))}
    </>
  )
}

// // With AsyncThunk
// const todolists = useAppSelector(selectTodolists)
// const dispatch = useAppDispatch()
// useEffect(() => {
//   dispatch(fetchTodolistsTC())
// }, [])

// Conditional fetching
// 1
// const [skip, setSkip] = useState(true)
// const { data: todolists } = useGetTodolistsQuery(undefined, { skip })
// const fetchTodolists = () => {
//   // setSkip(false)
// }
// {/*<div>*/}
// {/*  <button onClick={fetchTodolists}>Download todolists</button>*/}
// {/*</div>*/}
//
// 2
// const [trigger, { data: todolists }] = useLazyGetTodolistsQuery()
// {/*<div>*/}
// {/*  <button onClick={() => trigger()}>Download todolists</button>*/}
// {/*</div>*/}
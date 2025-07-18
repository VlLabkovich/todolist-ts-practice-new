import { CreateItemForm } from "@/common/components/CreateItemForm/CreateItemForm"
import { useCreateTodolistMutation } from "@/features/todolists/api/todolistsApi.ts"
import { Todolists } from "@/features/todolists/ui/Todolists/Todolists"
import Container from "@mui/material/Container"
import Grid from "@mui/material/Grid2"

export const Main = () => {
  const [createTodolist] = useCreateTodolistMutation()

  return (
    <Container maxWidth={"lg"}>
      <Grid container sx={{ mb: "30px" }}>
        <CreateItemForm onCreateItem={(title) => createTodolist(title)} />
      </Grid>
      <Grid container spacing={4}>
        <Todolists />
      </Grid>
    </Container>
  )
}

// // With AsyncThunk
// const dispatch = useAppDispatch()
// const createTodolist = (title: string) => {
// dispatch(createTodolistTC(title))
// }
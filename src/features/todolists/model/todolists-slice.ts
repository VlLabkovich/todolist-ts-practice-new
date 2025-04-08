import { createSlice, nanoid } from "@reduxjs/toolkit"

export type Todolist = {
  id: string
  title: string
  filter: FilterValues
}

export type FilterValues = "all" | "active" | "completed"

export const todolistsSlice = createSlice({
  name: "todolists",
  initialState: [] as Todolist[],
  reducers: (create) => ({
    deleteTodolistAC: create.reducer<{ id: string }>((state, action) => {
      const index = state.findIndex((todo) => todo.id === action.payload.id)
      if (index !== -1) state.splice(index, 1)
    }),
    createTodolistAC: create.preparedReducer(
      (title: string) => ({ payload: { title, id: nanoid() } }),
      (state, action) => {
        state.push({ ...action.payload, filter: "all" })
      },
    ),
    changeTodolistTitleAC: create.reducer<{ id: string; title: string }>((state, action) => {
      const todolistTitle = state.find((todo) => todo.id === action.payload.id)
      if (todolistTitle) {
        todolistTitle.title = action.payload.title
      }
    }),
    changeTodolistFilterAC: create.reducer<{ id: string; filter: FilterValues }>((state, action) => {
      const todolistFilter = state.find((todo) => todo.id === action.payload.id)
      if (todolistFilter) {
        todolistFilter.filter = action.payload.filter
      }
    }),
  }),
  selectors: {
    selectTodolists: (state) => state,
  },
})

export const { deleteTodolistAC, createTodolistAC, changeTodolistFilterAC, changeTodolistTitleAC } =
  todolistsSlice.actions

export const { selectTodolists } = todolistsSlice.selectors
export const todolistsReducer = todolistsSlice.reducer

// Old code with createAction and createReducer
// // export const deleteTodolistAC = createAction<{ id: string }>("todolists/deleteTodolist")
// // export const createTodolistAC = createAction("todolists/createTodolist", (title: string) => {
// //   return { payload: { title, id: nanoid() } }
// // })
// // export const changeTodolistTitleAC = createAction<{ id: string; title: string }>("todolists/changeTodolistTitle")
// // export const changeTodolistFilterAC = createAction<{ id: string; filter: FilterValues }>(
// //   "todolists/changeTodolistFilter",
// // )
// //
// // const initialState: Todolist[] = []
// //
// // export const todolistsReducer1 = createReducer(initialState, (builder) => {
// //   builder
// //     .addCase(deleteTodolistAC1, (state, action) => {
// //       const index = state.findIndex((todolist) => todolist.id === action.payload.id)
// //       if (index !== -1) {
// //         state.splice(index, 1)
// //       }
// //     })
// //     .addCase(createTodolistAC1, (state, action) => {
// //       state.push({ ...action.payload, filter: "all" })
// //     })
// //     .addCase(changeTodolistTitleAC1, (state, action) => {
// //       const index = state.findIndex((todolist) => todolist.id === action.payload.id)
// //       if (index !== -1) {
// //         state[index].title = action.payload.title
// //       }
// //     })
// //     .addCase(changeTodolistFilterAC1, (state, action) => {
// //       const todolist = state.find((todolist) => todolist.id === action.payload.id)
// //       if (todolist) {
// //         todolist.filter = action.payload.filter
// //       }
// //     })
// // })
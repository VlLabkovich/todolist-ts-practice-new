import { todolistsApi } from "@/features/todolists/api/todolistsApi.ts"
import type { Todolist } from "@/features/todolists/api/todolistsApi.types.ts"
import { createAsyncThunk, createSlice, nanoid } from "@reduxjs/toolkit"

export type DomainTodolist = Todolist & {
  filter: FilterValues
}

export type FilterValues = "all" | "active" | "completed"

export const todolistsSlice = createSlice({
  name: "todolists",
  initialState: [] as DomainTodolist[],
  reducers: (create) => ({
    deleteTodolistAC: create.reducer<{ id: string }>((state, action) => {
      const index = state.findIndex((todo) => todo.id === action.payload.id)
      if (index !== -1) state.splice(index, 1)
    }),

    createTodolistAC: create.preparedReducer(
      (title: string) => ({ payload: { title, id: nanoid() } }),
      (state, action) => {
        state.push({
          ...action.payload,
          filter: "all",
          addedDate: "",
          order: 0,
        })
      },
    ),
    changeTodolistFilterAC: create.reducer<{ id: string; filter: FilterValues }>((state, action) => {
      const todolistFilter = state.find((todo) => todo.id === action.payload.id)
      if (todolistFilter) {
        todolistFilter.filter = action.payload.filter
      }
    }),
  }),
  extraReducers: (builder) => {
    builder
      .addCase(setTodolistsTC.fulfilled, (state, action) => {
        action.payload?.todolists.forEach((tl) => {
          state.push({ ...tl, filter: "all" })
        })
      })
      // .addCase(setTodolistsTC.rejected, (state, action) => {})

      .addCase(changeTodolistTitleTC.fulfilled, (state, action) => {
        const todolistTitle = state.find((todo) => todo.id === action.payload.id)
        if (todolistTitle) {
          todolistTitle.title = action.payload.title
        }
      })
    // .addCase(changeTodolistTitleTC.rejected, (state, action) => {})
  },
  selectors: {
    selectTodolists: (state) => state,
  },
})

export const setTodolistsTC = createAsyncThunk(`${todolistsSlice.name}/setTodolistsTC`, async (_arg, thunkAPI) => {
  try {
    const res = await todolistsApi.getTodolists()
    return { todolists: res.data }
    // dispatch(setTodolistsAC({ todolists: res.data }))
  } catch (error) {
    return thunkAPI.rejectWithValue(null)
  }
})

export const changeTodolistTitleTC = createAsyncThunk(
  `${todolistsSlice.name}/changeTodolistTitleTC`,
  async (args: { id: string; title: string }, thunkAPI) => {
    try {
      await todolistsApi.changeTodolistTitle(args)
      return args
    } catch (error) {
      return thunkAPI.rejectWithValue(null)
    }
  },
)

// todolistsApi.changeTodolistTitle({ id, title }).then(() => {
//       setTodolists(todolists.map((todolist) => (todolist.id === id ? { ...todolist, title } : todolist)))

export const { deleteTodolistAC, createTodolistAC, changeTodolistFilterAC } = todolistsSlice.actions

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
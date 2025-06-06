import { setAppStatusAC } from "@/app/app-slice.ts"
import { ResultCode } from "@/common/enums"
import type { RequestStatus } from "@/common/types"
import { createAppSlice, handleServerAppError, handleServerNetworkError } from "@/common/utils"
import { todolistsApi } from "@/features/todolists/api/todolistsApi.ts"
import { type Todolist, TodolistSchema } from "@/features/todolists/api/todolistsApi.types.ts"

export type DomainTodolist = Todolist & {
  filter: FilterValues
  entityStatus: RequestStatus
}

export type FilterValues = "all" | "active" | "completed"

export const todolistsSlice = createAppSlice({
  name: "todolists",
  initialState: [] as DomainTodolist[],
  reducers: (create) => ({
    changeTodolistFilterAC: create.reducer<{ id: string; filter: FilterValues }>((state, action) => {
      const todolistFilter = state.find((todo: { id: string }) => todo.id === action.payload.id)
      if (todolistFilter) {
        todolistFilter.filter = action.payload.filter
      }
    }),
    changeTodolistStatusAC: create.reducer<{ id: string; entityStatus: RequestStatus }>((state, action) => {
      const todolistStatus = state.findIndex((todo) => todo.id === action.payload.id)
      if (todolistStatus !== -1) {
        state[todolistStatus].entityStatus = action.payload.entityStatus
      }
    }),

    fetchTodolistsTC: create.asyncThunk(
      async (_, { dispatch, rejectWithValue }) => {
        try {
          dispatch(setAppStatusAC({ status: "loading" }))
          const res = await todolistsApi.getTodolists()
          dispatch(setAppStatusAC({ status: "succeeded" }))
          const todolists = TodolistSchema.array().parse(res.data)
          return { todolists }
        } catch (error) {
          console.log(error)
          handleServerNetworkError(dispatch, error)
          return rejectWithValue(null)
        }
      },
      {
        fulfilled: (state, action) => {
          action.payload?.todolists.forEach((tl) => {
            state.push({ ...tl, filter: "all", entityStatus: "idle" })
          })
        },
      },
    ),

    changeTodolistTitleTC: create.asyncThunk(
      async (payload: { id: string; title: string }, { dispatch, rejectWithValue }) => {
        const { id, title } = payload
        try {
          dispatch(setAppStatusAC({ status: "loading" }))
          const res = await todolistsApi.changeTodolistTitle(id, title)
          dispatch(setAppStatusAC({ status: "succeeded" }))
          if (res.data.resultCode === ResultCode.Success) {
            return { id, title }
          } else {
            handleServerAppError(res.data, dispatch)
            return rejectWithValue(null)
          }
        } catch (error) {
          handleServerNetworkError(dispatch, error)
          return rejectWithValue(null)
        }
      },
      {
        fulfilled: (state, action) => {
          const index = state.findIndex((todolist) => todolist.id === action.payload.id)
          if (index !== -1) {
            state[index].title = action.payload.title
          }
        },
      },
    ),

    createTodolistTC: create.asyncThunk(
      async (title: string, { dispatch, rejectWithValue }) => {
        try {
          dispatch(setAppStatusAC({ status: "loading" }))
          const res = await todolistsApi.createTodolist(title)
          if (res.data.resultCode === ResultCode.Success) {
            return { todolist: res.data.data.item }
          } else {
            handleServerAppError(res.data, dispatch)
            return rejectWithValue(null)
          }
        } catch (error) {
          handleServerNetworkError(dispatch, error)
          return rejectWithValue(null)
        }
      },
      {
        fulfilled: (state, action) => {
          state.unshift({ ...action.payload.todolist, filter: "all", entityStatus: "idle" })
        },
      },
    ),

    deleteTodolistTC: create.asyncThunk(
      async (id: string, { dispatch, rejectWithValue }) => {
        try {
          dispatch(setAppStatusAC({ status: "loading" }))
          dispatch(changeTodolistStatusAC({ id, entityStatus: "loading" }))
          const res = await todolistsApi.deleteTodolist(id)
          dispatch(setAppStatusAC({ status: "succeeded" }))
          if (res.data.resultCode === ResultCode.Success) {
            return { id }
          } else {
            handleServerAppError(res.data, dispatch)
            return rejectWithValue(null)
          }
        } catch (error) {
          dispatch(changeTodolistStatusAC({ id, entityStatus: "failed" }))
          handleServerNetworkError(dispatch, error)
          return rejectWithValue(null)
        }
      },
      {
        fulfilled: (state, action) => {
          const index = state.findIndex((todo) => todo.id === action.payload.id)
          if (index !== -1) state.splice(index, 1)
        },
      },
    ),
  }),

  selectors: {
    selectTodolists: (state) => state,
  },
})

export const {
  fetchTodolistsTC,
  changeTodolistTitleTC,
  deleteTodolistTC,
  createTodolistTC,
  changeTodolistFilterAC,
  changeTodolistStatusAC,
} = todolistsSlice.actions
export const { selectTodolists } = todolistsSlice.selectors
export const todolistsReducer = todolistsSlice.reducer

// extraReducers: (builder) => {
//   builder
//     // .addCase(fetchTodolistsTC.fulfilled, (state, action) => {
//     //   action.payload?.todolists.forEach((tl) => {
//     //     state.push({ ...tl, filter: "all" })
//     //   })
//     // })
//     // .addCase(setTodolistsTC.rejected, (state, action) => {})
//
//     // .addCase(changeTodolistTitleTC.fulfilled, (state, action) => {
//     //   const index = state.findIndex((todolist) => todolist.id === action.payload.id)
//     //   if (index !== -1) {
//     //     state[index].title = action.payload.title
//     //   }
//     // })
//     // .addCase(changeTodolistTitleTC.rejected, (state, action) => {})
//
//     // .addCase(createTodolistTC.fulfilled, (state, action) => {
//     //   state.unshift({ ...action.payload.todolist, filter: "all" })
//     // })
//
//     // .addCase(deleteTodolistTC.fulfilled, (state, action) => {
//     //   const index = state.findIndex((todo) => todo.id === action.payload.id)
//     //   if (index !== -1) state.splice(index, 1)
//     // })
// },

// // old
//
// export const fetchTodolistsTC = createAsyncThunk(`${todolistsSlice.name}/setTodolistsTC`, async (_arg, thunkAPI) => {
//   try {
//     const res = await todolistsApi.getTodolists()
//     return { todolists: res.data }
//   } catch (error) {
//     return thunkAPI.rejectWithValue(null)
//   }
// })
//
// export const changeTodolistTitleTC = createAsyncThunk(
//   `${todolistsSlice.name}/changeTodolistTitleTC`,
//   async (payload: { id: string; title: string }, thunkAPI) => {
//     try {
//       await todolistsApi.changeTodolistTitle(payload)
//       return payload
//     } catch (error) {
//       return thunkAPI.rejectWithValue(null)
//     }
//   },
// )
//
// export const createTodolistTC = createAsyncThunk(
//   `${todolistsSlice.name}/createTodolistTC`,
//   async (title: string, thunkAPI) => {
//     try {
//       const res = await todolistsApi.createTodolist(title)
//       return { todolist: res.data.data.item }
//     } catch (error) {
//       return thunkAPI.rejectWithValue(null)
//     }
//   },
// )
//
// todolistsApi.changeTodolistTitle({ id, title }).then(() => {
//       setTodolists(todolists.map((todolist) => (todolist.id === id ? { ...todolist, title } : todolist)))
//
// export const deleteTodolistTC = createAsyncThunk(
//   `${todolistsSlice.name}/deleteTodolistTC`,
//   async (id: string, thunkAPI) => {
//     try {
//       await todolistsApi.deleteTodolist(id)
//       return { id }
//     } catch (error) {
//       return thunkAPI.rejectWithValue(null)
//     }
//   },
// )

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
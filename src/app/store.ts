import { authReducer, authSlice } from "@/features/auth/model/auth-slice.ts"
import { todolistsApi } from "@/features/todolists/api/todolistsApi.ts"
import { tasksReducer, tasksSlice } from "@/features/todolists/model/tasks-slice.ts"
import { configureStore } from "@reduxjs/toolkit"
import { setupListeners } from "@reduxjs/toolkit/query"
import { appReducer, appSlice } from "./app-slice.ts"

export const store = configureStore({
  reducer: {
    [tasksSlice.name]: tasksReducer,
    // [todolistsSlice.name]: todolistsReducer,
    [appSlice.name]: appReducer,
    [authSlice.name]: authReducer,
    [todolistsApi.reducerPath]: todolistsApi.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(todolistsApi.middleware),
})

// автоматическое определение типа всего объекта состояния
export type RootState = ReturnType<typeof store.getState>
// автоматическое определение типа метода dispatch
export type AppDispatch = typeof store.dispatch

setupListeners(store.dispatch)

// для возможности обращения к store в консоли браузера
// @ts-ignore
window.store = store

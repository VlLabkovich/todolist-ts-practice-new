import type { RequestStatus } from "@/common/types"
import { tasksApi } from "@/features/todolists/api/tasksApi.ts"
import { todolistsApi } from "@/features/todolists/api/todolistsApi.ts"
import { createSlice, isFulfilled, isPending, isRejected } from "@reduxjs/toolkit"

type AppState = {
  captchaUrl: string | null
  error: string | null
  isLoggedIn: boolean
  themeMode: ThemeMode
  status: RequestStatus
}

const initialState: AppState = {
  captchaUrl: null,
  error: null,
  isLoggedIn: false,
  themeMode: "light",
  status: "idle",
}

export const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: (create) => ({
    changeThemeModeAC: create.reducer<{ themeMode: ThemeMode }>((state, action) => {
      state.themeMode = action.payload.themeMode
    }),
    setAppStatusAC: create.reducer<{ status: RequestStatus }>((state, action) => {
      state.status = action.payload.status
    }),
    setAppErrorAC: create.reducer<{ error: null | string }>((state, action) => {
      state.error = action.payload.error
    }),
    setIsLoggedInAC: create.reducer<{ isLoggedIn: boolean }>((state, action) => {
      state.isLoggedIn = action.payload.isLoggedIn
    }),
    setCaptchaUrlAC: create.reducer<{ captchaUrl: string | null }>((state, action) => {
      state.captchaUrl = action.payload.captchaUrl
    }),
  }),

  extraReducers: (builder) => {
    builder
      .addMatcher(isPending, (state, action) => {
        if (
          todolistsApi.endpoints.getTodolists.matchPending(action) ||
          tasksApi.endpoints.getTasks.matchPending(action)
        ) {
          return
        }
        state.status = "loading"
      })
      .addMatcher(isFulfilled, (state) => {
        state.status = "succeeded"
      })
      .addMatcher(isRejected, (state) => {
        state.status = "failed"
      })
  },
  selectors: {
    selectThemeMode: (state) => state.themeMode,
    selectStatus: (state) => state.status,
    selectAppError: (state) => state.error,
    selectIsLoggedIn: (state) => state.isLoggedIn,
    selectCaptchaUrl: (state) => state.captchaUrl
  },
})

export const { changeThemeModeAC, setAppErrorAC, setIsLoggedInAC, setCaptchaUrlAC } = appSlice.actions
export const { selectThemeMode, selectStatus, selectAppError, selectIsLoggedIn, selectCaptchaUrl } = appSlice.selectors
export const appReducer = appSlice.reducer
export type ThemeMode = "dark" | "light"

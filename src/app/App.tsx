import { selectThemeMode, setIsLoggedInAC } from "@/app/app-slice.ts"
import { ErrorSnackbar } from "@/common/components"
import { Header } from "@/common/components/Header/Header"
import { ResultCode } from "@/common/enums"
import { useAppDispatch, useAppSelector } from "@/common/hooks"
import { Routing } from "@/common/routing"
import { getTheme } from "@/common/theme"
import { useMeQuery } from "@/features/auth/api/authApi.ts"
import { CircularProgress } from "@mui/material"
import CssBaseline from "@mui/material/CssBaseline"
import { ThemeProvider } from "@mui/material/styles"
import { useEffect, useState } from "react"
import s from "./App.module.css"

export const App = () => {
  const [isInitialized, setIsInitialized] = useState(false)

  const themeMode = useAppSelector(selectThemeMode)

  const theme = getTheme(themeMode)

  const dispatch = useAppDispatch()

  const { data, isLoading } = useMeQuery()

  useEffect(() => {
    if (isLoading) return
    setIsInitialized(true)

    if (data?.resultCode === ResultCode.Success) {
      dispatch(setIsLoggedInAC({ isLoggedIn: true }))
    }
  }, [isLoading])

  if (!isInitialized) {
    return (
      <div className={s.circularProgressContainer}>
        <CircularProgress size={150} thickness={3} />
      </div>
    )
  }

  return (
    <ThemeProvider theme={theme}>
      <div className={s.app}>
        <CssBaseline />
        <Header />
        <Routing />
        <ErrorSnackbar />
      </div>
    </ThemeProvider>
  )
}

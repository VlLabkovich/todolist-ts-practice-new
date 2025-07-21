import { selectIsLoggedIn } from "@/app/app-slice.ts"
import { Main } from "@/app/Main"
import { Faq } from "@/common/components/Faq/Faq.tsx"
import { PageNotFound } from "@/common/components/PageNotFound/PageNotFound.tsx"
import { ProtectedRoute } from "@/common/components/ProtectedRoute"
import { useAppSelector } from "@/common/hooks"
import { Login } from "@/features/auth/ui/Login/Login.tsx"
import { Route, Routes } from "react-router"

export const Path = {
  Main: "/",
  Login: "login",
  Faq: "faq",
  NotFound: "*",
} as const

export const Routing = () => {
  const isLoggedIn = useAppSelector(selectIsLoggedIn)

  return (
    <Routes>
      <Route element={<ProtectedRoute isAllowed={isLoggedIn} />}>
        <Route path={Path.Main} element={<Main />} />
      </Route>

      <Route element={<ProtectedRoute isAllowed={!isLoggedIn} redirectPath={Path.Main} />}>
        <Route path={Path.Login} element={<Login />} />
      </Route>

      <Route path={Path.NotFound} element={<PageNotFound />} />
      <Route path={Path.Faq} element={<Faq />} />
    </Routes>
  )
}

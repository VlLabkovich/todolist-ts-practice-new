import { AUTH_TOKEN } from "@/common/constants"
import { instance } from "@/common/instance"
import type { BaseResponse } from "@/common/types"
import type { Todolist } from "@/features/todolists/api/todolistsApi.types.ts"
import type { DomainTodolist } from "@/features/todolists/model/todolists-slice.ts"
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

export const todolistsApi = createApi({
  reducerPath: "todolistsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_BASE_URL,
    prepareHeaders: (headers) => {
      headers.set("API-KEY", import.meta.env.VITE_API_KEY)
      headers.set("Authorization", `Bearer ${localStorage.getItem(AUTH_TOKEN)}`)
    },
  }),
  endpoints: (build) => ({
    getTodolists: build.query<DomainTodolist[], void>({
      query: () => "todo-lists",
      transformResponse: (todolists: Todolist[]): DomainTodolist[] => {
        return todolists.map((todolist) => ({ ...todolist, filter: "all", entityStatus: "idle" }))
      },
      // debugger
    }),
  }),
})

export const _todolistsApi = {
  // 3
  getTodolists() {
    // 4
    return instance.get<Todolist[]>("/todo-lists")
  },
  changeTodolistTitle(id: string, title: string) {
    return instance.put<BaseResponse>(`/todo-lists/${id}`, { title })
  },
  createTodolist(title: string) {
    return instance.post<BaseResponse<{ item: Todolist }>>("/todo-lists", { title })
  },
  deleteTodolist(id: string) {
    return instance.delete<BaseResponse>(`/todo-lists/${id}`)
  },
}

export const { useGetTodolistsQuery, useLazyGetTodolistsQuery } = todolistsApi

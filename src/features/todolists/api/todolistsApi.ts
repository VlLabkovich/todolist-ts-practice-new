import { baseApi } from "@/app/baseApi.ts"
import type { BaseResponse } from "@/common/types"
import type { Todolist } from "@/features/todolists/api/todolistsApi.types.ts"
import type { DomainTodolist } from "@/features/todolists/lib/types"

export const todolistsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getTodolists: build.query<DomainTodolist[], void>({
      query: () => ({
        url: "/todo-lists",
        method: "GET",
      }),
      transformResponse: (todolists: Todolist[]): DomainTodolist[] =>
        todolists.map((todolist) => ({ ...todolist, filter: "all", entityStatus: "idle" })),
      providesTags: ["Todolist"],
    }),

    createTodolist: build.mutation<BaseResponse<{ item: Todolist }>, string>({
      query: (title) => ({
        url: "/todo-lists",
        method: "POST",
        body: { title },
      }),
      invalidatesTags: ["Todolist"],
    }),

    deleteTodolist: build.mutation<BaseResponse, string>({
      query: (id) => ({
        url: `/todo-lists/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Todolist"],
    }),

    changeTodolistTitle: build.mutation<BaseResponse, { id: string; title: string }>({
      query: ({ id, title }) => ({
        url: `/todo-lists/${id}`,
        method: "PUT",
        body: { title },
      }),
      invalidatesTags: ["Todolist"],
    }),
  }),
})

export const {
  useGetTodolistsQuery,
  useCreateTodolistMutation,
  useDeleteTodolistMutation,
  useChangeTodolistTitleMutation,
  useLazyGetTodolistsQuery,
} = todolistsApi

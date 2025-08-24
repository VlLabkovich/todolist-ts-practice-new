import { AUTH_TOKEN } from "@/common/constants"
import { handleError } from "@/common/utils"
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

export const baseApi = createApi({
  reducerPath: "todolistsApi",
  tagTypes: ["Todolist", "Task"],

  baseQuery: async (args, api, extraOptions) => {
    const result = await fetchBaseQuery({
      baseUrl: import.meta.env.VITE_BASE_URL,
      prepareHeaders: (headers) => {
        headers.set("API-KEY", import.meta.env.VITE_API_KEY)
        headers.set("Authorization", `Bearer ${localStorage.getItem(AUTH_TOKEN)}`)
      },
    })(args, api, extraOptions)

    // let error = 'Some error occurred'
    //
    // if (result.error) {
    //   switch (result.error.status) {
    //     case 'FETCH_ERROR':
    //     case 'PARSING_ERROR':
    //     case 'CUSTOM_ERROR':
    //       error = result.error.error
    //       break
    //     case 403:
    //       error = '403 Forbidden Error. Check API-KEY'
    //       break
    //     case 400:
    //     case 500:
    //       if (isErrorWithMessage(result.error.data)) {
    //         error = result.error.data.message
    //       } else {
    //         error = JSON.stringify(result.error.data)
    //       }
    //       break
    //     default:
    //       error = JSON.stringify(result.error)
    //       break
    //   }
    //   api.dispatch(setAppErrorAC({ error }))
    // }
    //
    // // 2. Result code errors
    // if ((result.data as { resultCode: ResultCode }).resultCode === ResultCode.Error) {
    //   const messages = (result.data as { messages: string[] }).messages
    //   error = messages.length ? messages[0] : error
    //   api.dispatch(setAppErrorAC({ error }))
    // }
    // debugger
    handleError(api, result)
    return result
  },

  endpoints: () => ({}),
})

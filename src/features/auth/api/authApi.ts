import { baseApi } from "@/app/baseApi.ts"
import type { BaseResponse } from "@/common/types"
import type { LoginInputs } from "@/features/auth/lib/schemas/loginSchema.ts"

export const authApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    me: build.query<BaseResponse<{ id: number; email: string; login: string }>, void>({
      query: () => ({
        url: "/auth/me",
        method: "GET",
      }),
    }),

    login: build.mutation<BaseResponse<{ userId: number; token: string }>, LoginInputs>({
      query: (data) => ({
        url: "auth/login",
        method: "POST",
        body: data,
      }),
    }),

    logout: build.mutation<BaseResponse, void>({
      query: () => ({
        url: "auth/login",
        method: "DELETE",
      }),
    }),

    getCaptchaUrl: build.mutation<{ url: string }, void>({
      query: () => ({
        url: "/security/get-captcha-url",
        method: "GET",
      }),
    }),
  }),
})

export const { useMeQuery, useLoginMutation, useLogoutMutation, useGetCaptchaUrlMutation } = authApi
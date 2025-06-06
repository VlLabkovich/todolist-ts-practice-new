import { z } from "zod"

export const loginSchema = z.object({
  email: z.string()
    .min(1, { message: "Email не должен быть пустым" })
    .regex(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/),
  password: z.string().min(3, { message: "Минимальное количество символов 3" }),
  rememberMe: z.boolean(),
})

export type Inputs = z.infer<typeof loginSchema>
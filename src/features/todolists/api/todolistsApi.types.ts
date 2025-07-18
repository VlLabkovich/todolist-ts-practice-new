import { z } from "zod/v4"

export const TodolistSchema = z.object({
  id: z.string(),
  title: z.string(),
  addedDate: z.iso.datetime({ local: true }),
  order: z.int(),
})

export type Todolist = z.infer<typeof TodolistSchema>


// import { z } from "zod"
// export const TodolistSchema = z.object({
//   id: z.string(),
//   title: z.string(),
//   order: z.number(),
//   addedDate: z.string().datetime({ local: true }),
// })
//
// export type Todolist = z.infer<typeof TodolistSchema>
import { TaskPriority, TaskStatus } from "@/common/enums"
import { createAppSlice } from "@/common/utils"
import { tasksApi } from "@/features/todolists/api/tasksApi.ts"
import type { DomainTask } from "@/features/todolists/api/tasksApi.types.ts"
import { createTodolistTC, deleteTodolistTC } from "@/features/todolists/model/todolists-slice.ts"
import { nanoid } from "@reduxjs/toolkit"

// export type Task = {
//   id: string
//   title: string
//   isDone: boolean
// }

export type TasksState = Record<string, DomainTask[]>

export const tasksSlice = createAppSlice({
  name: "tasks",
  initialState: {} as TasksState,
  reducers: (create) => ({
    deleteTaskAC: create.reducer<{ todolistId: string; taskId: string }>((state, action) => {
      const index = state[action.payload.todolistId].findIndex((t) => t.id === action.payload.taskId)
      if (index !== -1) {
        state[action.payload.todolistId].splice(index, 1)
      }
    }),
    createTaskAC: create.reducer<{ todolistId: string; title: string }>((state, action) => {
      const newTask: DomainTask = {
        title: action.payload.title,
        todoListId: action.payload.todolistId,
        startDate: '',
        priority: TaskPriority.Low,
        description: '',
        deadline: '',
        status: TaskStatus.New,
        addedDate: '',
        order: 0,
        id: nanoid(),
      }
      state[action.payload.todolistId].unshift(newTask)
    }),
    changeTaskStatusAC: create.reducer<{ todolistId: string; taskId: string; isDone: boolean }>((state, action) => {
      const task = state[action.payload.todolistId].find((t) => t.id === action.payload.taskId)
      if (task) {
        task.status = action.payload.isDone ? TaskStatus.Completed : TaskStatus.New
      }
    }),
    changeTaskTitleAC: create.reducer<{ todolistId: string; taskId: string; title: string }>((state, action) => {
      const taskTitle = state[action.payload.todolistId].find((t) => t.id === action.payload.taskId)
      if (taskTitle) {
        taskTitle.title = action.payload.title
      }
    }),

    fetchTasksTC: create.asyncThunk(
      async (todolistId: string, thunkAPI) => {
        try {
          const res = await tasksApi.getTasks(todolistId)
          return { todolistId, tasks: res.data.items }
        } catch (error) {
          return thunkAPI.rejectWithValue(null)
        }
      },
      {
        fulfilled: (state, action) => {
          state[action.payload.todolistId] = action.payload.tasks
        },
      },
    ),
  }),
  extraReducers: (builder) => {
    builder
      .addCase(createTodolistTC.fulfilled, (state, action) => {
        state[action.payload.todolist.id] = []
      })

      .addCase(deleteTodolistTC.fulfilled, (state, action) => {
        delete state[action.payload.id]
      })
  },
  selectors: {
    selectTasks: (state) => state,
  },
})
export const { fetchTasksTC, deleteTaskAC, createTaskAC, changeTaskStatusAC, changeTaskTitleAC } = tasksSlice.actions
export const tasksReducer = tasksSlice.reducer
export const { selectTasks } = tasksSlice.selectors

// Old code with createAction and createReducer
//
// // const initialState: TasksState = {}
// //
// // export const tasksReducer = createReducer(initialState, (builder) => {
// //   builder
// //     .addCase(deleteTaskAC, (state, action) => {
// //       const tasks = state[action.payload.todolistId]
// //       const index = tasks.findIndex((task) => task.id === action.payload.taskId)
// //       if (index !== -1) {
// //         tasks.splice(index, 1)
// //       }
// //     })
// //     .addCase(createTaskAC, (state, action) => {
// //       const newTask: Task = { title: action.payload.title, isDone: false, id: nanoid() }
// //       state[action.payload.todolistId].unshift(newTask)
// //     })
// //     .addCase(changeTaskStatusAC, (state, action) => {
// //       const task = state[action.payload.todolistId].find((task) => task.id === action.payload.taskId)
// //       if (task) {
// //         task.isDone = action.payload.isDone
// //       }
// //     })
// //     .addCase(changeTaskTitleAC, (state, action) => {
// //       const task = state[action.payload.todolistId].find((task) => task.id === action.payload.taskId)
// //       if (task) {
// //         task.title = action.payload.title
// //       }
// //     })
// //     .addCase(createTodolistAC, (state, action) => {
// //       state[action.payload.id] = []
// //     })
// //     .addCase(deleteTodolistAC, (state, action) => {
// //       delete state[action.payload.id]
// //     })
// // })
// //
// //
// // export const deleteTaskAC = createAction<{ todolistId: string; taskId: string }>("tasks/deleteTask")
// // export const createTaskAC = createAction<{ todolistId: string; title: string }>("tasks/createTask")
// // export const changeTaskStatusAC = createAction<{ todolistId: string; taskId: string; isDone: boolean }>(
// //   "tasks/changeTaskStatus",
// // )
// // export const changeTaskTitleAC = createAction<{ todolistId: string; taskId: string; title: string }>(
// //   "tasks/changeTaskTitle",
// // )
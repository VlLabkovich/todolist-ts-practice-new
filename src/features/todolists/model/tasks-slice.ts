import type { RootState } from "@/app/store.ts"
import { createAppSlice } from "@/common/utils"
import { tasksApi } from "@/features/todolists/api/tasksApi.ts"
import type { DomainTask, UpdateTaskModel } from "@/features/todolists/api/tasksApi.types.ts"
import { createTodolistTC, deleteTodolistTC } from "@/features/todolists/model/todolists-slice.ts"

export type TasksState = Record<string, DomainTask[]>

export const tasksSlice = createAppSlice({
  name: "tasks",
  initialState: {} as TasksState,
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
  reducers: (create) => ({

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

    createTaskTC: create.asyncThunk(
      async (payload: { todolistId: string; title: string }, thunkAPI) => {
        try {
          const res = await tasksApi.createTask(payload)
          return { task: res.data.data.item }
        } catch (error) {
          return thunkAPI.rejectWithValue(null)
        }
      },
      {
        fulfilled: (state, action) => {
          state[action.payload.task.todoListId].unshift(action.payload.task)
        },
      },
    ),

    deleteTaskTC: create.asyncThunk(
      async (payload: { todolistId: string; taskId: string }, thunkAPI) => {
        try {
          await tasksApi.deleteTask(payload)
          return payload
        } catch (error) {
          return thunkAPI.rejectWithValue(null)
        }
      },
      {
        fulfilled: (state, action) => {
          const tasks = state[action.payload.todolistId]
          const index = tasks.findIndex((t) => t.id === action.payload.taskId)
          if (index !== -1) {
            tasks.splice(index, 1)
          }
        },
      },
    ),

    updateTaskTC: create.asyncThunk(
      async (
        payload: { todolistId: string; taskId: string; domainModel: Partial<UpdateTaskModel> },
        { getState, rejectWithValue },
      ) => {
        const { todolistId, taskId, domainModel: updates } = payload
        try {
          const tasksForTodolist = (getState() as RootState).tasks[todolistId]
          const task = tasksForTodolist.find((task) => task.id === taskId)

          if (!task) {
            return rejectWithValue(null)
          }

          const model: UpdateTaskModel = {
            description: updates.description ?? task.description,
            priority: updates.priority ?? task.priority,
            startDate: updates.startDate ?? task.startDate,
            deadline: updates.deadline ?? task.deadline,
            status: updates.status ?? task.status,
            title: updates.title ?? task.title,
          }
          const res = await tasksApi.updateTask({ todolistId, taskId, model })
          // debugger
          return { task: res.data.data.item }
        } catch (error) {
          return rejectWithValue(null)
        }
      },
      {
        fulfilled: (state, action) => {
          // получаем updatedTask с сервера
          const updatedTask = action.payload.task

          // находим массив задач по todoListId
          const tasksForTodolist = state[updatedTask.todoListId]

          // если массив тасок для данного тудулиста не найте, то
          // просто выходим
          if (!tasksForTodolist) return

          // если массив тасок найден,
          // то ищем индекс задачи по todoListId
          const index = tasksForTodolist.findIndex((i) => i.id === updatedTask.id)

          // если индекс задачи найден
          // то заменяем старую таску на новую
          if (index !== -1) {
            tasksForTodolist[index] = updatedTask
          }
        },
      },
    ),
  }),
})
export const { fetchTasksTC, createTaskTC, deleteTaskTC, updateTaskTC } = tasksSlice.actions
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

// changeTaskStatusTC: create.asyncThunk(
//   async (payload: { todolistId: string; taskId: string; status: TaskStatus }, thunkAPI) => {
//     const { todolistId, taskId, status } = payload
//     try {
//       // const state = thunkAPI.getState() as RootState
//       // const tasks = state.tasks
//       const tasksForTodolist = (thunkAPI.getState() as RootState).tasks[todolistId]
//       const task = tasksForTodolist.find((task) => task.id === taskId)
//
//       if (!task) {
//         return thunkAPI.rejectWithValue(null)
//       }
//
//       const model: UpdateTaskModel = {
//         description: task.description,
//         title: task.title,
//         priority: task.priority,
//         startDate: task.startDate,
//         deadline: task.deadline,
//         status,
//       }
//
//       const res = await tasksApi.updateTask({ todolistId, taskId, model })
//       return { task: res.data.data.item }
//     } catch (error) {
//       return thunkAPI.rejectWithValue(null)
//     }
//   },
//   {
//     fulfilled: (state, action) => {
//       const task = state[action.payload.task.todoListId].find((t) => t.id === action.payload.task.id)
//       if (task) {
//         task.status = action.payload.task.status
//       }
//     },
//   },
// ),

// changeTaskTitleTC: create.asyncThunk(
//   async (payload: { todolistId: string; taskId: string; title: string }, thunkAPI) => {
//     const { todolistId, taskId, title } = payload
//     try {
//       // const state = thunkAPI.getState() as RootState
//       // const tasks = state.tasks
//       const tasksForTodolist = (thunkAPI.getState() as RootState).tasks[todolistId]
//       const task = tasksForTodolist.find((task) => task.id === taskId)
//
//       if (!task) {
//         return thunkAPI.rejectWithValue(null)
//       }
//
//       const model: UpdateTaskModel = {
//         description: task.description,
//         priority: task.priority,
//         startDate: task.startDate,
//         deadline: task.deadline,
//         status: task.status,
//         title,
//       }
//
//       const res = await tasksApi.updateTask({ todolistId, taskId, model })
//       return { task: res.data.data.item }
//     } catch (error) {
//       return thunkAPI.rejectWithValue(null)
//     }
//   },
//   {
//     fulfilled: (state, action) => {
//       const taskTitle = state[action.payload.task.todoListId].find((t) => t.id === action.payload.task.id)
//       if (taskTitle) {
//         taskTitle.title = action.payload.task.title
//       }
//     },
//   },
// ),

// deleteTaskAC: create.reducer<{ todolistId: string; taskId: string }>((state, action) => {
//   const index = state[action.payload.todolistId].findIndex((t) => t.id === action.payload.taskId)
//   if (index !== -1) {
//     state[action.payload.todolistId].splice(index, 1)
//   }
// }),

// createTaskAC: create.reducer<{ todolistId: string; title: string }>((state, action) => {
//   const newTask: DomainTask = {
//     title: action.payload.title,
//     todoListId: action.payload.todolistId,
//     startDate: "",
//     priority: TaskPriority.Low,
//     description: "",
//     deadline: "",
//     status: TaskStatus.New,
//     addedDate: "",
//     order: 0,
//     id: nanoid(),
//   }
//   state[action.payload.todolistId].unshift(newTask)
// }),

// changeTaskStatusAC: create.reducer<{ todolistId: string; taskId: string; isDone: boolean }>((state, action) => {
//   const task = state[action.payload.todolistId].find((t) => t.id === action.payload.taskId)
//   if (task) {
//     task.status = action.payload.isDone ? TaskStatus.Completed : TaskStatus.New
//   }
// }),
// changeTaskTitleAC: create.reducer<{ todolistId: string; taskId: string; title: string }>((state, action) => {
//   const taskTitle = state[action.payload.todolistId].find((t) => t.id === action.payload.taskId)
//   if (taskTitle) {
//     taskTitle.title = action.payload.title
//   }
// }),
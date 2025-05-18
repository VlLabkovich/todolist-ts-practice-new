import { TaskPriority, TaskStatus } from "@/common/enums"
import type { DomainTask } from "@/features/todolists/api/tasksApi.types.ts"
import { createTodolistTC, deleteTodolistTC } from "@/features/todolists/model/todolists-slice.ts"
import { nanoid } from "@reduxjs/toolkit"
import { beforeEach, expect, test } from "vitest"
import { createTaskTC, deleteTaskTC, tasksReducer, type TasksState, updateTaskTC } from "../tasks-slice.ts"

let startState: TasksState = {}

const taskDefaultValues = {
  description: "",
  deadline: "",
  addedDate: "",
  startDate: "",
  priority: TaskPriority.Low,
  order: 0,
}

beforeEach(() => {
  startState = {
    todolistId1: [
      {
        id: "1",
        title: "CSS",
        status: TaskStatus.New,
        todoListId: "todolistId1",
        ...taskDefaultValues,
      },
      {
        id: "2",
        title: "JS",
        status: TaskStatus.Completed,
        todoListId: "todolistId1",
        ...taskDefaultValues,
      },
      {
        id: "3",
        title: "React",
        status: TaskStatus.New,
        todoListId: "todolistId1",
        ...taskDefaultValues,
      },
    ],
    todolistId2: [
      {
        id: "1",
        title: "bread",
        status: TaskStatus.New,
        todoListId: "todolistId2",
        ...taskDefaultValues,
      },
      {
        id: "2",
        title: "milk",
        status: TaskStatus.Completed,
        todoListId: "todolistId2",
        ...taskDefaultValues,
      },
      {
        id: "3",
        title: "tea",
        status: TaskStatus.New,
        todoListId: "todolistId2",
        ...taskDefaultValues,
      },
    ],
  }
})

// beforeEach(() => {
//   startState = {
//     todolistId1: [
//       { id: "1", title: "CSS", isDone: false },
//       { id: "2", title: "JS", isDone: true },
//       { id: "3", title: "React", isDone: false },
//     ],
//     todolistId2: [
//       { id: "1", title: "bread", isDone: false },
//       { id: "2", title: "milk", isDone: true },
//       { id: "3", title: "tea", isDone: false },
//     ],
//   }
// })

test("correct task should be deleted", () => {
  const endState = tasksReducer(
    startState,
    deleteTaskTC.fulfilled({ todolistId: "todolistId1", taskId: "2" }, "requestId", {
      todolistId: "todolistId1",
      taskId: "2",
    }),
  )

  expect(endState).toEqual({
    todolistId1: [
      {
        id: "1",
        title: "CSS",
        status: TaskStatus.New,
        todoListId: "todolistId1",
        ...taskDefaultValues,
      },
      {
        id: "3",
        title: "React",
        status: TaskStatus.New,
        todoListId: "todolistId1",
        ...taskDefaultValues,
      },
    ],
    todolistId2: [
      {
        id: "1",
        title: "bread",
        status: TaskStatus.New,
        todoListId: "todolistId2",
        ...taskDefaultValues,
      },
      {
        id: "2",
        title: "milk",
        status: TaskStatus.Completed,
        todoListId: "todolistId2",
        ...taskDefaultValues,
      },
      {
        id: "3",
        title: "tea",
        status: TaskStatus.New,
        todoListId: "todolistId2",
        ...taskDefaultValues,
      },
    ],
  })
})

test("correct task should be created at correct array", () => {
  const title = "juice"

  const newTask = {
    id: "4",
    title,
    status: TaskStatus.New,
    todoListId: "todolistId2",
    ...taskDefaultValues,
  }

  const endState = tasksReducer(
    startState,
    createTaskTC.fulfilled({ task: newTask }, "requestId", { todolistId: "todolistId2", title: "juice" }),
  )

  expect(endState.todolistId1.length).toBe(3)
  expect(endState.todolistId2.length).toBe(4)
  expect(endState.todolistId2[0].id).toBeDefined()
  expect(endState.todolistId2[0].title).toBe("juice")
  expect(endState.todolistId2[0].status).toBe(0)
})

test("correct task should change its status", () => {
  const newTask: DomainTask = {
    id: "2",
    title: "milk",
    status: TaskStatus.New,
    todoListId: "todolistId2",
    ...taskDefaultValues,
  }

  const endState = tasksReducer(
    startState,
    updateTaskTC.fulfilled({ task: newTask }, "requestId", {
      todolistId: "todolistId2",
      taskId: "2",
      domainModel: { status: TaskStatus.New },
    }),
  )

  expect(endState.todolistId2[1].status).toBe(TaskStatus.New)
  expect(endState.todolistId1[1].status).toBe(TaskStatus.Completed)
})

test("correct task should change its title", () => {
  const newTitle = "coffee"

  const newTask: DomainTask = {
    id: "2",
    title: newTitle,
    status: TaskStatus.New,
    todoListId: "todolistId2",
    ...taskDefaultValues,
  }

  const endState = tasksReducer(
    startState,
    updateTaskTC.fulfilled({ task: newTask }, "requestId", {
      todolistId: "todolistId2",
      taskId: "2",
      domainModel: { title: newTitle },
    }),
  )

  expect(endState.todolistId2[1].title).toBe(newTitle)
  expect(endState.todolistId1[1].title).toBe("JS")
})

test("correct task should be deleted", () => {
  const endState = tasksReducer(
    startState,
    deleteTaskTC.fulfilled({ todolistId: "todolistId1", taskId: "2" }, "requestId", {
      todolistId: "todolistId1",
      taskId: "2",
    }),
  )

  expect(endState["todolistId1"].length).toBe(2)
  expect(endState["todolistId2"].length).toBe(3)
  expect(endState["todolistId1"].some((t) => t.id === "2")).toBeFalsy() // Убедимся, что задача с id "2" удалена
})

test("array should be created for new todolist", () => {

  const title = "New todolist"

  const newTodolist = {
    id: nanoid(),
    title,
    order: 0,
    addedDate: "",
  }

  const endState = tasksReducer(
    startState,
    createTodolistTC.fulfilled({ todolist: newTodolist }, "requestId", title))

  const keys = Object.keys(endState)
  const newKey = keys.find((k) => k !== "todolistId1" && k !== "todolistId2")
  if (!newKey) {
    throw Error("New key should be added")
  }

  expect(keys.length).toBe(3)
  expect(endState[newKey]).toEqual([])
})

test("property with todolistId should be deleted", () => {

  const endState = tasksReducer(startState,
    deleteTodolistTC.fulfilled({ id: "todolistId2" },"requestId", "todolistId2" )
  )
  const keys = Object.keys(endState)

  expect(keys.length).toBe(1)
  expect(endState["todolistId2"]).not.toBeDefined()
  // or
  expect(endState["todolistId2"]).toBeUndefined()
})

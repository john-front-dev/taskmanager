import type { Task, Column } from "@/lib/types"

export function getCurrentWeekRange() {
  const now = new Date()
  const dayOfWeek = now.getDay() 
  const startDay = new Date(now)
  startDay.setDate(now.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1))
  startDay.setHours(0, 0, 0, 0)

  const endDay = new Date(startDay)
  endDay.setDate(startDay.getDate() + 6)
  endDay.setHours(23, 59, 59, 999)

  return { startDay, endDay }
}

export function getTasksForCurrentWeek(tasks: Task[]) {
  const { startDay, endDay } = getCurrentWeekRange()
  return tasks.filter((task) => {
    const taskDate = new Date(task.createdAt)
    return taskDate >= startDay && taskDate <= endDay
  })
}

export function getTaskStats(tasks: Task[], columns: Column[]) {
  const weekTasks = getTasksForCurrentWeek(tasks)

  const doneColumnId =
    columns.find(
      (col) =>
        col.title.toLowerCase().includes("выполнено") ||
        col.title.toLowerCase().includes("готово") ||
        col.title.toLowerCase().includes("done"),
    )?.id || columns[columns.length - 1]?.id

  const completedTasks = weekTasks.filter((task) => task.columnId === doneColumnId)

  return {
    total: weekTasks.length,
    completed: completedTasks.length,
    remaining: weekTasks.length - completedTasks.length,
  }
}

export function formatDate(date: Date) {
  return new Intl.DateTimeFormat("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date)
}

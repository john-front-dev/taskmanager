"use client";

import type { Task, Column, User } from "@/lib/types";

const TASKS_KEY = "taskmanager_tasks";
const COLUMNS_KEY = "taskmanager_columns";
const USERS_KEY = "taskmanager_users";

const initialColumns: Column[] = [
  { id: "column-1", title: "К выполнению", order: 0 },
  { id: "column-2", title: "В процессе", order: 1 },
  { id: "column-3", title: "Выполнено", order: 2 },
];

const initialUsers: User[] = [
  { id: "user-1", name: "Александр Петров", avatar: "/default-user.jpg" },
  { id: "user-2", name: "Елена Смирнова", avatar: "/default-user.jpg" },
  { id: "user-3", name: "Дмитрий Иванов", avatar: "/default-user.jpg" },
];

const initialTasks: Task[] = [
  {
    id: "task-1",
    title: "Создать дизайн проекта",
    description: "Разработать UI/UX для новой версии приложения",
    columnId: "column-1",
    createdAt: new Date().toISOString(),
    order: 0,
    assignedTo: "user-1",
  },
  {
    id: "task-2",
    title: "Настроить CI/CD",
    description: "Настроить автоматическую сборку и деплой проекта",
    columnId: "column-1",
    createdAt: new Date().toISOString(),
    order: 1,
  },
  {
    id: "task-3",
    title: "Написать тесты",
    description: "Покрыть основной функционал unit-тестами",
    columnId: "column-2",
    createdAt: new Date().toISOString(),
    order: 0,
    assignedTo: "user-2",
  },
  {
    id: "task-4",
    title: "Обновить документацию",
    description: "Актуализировать документацию API",
    columnId: "column-3",
    createdAt: new Date().toISOString(),
    order: 0,
    assignedTo: "user-3",
  },
];

export function getTasks(): Task[] {
  if (typeof window === "undefined") return [];

  try {
    const tasks = localStorage.getItem(TASKS_KEY);
    return tasks ? JSON.parse(tasks) : initialTasks;
  } catch (error) {
    console.error("Ошибка при получении задач:", error);
    return initialTasks;
  }
}

export function saveTasks(tasks: Task[]) {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
  } catch (error) {
    console.error("Ошибка при сохранении задач:", error);
  }
}

export function getColumns(): Column[] {
  if (typeof window === "undefined") return [];

  try {
    const columns = localStorage.getItem(COLUMNS_KEY);
    return columns ? JSON.parse(columns) : initialColumns;
  } catch (error) {
    console.error("Ошибка при получении колонок:", error);
    return initialColumns;
  }
}

export function saveColumns(columns: Column[]) {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(COLUMNS_KEY, JSON.stringify(columns));
  } catch (error) {
    console.error("Ошибка при сохранении колонок:", error);
  }
}

export function getUsers(): User[] {
  if (typeof window === "undefined") return [];

  try {
    const users = localStorage.getItem(USERS_KEY);
    return users ? JSON.parse(users) : initialUsers;
  } catch (error) {
    console.error("Ошибка при получении пользователей:", error);
    return initialUsers;
  }
}

export function saveUsers(users: User[]) {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  } catch (error) {
    console.error("Ошибка при сохранении пользователей:", error);
  }
}

export function getTaskById(taskId: string): Task | undefined {
  const tasks = getTasks();
  return tasks.find((task) => task.id === taskId);
}

export function updateTask(updatedTask: Task) {
  const tasks = getTasks();
  const updatedTasks = tasks.map((task) =>
    task.id === updatedTask.id ? updatedTask : task
  );
  saveTasks(updatedTasks);
  return updatedTasks;
}

export function getUserById(userId: string): User | undefined {
  const users = getUsers();
  return users.find((user) => user.id === userId);
}

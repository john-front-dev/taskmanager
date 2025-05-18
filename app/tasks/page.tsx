"use client";

import { useState, useEffect } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
  getTasks,
  saveTasks,
  getColumns,
  saveColumns,
  getUsers,
} from "@/lib/storage";
import type { Task, Column, User } from "@/lib/types";
import TaskColumn from "@/components/task-column";
import AddColumnDialog from "@/components/add-column-dialog";
import AddTaskDialog from "@/components/add-task-dialog";
import TaskDetailDrawer from "@/components/task-detail-drawer";
import { Skeleton } from "@/components/ui/skeleton";

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [columns, setColumns] = useState<Column[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isAddColumnOpen, setIsAddColumnOpen] = useState(false);
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [activeColumn, setActiveColumn] = useState<string | null>(null);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [isTaskDrawerOpen, setIsTaskDrawerOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = setTimeout(() => {
      setTasks(getTasks());
      setColumns(getColumns());
      setUsers(getUsers());
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(loadData);
  }, []);

  useEffect(() => {
    if (tasks.length > 0 && !isLoading) saveTasks(tasks);
  }, [tasks, isLoading]);

  useEffect(() => {
    if (columns.length > 0 && !isLoading) saveColumns(columns);
  }, [columns, isLoading]);

  const handleAddColumn = (title: string) => {
    const newColumn: Column = {
      id: `column-${Date.now()}`,
      title,
      order: columns.length,
    };
    setColumns([...columns, newColumn]);
    setIsAddColumnOpen(false);
  };

  const handleAddTask = (title: string, description: string) => {
    if (!activeColumn) return;

    const tasksInColumn = tasks.filter(
      (task) => task.columnId === activeColumn
    );

    const newTask: Task = {
      id: `task-${Date.now()}`,
      title,
      description,
      columnId: activeColumn,
      createdAt: new Date().toISOString(),
      order: tasksInColumn.length,
    };

    setTasks([...tasks, newTask]);
    setIsAddTaskOpen(false);
  };

  const moveTask = (taskId: string, toColumnId: string, index: number) => {
    setTasks((prevTasks) => {
      const taskToMove = prevTasks.find((t) => t.id === taskId);
      if (!taskToMove) return prevTasks;

      const tasksWithoutMoved = prevTasks.filter((t) => t.id !== taskId);

      const tasksInTargetColumn = tasksWithoutMoved
        .filter((t) => t.columnId === toColumnId)
        .sort((a, b) => a.order - b.order);

      const safeIndex = Math.min(
        Math.max(0, index),
        tasksInTargetColumn.length
      );

      tasksInTargetColumn.splice(safeIndex, 0, {
        ...taskToMove,
        columnId: toColumnId,
      });

      const updatedTasksInColumn = tasksInTargetColumn.map((task, idx) => ({
        ...task,
        order: idx,
      }));

      return [
        ...tasksWithoutMoved.filter((t) => t.columnId !== toColumnId),
        ...updatedTasksInColumn,
      ];
    });
  };

  const openAddTaskDialog = (columnId: string) => {
    setActiveColumn(columnId);
    setIsAddTaskOpen(true);
  };

  const handleTaskClick = (taskId: string) => {
    setSelectedTaskId(taskId);
    setIsTaskDrawerOpen(true);
  };

  const handleTaskUpdate = (updatedTask: Task) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) => (task.id === updatedTask.id ? updatedTask : task))
    );
  };

  const handleDeleteTask = () => {
    if (selectedTaskId) {
      setTasks((prevTasks) =>
        prevTasks.filter((task) => task.id !== selectedTaskId)
      );
      setSelectedTaskId(null);
    }
  };
  return (
    <DndProvider backend={HTML5Backend}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Задачи</h1>
          <Button onClick={() => setIsAddColumnOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Добавить колонку
          </Button>
        </div>

        <div className="flex space-x-4 max-w-[calc(100vw-320px)] no-scrollbar overflow-x-auto pb-4">
          {isLoading ? (
            <>
              <Skeleton className="h-[80vh] min-w-[300px] w-full" />
              <Skeleton className="h-[80vh] min-w-[300px] w-full" />
              <Skeleton className="h-[80vh] min-w-[300px] w-full" />
              <Skeleton className="h-[80vh] min-w-[300px] w-full" />
              <Skeleton className="h-[80vh] min-w-[300px] w-full" />
            </>
          ) : (
            <>
              {columns.map((column) => (
                <TaskColumn
                  key={column.id}
                  column={column}
                  tasks={tasks
                    .filter((task) => task.columnId === column.id)
                    .sort((a, b) => a.order - b.order)}
                  users={users}
                  onAddTask={() => openAddTaskDialog(column.id)}
                  onMoveTask={moveTask}
                  onTaskClick={handleTaskClick}
                />
              ))}
            </>
          )}
        </div>

        <AddColumnDialog
          isOpen={isAddColumnOpen}
          onClose={() => setIsAddColumnOpen(false)}
          onAdd={handleAddColumn}
        />

        <AddTaskDialog
          isOpen={isAddTaskOpen}
          onClose={() => setIsAddTaskOpen(false)}
          onAdd={handleAddTask}
        />

        <TaskDetailDrawer
          taskId={selectedTaskId}
          users={users}
          isOpen={isTaskDrawerOpen}
          onClose={() => setIsTaskDrawerOpen(false)}
          onTaskUpdate={handleTaskUpdate}
          onTaskDelete={handleDeleteTask}
        />
      </div>
    </DndProvider>
  );
}

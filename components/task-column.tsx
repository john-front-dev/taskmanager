"use client";

import { useDrop } from "react-dnd";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import type { Task, Column, User } from "@/lib/types";
import TaskCard from "@/components/task-card";

interface TaskColumnProps {
  column: Column;
  tasks: Task[];
  users: User[];
  onAddTask: () => void;
  onMoveTask: (taskId: string, columnId: string, index: number) => void;
  onTaskClick: (taskId: string) => void;
}

export default function TaskColumn({
  column,
  tasks,
  users,
  onAddTask,
  onMoveTask,
  onTaskClick,
}: TaskColumnProps) {
  const [{ isOver }, drop] = useDrop({
    accept: "TASK",
    drop: (item: { id: string }, monitor) => {
      const didDropOnTask = monitor.didDrop();
      if (!didDropOnTask) {
        onMoveTask(item.id, column.id, tasks.length);
      }
      return { columnId: column.id };
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver({ shallow: true }),
    }),
  });

  return (
    <div
      ref={(node) => drop(node)}
      className={`flex flex-col w-80 min-h-[calc(100vh-150px)] min-w-[250px] rounded-lg border bg-card ${
        isOver ? "bg-muted/50" : ""
      }`}
    >
      <div className="p-4 border-b">
        <h3 className="font-medium">{column.title}</h3>
        <div className="text-xs text-muted-foreground mt-1">
          {tasks.length}{" "}
          {tasks.length === 1
            ? "задача"
            : tasks.length >= 2 && tasks.length <= 4
            ? "задачи"
            : "задач"}
        </div>
      </div>

      <div className="flex-1 p-2 space-y-2 overflow-y-auto">
        {tasks.map((task, index) => (
          <TaskCard
            key={task.id}
            task={task}
            index={index}
            columnId={column.id}
            users={users}
            onMoveTask={onMoveTask}
            onTaskClick={onTaskClick}
          />
        ))}

        {tasks.length === 0 && (
          <div className="h-full min-h-[200px] flex items-center justify-center rounded-md border border-dashed" />
        )}
      </div>

      <div className="p-3 mt-auto border-t">
        <Button
          variant="ghost"
          className="w-full justify-start text-muted-foreground"
          onClick={onAddTask}
        >
          <Plus className="mr-2 h-4 w-4" />
          Добавить задачу
        </Button>
      </div>
    </div>
  );
}

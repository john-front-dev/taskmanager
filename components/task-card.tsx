"use client";

import { useRef } from "react";
import { useDrag, useDrop } from "react-dnd";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { Task, User } from "@/lib/types";

interface TaskCardProps {
  task: Task;
  index: number;
  columnId: string;
  users: User[];
  onMoveTask: (taskId: string, columnId: string, index: number) => void;
  onTaskClick: (taskId: string) => void;
}

export default function TaskCard({
  task,
  index,
  columnId,
  users,
  onMoveTask,
  onTaskClick,
}: TaskCardProps) {
  const ref = useRef<HTMLDivElement>(null);

  const [{ isDragging }, drag] = useDrag({
    type: "TASK",
    item: { id: task.id, index, columnId },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: "TASK",
    hover: (item: { id: string; index: number; columnId: string }, monitor) => {
      if (!ref.current) return;

      const dragIndex = item.index;
      const hoverIndex = index;
      const dragColumnId = item.columnId;
      const hoverColumnId = columnId;

      if (item.id === task.id) return;

      if (dragColumnId === hoverColumnId && dragIndex === hoverIndex) return;

      const hoverBoundingRect = ref.current.getBoundingClientRect();

      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

      const clientOffset = monitor.getClientOffset();
      if (!clientOffset) return;

      const hoverClientY = clientOffset.y - hoverBoundingRect.top;

      let newIndex = hoverIndex;

      if (hoverClientY > hoverMiddleY) {
        newIndex = hoverIndex + 1;
      }

      if (dragColumnId !== hoverColumnId || dragIndex !== newIndex) {
        onMoveTask(
          item.id,
          hoverColumnId,
          newIndex > dragIndex && dragColumnId === hoverColumnId
            ? newIndex - 1
            : newIndex
        );

        item.index =
          newIndex > dragIndex && dragColumnId === hoverColumnId
            ? newIndex - 1
            : newIndex;
        item.columnId = hoverColumnId;
      }
    },
  });

  const dragDropRef = (node: HTMLDivElement | null) => {
    drag(node);
    drop(node);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("ru-RU", {
      day: "numeric",
      month: "short",
    }).format(date);
  };

  const assignedUser = task.assignedTo
    ? users.find((user) => user.id === task.assignedTo)
    : undefined;

  return (
    <div
      ref={dragDropRef}
      style={{ opacity: isDragging ? 0.5 : 1 }}
      className="cursor-grab"
      onClick={() => onTaskClick(task.id)}
    >
      <Card className="shadow-sm hover:shadow-md transition-shadow">
        <CardHeader className="p-3 pb-0">
          <CardTitle className="text-sm font-medium">{task.title}</CardTitle>
        </CardHeader>
        <CardContent className="p-3 pt-2">
          <p className="text-xs text-muted-foreground line-clamp-2">
            {task.description}
          </p>
          <div className="flex items-center justify-between mt-2">
            <div className="text-xs text-muted-foreground">
              {formatDate(task.createdAt)}
            </div>
            {assignedUser && (
              <Avatar className="h-6 w-6">
                <AvatarImage
                  src={assignedUser.avatar || "/default-user.jpg"}
                  alt={assignedUser.name}
                />
                <AvatarFallback>
                  {(assignedUser.name || "")
                    .split(" ")
                    .filter(Boolean)
                    .map((word) => word[0])
                    .slice(0, 2)
                    .join("")
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

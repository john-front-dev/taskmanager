"use client";

import { useState, useEffect } from "react";
import {
  Drawer,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar } from "lucide-react";
import { getTaskById, updateTask, getUserById } from "@/lib/storage";
import type { Task, User } from "@/lib/types";
import { Input } from "./ui/input";

interface TaskDetailDrawerProps {
  taskId: string | null;
  users: User[];
  isOpen: boolean;
  onClose: () => void;
  onTaskUpdate: (task: Task) => void;
  onTaskDelete: () => void;
}

export default function TaskDetailDrawer({
  taskId,
  users,
  isOpen,
  onClose,
  onTaskUpdate,
  onTaskDelete,
}: TaskDetailDrawerProps) {
  const [task, setTask] = useState<Task | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assignedUserId, setAssignedUserId] = useState<string | undefined>(
    undefined
  );

  useEffect(() => {
    if (taskId && isOpen) {
      setIsLoading(true);

      setTimeout(() => {
        const foundTask = getTaskById(taskId);
        if (foundTask) {
          setTask(foundTask);
          setTitle(foundTask.title);
          setDescription(foundTask.description);
          setAssignedUserId(foundTask.assignedTo);
        }
        setIsLoading(false);
      }, 500);
    } else {
      setTask(null);
    }
  }, [taskId, isOpen]);

  const handleSave = () => {
    if (!task) return;

    const updatedTask: Task = {
      ...task,
      title,
      description,
      assignedTo: assignedUserId,
    };

    updateTask(updatedTask);
    onTaskUpdate(updatedTask);
    onClose();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("ru-RU", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const assignedUser = assignedUserId ? getUserById(assignedUserId) : undefined;

  return (
    <Drawer
      open={isOpen}
      onClose={onClose}
      side="right"
      className="w-full max-w-md"
    >
      {isLoading ? (
        <div className="space-y-4 p-2">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      ) : task ? (
        <>
          <DrawerHeader>
            <DrawerTitle>{task.title}</DrawerTitle>
            <div className="flex items-center text-sm text-muted-foreground mt-2">
              <Calendar className="mr-2 h-4 w-4" />
              <span>Создано: {formatDate(task.createdAt)}</span>
            </div>
          </DrawerHeader>

          <div className="space-y-6 px-6">
            <div className="space-y-2">
              <Label htmlFor="description">Название</Label>
              <Input
                id="description"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Название задачи"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Описание</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="min-h-[120px]"
                placeholder="Описание задачи..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="assigned-user">Назначить пользователя</Label>
              <Select value={assignedUserId} onValueChange={setAssignedUserId}>
                <SelectTrigger id="assigned-user" className="w-full">
                  <SelectValue placeholder="Выберите пользователя" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unassigned">Не назначено</SelectItem>
                  {users.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      <div className="flex items-center">
                        <Avatar className="h-6 w-6 mr-2">
                          <AvatarImage
                            src={user.avatar || "/default-user.jpg"}
                            alt={user.name}
                          />
                          <AvatarFallback>
                            {user.name.substring(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        {user.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {assignedUser && (
              <div className="p-4 border rounded-md">
                <h4 className="text-sm font-medium mb-2">Назначено</h4>
                <div className="flex items-center">
                  <Avatar className="h-8 w-8 mr-3">
                    <AvatarImage
                      src={assignedUser.avatar || "/default-user.jpg"}
                      alt={assignedUser.name}
                    />
                    <AvatarFallback>
                      {assignedUser.name.substring(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{assignedUser.name}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <DrawerFooter className="pt-6">
            <Button
              onClick={() => {
                onTaskDelete();
                onClose();
              }}
            >
              Удалить
            </Button>
            <Button variant="outline" onClick={onClose}>
              Отмена
            </Button>
            <Button onClick={handleSave}>Сохранить</Button>
          </DrawerFooter>
        </>
      ) : (
        <div className="flex items-center justify-center h-full">
          <p>Задача не найдена</p>
        </div>
      )}
    </Drawer>
  );
}

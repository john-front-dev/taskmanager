"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getTasks, getColumns } from "@/lib/storage";
import { getTaskStats, getCurrentWeekRange, formatDate } from "@/lib/data";
import type { Task, Column } from "@/lib/types";
import { CheckCircle, Circle, BarChart } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function AnalyticsPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [columns, setColumns] = useState<Column[]>([]);
  const [stats, setStats] = useState({ total: 0, completed: 0, remaining: 0 });
  const { startDay, endDay } = getCurrentWeekRange();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadedTasks = getTasks();
    const loadedColumns = getColumns();
    setTasks(loadedTasks);
    setColumns(loadedColumns);
    setStats(getTaskStats(loadedTasks, loadedColumns));
    setIsLoading(false);
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Аналитика</h1>
        <p className="text-muted-foreground mt-2">
          Статистика задач за текущую неделю ({formatDate(startDay)} -{" "}
          {formatDate(endDay)})
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {isLoading ? (
          <>
            <Skeleton className="w-full h-[125px]" />
            <Skeleton className="w-full h-[125px]" />
            <Skeleton className="w-full h-[125px]" />
          </>
        ) : (
          <>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Всего задач
                </CardTitle>
                <BarChart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.total}</div>
                <p className="text-xs text-muted-foreground">
                  за текущую неделю
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Выполнено</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.completed}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.total > 0
                    ? `${Math.round(
                        (stats.completed / stats.total) * 100
                      )}% от общего числа`
                    : "нет задач"}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Осталось выполнить
                </CardTitle>
                <Circle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.remaining}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.total > 0
                    ? `${Math.round(
                        (stats.remaining / stats.total) * 100
                      )}% от общего числа`
                    : "нет задач"}
                </p>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {isLoading ? 
        <Skeleton className="w-full h-[300px]" />
        :
        <>
          {tasks.length === 0 && (
          <div className="flex h-[300px] items-center justify-center rounded-md border border-dashed">
            <div className="text-center">
              <h3 className="text-lg font-medium">Нет задач</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Создайте задачи на странице "Задачи", чтобы увидеть статистику
              </p>
            </div>
          </div>
         )}
        </>
      }
    </div>
  );
}

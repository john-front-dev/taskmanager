"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, ListTodo } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Sidebar() {
  const pathname = usePathname();

  const navigation = [
    { name: "Аналитика", href: "/", icon: LayoutDashboard },
    { name: "Задачи", href: "/tasks", icon: ListTodo },
  ];

  return (
    <div className="flex flex-col border-r bg-muted/40 w-[240px] min-w-[240px] h-screen">
      <div className="p-6">
        <h1 className="text-2xl font-bold">TaskManager</h1>
      </div>
      <nav className="flex-1 space-y-1 p-4">
        {navigation.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              "flex items-center px-4 py-3 text-sm font-medium rounded-md",
              pathname === item.href
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <item.icon className="mr-3 h-5 w-5" />
            {item.name}
          </Link>
        ))}
      </nav>
    </div>
  );
}

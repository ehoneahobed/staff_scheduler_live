"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  CalendarDays,
  Users,
  Settings,
  BarChart3,
  LogOut,
  Menu,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { HTMLAttributes } from "react";

type SidebarProps = HTMLAttributes<HTMLDivElement>;

export function Sidebar({ className, ...props }: SidebarProps) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { data: session } = useSession();

  const isManager = session?.user?.role === "MANAGER";

  const routes = [
    {
      label: "Schedule",
      icon: CalendarDays,
      href: "/shifts",
      active: pathname === "/shifts",
    },
    ...(isManager
      ? [
          {
            label: "Staff",
            icon: Users,
            href: "/staff",
            active: pathname === "/staff",
          },
          {
            label: "Analytics",
            icon: BarChart3,
            href: "/analytics",
            active: pathname === "/analytics",
          },
        ]
      : []),
    {
      label: "Settings",
      icon: Settings,
      href: "/settings",
      active: pathname === "/settings",
    },
  ];

  return (
    <div
      className={cn(
        "relative flex flex-col h-screen border-r px-3 py-4 bg-background",
        isCollapsed ? "w-16" : "w-64",
        className
      )}
      {...props}
    >
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-2 top-2 h-8 w-8 md:hidden"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <Menu className="h-4 w-4" />
      </Button>
      <div className={cn("flex items-center", isCollapsed ? "justify-center" : "px-2")}>
        <h1 className={cn("font-bold text-xl", isCollapsed && "hidden")}>
          Staff Portal
        </h1>
      </div>
      <ScrollArea className="flex-1 pt-8">
        <div className="space-y-2 px-1">
          {routes.map((route) => (
            <Link key={route.href} href={route.href}>
              <Button
                variant={route.active ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start",
                  isCollapsed && "justify-center px-2"
                )}
              >
                <route.icon className={cn("h-5 w-5", !isCollapsed && "mr-2")} />
                {!isCollapsed && <span>{route.label}</span>}
              </Button>
            </Link>
          ))}
        </div>
      </ScrollArea>
      <div className="mt-auto">
        {!isCollapsed && (
          <div className="mb-2 px-2">
            <p className="text-sm font-medium">{session?.user?.name}</p>
            <p className="text-xs text-muted-foreground">{session?.user?.email}</p>
          </div>
        )}
        <Button
          variant="ghost"
          className={cn("w-full justify-start", isCollapsed && "justify-center px-2")}
          onClick={() => signOut()}
        >
          <LogOut className={cn("h-5 w-5", !isCollapsed && "mr-2")} />
          {!isCollapsed && <span>Logout</span>}
        </Button>
      </div>
    </div>
  );
} 
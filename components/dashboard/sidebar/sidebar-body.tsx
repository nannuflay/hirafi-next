"use client";

import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  CalendarDays,
  CalendarClock,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Brand } from "./brand";
import { NavItem } from "./nav-item";
import { UserMenu } from "./user-menu";
import type { Dictionary } from "@/app/[lang]/dictionaries";

type UserRole = "client" | "vendor";

const VENDOR_NAV = [
  { key: "overview", icon: LayoutDashboard, hrefSuffix: "" },
  { key: "bookings", icon: CalendarDays, hrefSuffix: "/bookings" },
  { key: "availability", icon: CalendarClock, hrefSuffix: "/availability" },
  { key: "profile", icon: User, hrefSuffix: "/profile" },
] as const;

const CLIENT_NAV = [
  { key: "overview", icon: LayoutDashboard, hrefSuffix: "" },
  { key: "bookings", icon: CalendarDays, hrefSuffix: "/bookings" },
  { key: "profile", icon: User, hrefSuffix: "/profile" },
] as const;

export function SidebarBody({
  lang,
  role,
  userName,
  avatarUrl,
  t,
  collapsed,
  onToggle,
  showToggle = true,
}: {
  lang: string;
  role: UserRole;
  userName: string;
  avatarUrl: string | null;
  t: Dictionary["dashboard"]["sidebar"];
  collapsed: boolean;
  onToggle: () => void;
  showToggle?: boolean;
}) {
  const pathname = usePathname();
  const items = role === "vendor" ? VENDOR_NAV : CLIENT_NAV;
  const basePath = `/${lang}/dashboard/${role}`;

  return (
    <TooltipProvider>
      <div className="flex h-full w-full flex-col bg-sidebar">

        <Brand collapsed={collapsed} onToggle={onToggle} showToggle={showToggle} />

        <nav className="flex-1 space-y-1 overflow-hidden px-3 py-4">
          {items.map(({ key, icon, hrefSuffix }) => {
            const href = `${basePath}${hrefSuffix}`;
            const isActive =
              hrefSuffix === "" ? pathname === href : pathname.startsWith(href);

            return (
              <NavItem
                key={key}
                href={href}
                icon={icon}
                label={t[key as keyof typeof t]}
                isActive={isActive}
                collapsed={collapsed}
              />
            );
          })}
        </nav>

        <div
          className={cn(
            "border-t border-sidebar-border p-3",
            collapsed && "px-2",
          )}
        >
          <UserMenu
            lang={lang}
            role={role}
            userName={userName}
            avatarUrl={avatarUrl}
            t={t}
            collapsed={collapsed}
          />
        </div>
      </div>
    </TooltipProvider>
  );
}

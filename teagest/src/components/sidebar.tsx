"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  ClipboardList,
  Calendar,
  MessageSquare,
  Grid3X3,
  UserCircle,
  BarChart3,
  Settings,
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Alumnos", href: "/alumnos", icon: Users },
  { name: "Plan Educativo", href: "/pei", icon: ClipboardList },
  { name: "Sesiones", href: "/sesiones", icon: Calendar },
  { name: "Comunicación", href: "/comunicacion", icon: MessageSquare },
  { name: "Agenda Visual", href: "/agenda-visual", icon: Grid3X3 },
  { name: "Equipo", href: "/equipo", icon: UserCircle },
  { name: "Reportes", href: "/reportes", icon: BarChart3 },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-[260px] bg-sidebar-bg flex flex-col h-screen sticky top-0">
      {/* Logo */}
      <div className="px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-br from-primary-400 to-accent-400 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <div>
            <h1 className="text-[15px] font-semibold text-white tracking-tight">TEAGest</h1>
            <p className="text-[11px] text-sidebar-text/60">Centro Educativo</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 mt-2 space-y-0.5 overflow-y-auto">
        <p className="px-3 py-2 text-[10px] font-semibold text-sidebar-text/40 uppercase tracking-wider">
          Menú
        </p>
        {navigation.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] transition-all duration-150",
                isActive
                  ? "bg-sidebar-active text-white font-medium"
                  : "text-sidebar-text/70 hover:text-white hover:bg-sidebar-hover"
              )}
            >
              <item.icon className={cn("w-[18px] h-[18px]", isActive ? "text-accent-300" : "text-sidebar-text/50")} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Settings */}
      <div className="px-3 pb-2">
        <p className="px-3 py-2 text-[10px] font-semibold text-sidebar-text/40 uppercase tracking-wider">
          Sistema
        </p>
        <Link
          href="/configuracion"
          className={cn(
            "flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] transition-all duration-150",
            pathname === "/configuracion"
              ? "bg-sidebar-active text-white font-medium"
              : "text-sidebar-text/70 hover:text-white hover:bg-sidebar-hover"
          )}
        >
          <Settings className="w-[18px] h-[18px] text-sidebar-text/50" />
          Configuración
        </Link>
      </div>

      {/* User */}
      <div className="px-4 py-4 border-t border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-accent-500 rounded-lg flex items-center justify-center">
            <span className="text-[11px] font-semibold text-white">MR</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-medium text-white truncate">María Rodríguez</p>
            <p className="text-[11px] text-sidebar-text/50">Coordinadora</p>
          </div>
          <div className="w-2 h-2 bg-accent-400 rounded-full" />
        </div>
      </div>
    </aside>
  );
}

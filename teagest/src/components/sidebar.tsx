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
    <aside className="w-[250px] bg-sidebar-bg flex flex-col h-screen sticky top-0">
      {/* Logo */}
      <div className="px-5 py-5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
            <svg className="w-4.5 h-4.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <span className="text-[15px] font-bold text-white tracking-tight">TEAGest</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 mt-1 space-y-0.5 overflow-y-auto">
        {navigation.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] transition-all",
                isActive
                  ? "bg-white/10 text-white font-medium"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              )}
            >
              <item.icon className={cn("w-4 h-4", isActive ? "text-accent" : "text-white/40")} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="px-3 pb-2">
        <Link
          href="/configuracion"
          className={cn(
            "flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] transition-all",
            pathname === "/configuracion"
              ? "bg-white/10 text-white font-medium"
              : "text-white/60 hover:text-white hover:bg-white/5"
          )}
        >
          <Settings className="w-4 h-4 text-white/40" />
          Configuración
        </Link>
      </div>

      <div className="px-4 py-3.5 border-t border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 bg-accent/80 rounded-md flex items-center justify-center">
            <span className="text-[10px] font-bold text-white">MR</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[12px] font-medium text-white/90 truncate">María Rodríguez</p>
            <p className="text-[10px] text-white/40">Coordinadora</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

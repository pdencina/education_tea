"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import {
  LayoutDashboard,
  Users,
  ClipboardList,
  Calendar,
  CalendarClock,
  MessageSquare,
  Grid3X3,
  UserCircle,
  BarChart3,
  Settings,
  FileText,
  UserPlus,
  Stethoscope,
  CheckSquare,
  Receipt,
  Bell,
  TrendingUp,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Agenda", href: "/agenda", icon: CalendarClock },
  { name: "Asistencia", href: "/asistencia", icon: CheckSquare },
  { name: "Alumnos", href: "/alumnos", icon: Users },
  { name: "Lista de Espera", href: "/lista-espera", icon: UserPlus },
  { name: "Evaluaciones", href: "/evaluaciones", icon: FileText },
  { name: "Ficha Clínica", href: "/historial-clinico", icon: Stethoscope },
  { name: "Plan Educativo", href: "/pei", icon: ClipboardList },
  { name: "Sesiones", href: "/sesiones", icon: Calendar },
  { name: "Comunicación", href: "/comunicacion", icon: MessageSquare },
  { name: "Facturación", href: "/facturacion", icon: Receipt },
  { name: "Recordatorios", href: "/recordatorios", icon: Bell },
  { name: "Equipo", href: "/equipo", icon: UserCircle },
  { name: "Reportes", href: "/reportes", icon: BarChart3 },
  { name: "Indicadores", href: "/indicadores", icon: TrendingUp },
];

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const sidebarContent = (
    <>
      {/* Logo */}
      <div className={cn("px-4 py-4 flex items-center", collapsed ? "justify-center" : "gap-2.5")}>
        <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center flex-shrink-0">
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        </div>
        {!collapsed && <span className="text-[14px] font-bold text-white">TEAGest</span>}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 mt-1 space-y-0.5 overflow-y-auto">
        {navigation.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              title={collapsed ? item.name : undefined}
              className={cn(
                "flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] transition-all",
                collapsed && "justify-center px-2",
                isActive
                  ? "bg-white/10 text-white font-medium"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              )}
            >
              <item.icon className={cn("w-4 h-4 flex-shrink-0", isActive ? "text-accent" : "text-white/40")} />
              {!collapsed && item.name}
            </Link>
          );
        })}
      </nav>

      {/* Bottom section */}
      <div className="px-2 pb-2 space-y-0.5">
        <Link
          href="/configuracion"
          onClick={() => setMobileOpen(false)}
          className={cn(
            "flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] transition-all",
            collapsed && "justify-center px-2",
            pathname === "/configuracion"
              ? "bg-white/10 text-white font-medium"
              : "text-white/60 hover:text-white hover:bg-white/5"
          )}
        >
          <Settings className="w-4 h-4 text-white/40 flex-shrink-0" />
          {!collapsed && "Configuración"}
        </Link>

        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className={cn(
            "flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] transition-all w-full text-left",
            collapsed && "justify-center px-2",
            "text-white/60 hover:text-red-300 hover:bg-red-500/10"
          )}
        >
          <LogOut className="w-4 h-4 text-white/40 flex-shrink-0" />
          {!collapsed && "Cerrar Sesión"}
        </button>
      </div>

      {/* Collapse toggle (desktop only) */}
      <div className="hidden lg:block px-2 pb-3">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center justify-center w-full py-1.5 text-white/30 hover:text-white/60 transition"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile hamburger button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-3 left-3 z-50 p-2 bg-sidebar-bg text-white rounded-lg shadow-lg"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black/50" onClick={() => setMobileOpen(false)} />
      )}

      {/* Mobile sidebar */}
      <aside className={cn(
        "lg:hidden fixed inset-y-0 left-0 z-50 w-[250px] bg-sidebar-bg flex flex-col transition-transform duration-200",
        mobileOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <button onClick={() => setMobileOpen(false)} className="absolute top-3 right-3 p-1 text-white/60 hover:text-white">
          <X className="w-5 h-5" />
        </button>
        {sidebarContent}
      </aside>

      {/* Desktop sidebar */}
      <aside className={cn(
        "hidden lg:flex flex-col h-screen sticky top-0 bg-sidebar-bg transition-all duration-200",
        collapsed ? "w-[60px]" : "w-[250px]"
      )}>
        {sidebarContent}
      </aside>
    </>
  );
}

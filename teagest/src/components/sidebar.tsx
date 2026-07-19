"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { GATED_MODULES, isModuleAllowed } from "@/lib/plans";
import { isModuleVisibleForRole } from "@/lib/role-access";
import { isSuperAdmin } from "@/lib/super-admin";
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
  FileSignature,
  Bell,
  TrendingUp,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Shield,
} from "lucide-react";
import { LogoWhite } from "./logo";

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
  { name: "Contratos", href: "/contratos", icon: FileSignature },
  { name: "Recordatorios", href: "/recordatorios", icon: Bell },
  { name: "Agenda Visual", href: "/agenda-visual", icon: Grid3X3 },
  { name: "Equipo", href: "/equipo", icon: UserCircle },
  { name: "Reportes", href: "/reportes", icon: BarChart3 },
  { name: "Indicadores", href: "/indicadores", icon: TrendingUp },
];

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const { data: session } = useSession();
  const tenantPlan = (session?.user as any)?.tenantPlan || "basic";
  const userRole = (session?.user as any)?.role || "TEACHER";
  const userName = (session?.user as any)?.name || "Usuario";
  const userEmail = (session?.user as any)?.email || "";
  const tenantName = (session?.user as any)?.tenantName || "";

  const roleLabels: Record<string, string> = {
    ADMIN: "Admin",
    COORDINATOR: "Coordinador",
    TEACHER: "Docente",
    SPECIALIST: "Especialista",
    FAMILY: "Familia",
  };

  // Filter navigation by role
  const visibleNavigation = navigation.filter((item) => isModuleVisibleForRole(userRole, item.href));

  const sidebarContent = (
    <>
      {/* Logo */}
      <div className={cn("px-4 py-4 flex items-center", collapsed ? "justify-center" : "gap-2.5")}>
        <LogoWhite size={collapsed ? 28 : 32} />
        {!collapsed && <span className="text-[14px] font-bold text-white">TEAGest</span>}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 mt-1 space-y-0.5 overflow-y-auto">
        {visibleNavigation.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          const isLocked = !isSuperAdmin(userEmail) && !isModuleAllowed(tenantPlan, item.href);
          const href = isLocked ? `/upgrade?module=${encodeURIComponent(item.href)}` : item.href;

          return (
            <Link
              key={item.name}
              href={href}
              onClick={() => setMobileOpen(false)}
              title={collapsed ? item.name : undefined}
              className={cn(
                "flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] transition-all",
                collapsed && "justify-center px-2",
                isLocked && "opacity-60",
                isActive && !isLocked
                  ? "bg-white/10 text-white font-medium"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              )}
            >
              <item.icon className={cn("w-4 h-4 flex-shrink-0", isActive && !isLocked ? "text-accent" : "text-white/40")} />
              {!collapsed && (
                <span className="flex-1">{item.name}</span>
              )}
              {!collapsed && isLocked && (
                <svg className="w-3 h-3 text-white/30 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom section */}
      <div className="px-2 pb-2 space-y-0.5">
        {isModuleVisibleForRole(userRole, "/configuracion") && (
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
        )}

        {isSuperAdmin(userEmail) && (
          <Link
            href="/admin-panel"
            onClick={() => setMobileOpen(false)}
            className={cn(
              "flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] transition-all",
              collapsed && "justify-center px-2",
              pathname === "/admin-panel"
                ? "bg-accent/20 text-accent font-medium"
                : "text-accent/70 hover:text-accent hover:bg-accent/10"
            )}
          >
            <Shield className="w-4 h-4 flex-shrink-0" />
            {!collapsed && "Super Admin"}
          </Link>
        )}

        <button
          onClick={() => setShowLogoutConfirm(true)}
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

      {/* User info */}
      {!collapsed && (
        <div className="px-3 py-3 border-t border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-accent/80 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-[10px] font-bold text-white">
                {userName.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[12px] font-medium text-white/90 truncate">{userName}</p>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] text-white/40 truncate">{userEmail}</span>
              </div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="px-1.5 py-0.5 bg-white/10 text-white/70 rounded text-[9px] font-medium">{roleLabels[userRole] || userRole}</span>
                {tenantName && <span className="text-[9px] text-white/30 truncate">{tenantName}</span>}
              </div>
            </div>
          </div>
        </div>
      )}

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

      {/* Logout confirmation dialog */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowLogoutConfirm(false)} />
          <div className="relative bg-white rounded-2xl shadow-xl p-6 max-w-xs w-full mx-4 text-center">
            <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-3">
              <LogOut className="w-5 h-5 text-red-500" />
            </div>
            <h3 className="text-[15px] font-semibold text-gray-900 mb-1">Cerrar Sesión</h3>
            <p className="text-[13px] text-gray-500 mb-5">¿Estás seguro que deseas salir de la plataforma?</p>
            <div className="flex gap-2">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 py-2.5 border border-gray-200 text-gray-600 rounded-lg text-[13px] font-medium hover:bg-gray-50 transition"
              >
                Cancelar
              </button>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="flex-1 py-2.5 bg-red-500 text-white rounded-lg text-[13px] font-medium hover:bg-red-600 transition"
              >
                Salir
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

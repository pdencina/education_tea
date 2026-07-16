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
  { name: "Dashboard", href: "/alumnos", icon: LayoutDashboard },
  { name: "Alumnos", href: "/alumnos", icon: Users },
  { name: "Plan Educativo (PEI)", href: "/pei", icon: ClipboardList },
  { name: "Sesiones", href: "/sesiones", icon: Calendar },
  { name: "Comunicación", href: "/comunicacion", icon: MessageSquare },
  { name: "Agenda Visual", href: "/agenda-visual", icon: Grid3X3 },
  { name: "Equipo", href: "/equipo", icon: UserCircle },
  { name: "Reportes", href: "/reportes", icon: BarChart3 },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col h-screen sticky top-0">
      {/* Logo */}
      <div className="p-5 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-green-500 rounded-xl flex items-center justify-center">
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-800">TEAGest</h1>
            <p className="text-xs text-gray-500">Centro Arcoíris</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors",
                isActive
                  ? "bg-blue-50 text-blue-700 font-medium"
                  : "text-gray-600 hover:bg-gray-100"
              )}
            >
              <item.icon className="w-5 h-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Settings */}
      <div className="p-3 border-t border-gray-100">
        <Link
          href="/configuracion"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-600 hover:bg-gray-100 transition-colors"
        >
          <Settings className="w-5 h-5" />
          Configuración
        </Link>
      </div>

      {/* User */}
      <div className="p-4 border-t border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-blue-100 rounded-full flex items-center justify-center">
            <span className="text-sm font-medium text-blue-700">MR</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-700 truncate">
              María Rodríguez
            </p>
            <p className="text-xs text-gray-500">Coordinadora</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

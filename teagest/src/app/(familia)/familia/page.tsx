"use client";

import { trpc } from "@/lib/trpc";
import Link from "next/link";

const statusLabels: Record<string, string> = {
  NOT_STARTED: "No iniciado",
  IN_PROGRESS: "En proceso",
  ACHIEVED_WITH_SUPPORT: "Logrado con apoyo",
  ACHIEVED_INDEPENDENT: "Logrado",
};

const statusColors: Record<string, string> = {
  NOT_STARTED: "bg-gray-100 text-gray-600",
  IN_PROGRESS: "bg-yellow-100 text-yellow-700",
  ACHIEVED_WITH_SUPPORT: "bg-blue-100 text-blue-700",
  ACHIEVED_INDEPENDENT: "bg-green-100 text-green-700",
};

export default function FamiliaHomePage() {
  const { data: children, isLoading } = trpc.familyPortal.getMyChildren.useQuery();

  if (isLoading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-48" />
        <div className="h-40 bg-gray-100 rounded-xl" />
      </div>
    );
  }

  if (!children || children.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h2 className="text-lg font-semibold text-gray-800 mb-2">Sin hijos vinculados</h2>
        <p className="text-[13px] text-gray-400">Tu cuenta no tiene ningún niño vinculado. Contacta al centro para que te asocien.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Hola, bienvenido/a</h1>
        <p className="text-[14px] text-gray-400 mt-1">Aquí puedes ver el progreso y las actividades de tu hijo/a</p>
      </div>

      {children.map((child) => {
        const pei = child.peis?.[0];
        const totalObjectives = pei?.objectives.length || 0;
        const achieved = pei?.objectives.filter(
          (o: any) => o.currentStatus === "ACHIEVED_INDEPENDENT" || o.currentStatus === "ACHIEVED_WITH_SUPPORT"
        ).length || 0;
        const percentage = totalObjectives > 0 ? Math.round((achieved / totalObjectives) * 100) : 0;

        return (
          <div key={child.id} className="space-y-4">
            {/* Child header */}
            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-brand-medium to-accent rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">{child.firstName[0]}{child.lastName[0]}</span>
                </div>
                <div>
                  <h2 className="text-[16px] font-semibold text-gray-900">{child.firstName} {child.lastName}</h2>
                  <p className="text-[12px] text-gray-400">{child.group?.name || "Sin grupo"} · {child.relationship}</p>
                </div>
              </div>

              {/* Progress */}
              {pei && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-[13px] font-medium text-gray-700">Progreso del Plan Educativo</p>
                    <span className="text-[13px] font-bold text-brand-medium">{percentage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mb-3">
                    <div className="bg-brand-light h-2.5 rounded-full transition-all" style={{ width: `${percentage}%` }} />
                  </div>
                  <p className="text-[11px] text-gray-400">
                    {achieved} de {totalObjectives} objetivos logrados · Período: {pei.period.name}
                  </p>
                </div>
              )}
            </div>

            {/* PEI objectives */}
            {pei && pei.objectives.length > 0 && (
              <div className="bg-white rounded-xl border border-gray-100 p-5">
                <h3 className="text-[14px] font-semibold text-gray-800 mb-3">Objetivos del Plan Educativo</h3>
                <div className="space-y-2">
                  {pei.objectives.map((obj: any) => {
                    const color = statusColors[obj.currentStatus] || statusColors.NOT_STARTED;
                    return (
                      <div key={obj.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                        <div className="flex items-center gap-2 flex-1">
                          <span className="text-sm">{obj.area.icon || "📌"}</span>
                          <p className="text-[13px] text-gray-700">{obj.description}</p>
                        </div>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-medium ml-2 whitespace-nowrap ${color}`}>
                          {statusLabels[obj.currentStatus]}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Quick links */}
            <div className="grid grid-cols-2 gap-3">
              <Link href="/familia/mensajes" className="bg-white rounded-xl border border-gray-100 p-4 text-center hover:shadow-soft transition">
                <span className="text-2xl">💬</span>
                <p className="text-[13px] font-medium text-gray-700 mt-1">Mensajes</p>
                <p className="text-[11px] text-gray-400">Comunícate con el equipo</p>
              </Link>
              <Link href="/familia/citas" className="bg-white rounded-xl border border-gray-100 p-4 text-center hover:shadow-soft transition">
                <span className="text-2xl">📅</span>
                <p className="text-[13px] font-medium text-gray-700 mt-1">Próximas Citas</p>
                <p className="text-[11px] text-gray-400">Ver agenda de sesiones</p>
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  );
}

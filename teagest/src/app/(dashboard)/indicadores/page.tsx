"use client";

import { Header } from "@/components/header";
import { trpc } from "@/lib/trpc";

export default function IndicadoresPage() {
  const { data: kpis } = trpc.indicators.kpis.useQuery();
  const { data: rooms } = trpc.indicators.roomOccupancy.useQuery();
  const { data: therapists } = trpc.indicators.therapistPerformance.useQuery();
  const { data: absences } = trpc.indicators.absenceTrends.useQuery();
  const { data: topAbsentees } = trpc.indicators.topAbsentees.useQuery();

  return (
    <>
      <Header title="Indicadores Avanzados" subtitle="Métricas de rendimiento del centro" />
      <div className="p-6 space-y-6">
        {/* KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <KPI label="Citas del mes" value={kpis?.totalAppointments ?? 0} />
          <KPI label="Tasa asistencia" value={`${kpis?.attendanceRate ?? 0}%`} color="text-green-600" />
          <KPI label="Promedio sesiones/paciente" value={kpis?.avgSessionsPerStudent ?? 0} />
          <KPI label="Promedio sesiones/terapeuta" value={kpis?.avgSessionsPerTherapist ?? 0} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Room occupancy */}
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <h3 className="text-[14px] font-semibold text-gray-800 mb-4">Ocupación de Salas</h3>
            {rooms && rooms.length > 0 ? (
              <div className="space-y-3">
                {rooms.map((room) => (
                  <div key={room.id}>
                    <div className="flex justify-between text-[12px] mb-1">
                      <span className="text-gray-600 font-medium">{room.name}</span>
                      <span className="text-gray-800 font-semibold">{room.occupancy}%</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2.5">
                      <div
                        className="h-2.5 rounded-full transition-all"
                        style={{ width: `${room.occupancy}%`, backgroundColor: room.color }}
                      />
                    </div>
                    <p className="text-[10px] text-gray-400 mt-0.5">{room.appointments} citas de ~{room.totalSlots} slots disponibles</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[13px] text-gray-400 text-center py-4">No hay salas configuradas</p>
            )}
          </div>

          {/* Absence trends */}
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <h3 className="text-[14px] font-semibold text-gray-800 mb-4">Tendencia de Inasistencias (12 semanas)</h3>
            {absences && absences.length > 0 ? (
              <div className="flex items-end gap-1 h-36">
                {absences.map((week, idx) => {
                  const maxRate = Math.max(...absences.map((w) => w.rate), 1);
                  const height = maxRate > 0 ? (week.rate / maxRate) * 100 : 0;
                  return (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-0.5">
                      <span className="text-[9px] text-gray-500">{week.rate}%</span>
                      <div className="w-full bg-gray-100 rounded-t-sm relative" style={{ height: "100px" }}>
                        <div
                          className="absolute bottom-0 w-full bg-red-400 rounded-t-sm transition-all"
                          style={{ height: `${Math.max(height, 3)}%` }}
                        />
                      </div>
                      <span className="text-[8px] text-gray-400 -rotate-45 origin-top-left whitespace-nowrap mt-1">{week.label}</span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-[13px] text-gray-400 text-center py-4">Sin datos</p>
            )}
          </div>

          {/* Therapist performance */}
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <h3 className="text-[14px] font-semibold text-gray-800 mb-4">Rendimiento por Terapeuta</h3>
            {therapists && therapists.length > 0 ? (
              <div className="space-y-2.5">
                {therapists.map((t) => (
                  <div key={t.id} className="flex items-center justify-between p-2.5 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-[12px] font-medium text-gray-800">{t.name}</p>
                      <p className="text-[10px] text-gray-400">{t.specialty || "General"} · {t.patients} pacientes</p>
                    </div>
                    <div className="flex items-center gap-3 text-[11px]">
                      <div className="text-center">
                        <p className="font-bold text-green-600">{t.completed}</p>
                        <p className="text-gray-400">hechas</p>
                      </div>
                      <div className="text-center">
                        <p className="font-bold text-red-500">{t.noShow}</p>
                        <p className="text-gray-400">faltas</p>
                      </div>
                      <div className="text-center">
                        <p className="font-bold text-brand-dark">{t.completionRate}%</p>
                        <p className="text-gray-400">cumplim.</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[13px] text-gray-400 text-center py-4">Sin datos de este período</p>
            )}
          </div>

          {/* Top absentees */}
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <h3 className="text-[14px] font-semibold text-gray-800 mb-4">Pacientes con más Inasistencias (mes actual)</h3>
            {topAbsentees && topAbsentees.length > 0 ? (
              <div className="space-y-2">
                {topAbsentees.map((s, idx) => (
                  <div key={s.id} className="flex items-center justify-between p-2.5 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2.5">
                      <span className="text-[11px] font-bold text-gray-400 w-5">{idx + 1}</span>
                      <div>
                        <p className="text-[12px] font-medium text-gray-800">{s.firstName} {s.lastName}</p>
                        <p className="text-[10px] text-gray-400">{s.noShow} faltas de {s.total} citas</p>
                      </div>
                    </div>
                    <span className={`text-[11px] font-bold ${s.rate >= 50 ? "text-red-600" : s.rate >= 30 ? "text-orange-600" : "text-yellow-600"}`}>
                      {s.rate}% inasist.
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[13px] text-gray-400 text-center py-4">Sin inasistencias este mes</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

function KPI({ label, value, color }: { label: string; value: string | number; color?: string }) {
  return (
    <div className="bg-white rounded-xl p-3.5 border border-gray-100">
      <p className="text-[11px] text-gray-400 uppercase font-medium">{label}</p>
      <p className={`text-xl font-bold mt-0.5 ${color || "text-gray-900"}`}>{value}</p>
    </div>
  );
}

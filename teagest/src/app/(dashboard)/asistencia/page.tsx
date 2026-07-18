"use client";

import { useState } from "react";
import { Header } from "@/components/header";
import { trpc } from "@/lib/trpc";

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
  SCHEDULED: { label: "Pendiente", color: "text-gray-500", bg: "bg-gray-100" },
  CONFIRMED: { label: "Confirmada", color: "text-blue-700", bg: "bg-blue-100" },
  COMPLETED: { label: "Presente", color: "text-green-700", bg: "bg-green-100" },
  NO_SHOW: { label: "Ausente", color: "text-red-700", bg: "bg-red-100" },
  CANCELLED: { label: "Cancelada", color: "text-gray-400", bg: "bg-gray-50" },
};

export default function AsistenciaPage() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);

  const { data: appointments, isLoading, refetch } = trpc.attendance.getToday.useQuery({ date: selectedDate });
  const { data: stats } = trpc.attendance.stats.useQuery();

  const markMutation = trpc.attendance.mark.useMutation({ onSuccess: () => refetch() });

  const handleMark = (appointmentId: string, status: "COMPLETED" | "NO_SHOW" | "CANCELLED") => {
    markMutation.mutate({ appointmentId, status });
  };

  const present = appointments?.filter((a) => a.status === "COMPLETED").length || 0;
  const absent = appointments?.filter((a) => a.status === "NO_SHOW").length || 0;
  const pending = appointments?.filter((a) => a.status === "SCHEDULED" || a.status === "CONFIRMED").length || 0;

  return (
    <>
      <Header title="Control de Asistencia" subtitle="Registro diario de asistencia" />
      <div className="p-6 space-y-5">
        {/* Monthly stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-white rounded-xl p-3.5 border border-gray-100">
            <p className="text-[11px] text-gray-400 uppercase font-medium">Tasa de asistencia</p>
            <p className="text-xl font-bold text-brand-dark mt-0.5">{stats?.attendanceRate ?? 0}%</p>
            <p className="text-[10px] text-gray-400">este mes</p>
          </div>
          <div className="bg-white rounded-xl p-3.5 border border-gray-100">
            <p className="text-[11px] text-gray-400 uppercase font-medium">Sesiones realizadas</p>
            <p className="text-xl font-bold text-green-600 mt-0.5">{stats?.completed ?? 0}</p>
          </div>
          <div className="bg-white rounded-xl p-3.5 border border-gray-100">
            <p className="text-[11px] text-gray-400 uppercase font-medium">Inasistencias</p>
            <p className="text-xl font-bold text-red-600 mt-0.5">{stats?.noShow ?? 0}</p>
          </div>
          <div className="bg-white rounded-xl p-3.5 border border-gray-100">
            <p className="text-[11px] text-gray-400 uppercase font-medium">Cancelaciones</p>
            <p className="text-xl font-bold text-gray-400 mt-0.5">{stats?.cancelled ?? 0}</p>
          </div>
        </div>

        {/* Date selector + day stats */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-2 text-[13px] text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20"
            />
            <button
              onClick={() => setSelectedDate(new Date().toISOString().split("T")[0])}
              className="px-3 py-2 text-[12px] font-medium text-brand-medium bg-primary-50 rounded-lg hover:bg-primary-100 transition"
            >
              Hoy
            </button>
          </div>
          <div className="flex items-center gap-4 text-[12px]">
            <span className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 bg-green-500 rounded-full" />
              Presentes: {present}
            </span>
            <span className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 bg-red-500 rounded-full" />
              Ausentes: {absent}
            </span>
            <span className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 bg-gray-300 rounded-full" />
              Pendientes: {pending}
            </span>
          </div>
        </div>

        {/* Attendance list */}
        {isLoading && (
          <div className="space-y-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-xl p-4 border border-gray-100 animate-pulse h-16" />
            ))}
          </div>
        )}

        {!isLoading && appointments && appointments.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            {/* Table header */}
            <div className="grid grid-cols-[1fr_120px_100px_80px_180px] gap-3 px-4 py-2.5 bg-gray-50 border-b border-gray-100 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
              <span>Paciente</span>
              <span>Hora</span>
              <span>Terapeuta</span>
              <span>Estado</span>
              <span>Acción</span>
            </div>

            {/* Rows */}
            <div className="divide-y divide-gray-50">
              {appointments.map((appt) => {
                const status = statusConfig[appt.status] || statusConfig.SCHEDULED;
                const isMarked = appt.status === "COMPLETED" || appt.status === "NO_SHOW" || appt.status === "CANCELLED";

                return (
                  <div key={appt.id} className="grid grid-cols-[1fr_120px_100px_80px_180px] gap-3 px-4 py-3 items-center hover:bg-gray-50/50 transition">
                    {/* Student */}
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-[10px] font-bold text-gray-500">
                          {appt.student.firstName[0]}{appt.student.lastName[0]}
                        </span>
                      </div>
                      <div>
                        <p className="text-[13px] font-medium text-gray-800">{appt.student.firstName} {appt.student.lastName}</p>
                        <p className="text-[10px] text-gray-400">{appt.type} {appt.room ? `· ${appt.room.name}` : ""}</p>
                      </div>
                    </div>

                    {/* Time */}
                    <span className="text-[13px] text-gray-600">{appt.startTime} - {appt.endTime}</span>

                    {/* Therapist */}
                    <span className="text-[12px] text-gray-500 truncate">{appt.therapist.name.split(" ")[0]}</span>

                    {/* Status badge */}
                    <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${status.bg} ${status.color} text-center`}>
                      {status.label}
                    </span>

                    {/* Actions */}
                    <div className="flex items-center gap-1.5">
                      {!isMarked ? (
                        <>
                          <button
                            onClick={() => handleMark(appt.id, "COMPLETED")}
                            className="px-2.5 py-1.5 bg-green-50 text-green-700 rounded-md text-[11px] font-medium hover:bg-green-100 transition flex items-center gap-1"
                          >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                            Presente
                          </button>
                          <button
                            onClick={() => handleMark(appt.id, "NO_SHOW")}
                            className="px-2.5 py-1.5 bg-red-50 text-red-700 rounded-md text-[11px] font-medium hover:bg-red-100 transition flex items-center gap-1"
                          >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
                            Ausente
                          </button>
                          <button
                            onClick={() => handleMark(appt.id, "CANCELLED")}
                            className="px-2 py-1.5 text-gray-400 hover:text-gray-600 rounded-md text-[11px] hover:bg-gray-100 transition"
                            title="Cancelar"
                          >
                            Cancelar
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => markMutation.mutate({ appointmentId: appt.id, status: "SCHEDULED" })}
                          className="px-2.5 py-1.5 text-gray-400 rounded-md text-[11px] hover:bg-gray-100 transition"
                        >
                          Desmarcar
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {!isLoading && (!appointments || appointments.length === 0) && (
          <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
            <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-800 mb-1">Sin citas programadas</h3>
            <p className="text-[13px] text-gray-400">No hay citas para esta fecha. Agenda citas desde el módulo de Agenda.</p>
          </div>
        )}
      </div>
    </>
  );
}

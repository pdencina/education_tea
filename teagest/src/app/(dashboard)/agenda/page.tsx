"use client";

import { useState, useMemo } from "react";
import { Header } from "@/components/header";
import { trpc } from "@/lib/trpc";
import { CreateAppointmentDialog } from "./create-appointment";

const statusColors: Record<string, string> = {
  SCHEDULED: "bg-blue-100 border-blue-200 text-blue-800",
  CONFIRMED: "bg-green-100 border-green-200 text-green-800",
  IN_PROGRESS: "bg-yellow-100 border-yellow-200 text-yellow-800",
  COMPLETED: "bg-gray-100 border-gray-200 text-gray-600",
  NO_SHOW: "bg-red-100 border-red-200 text-red-800",
};

const hours = Array.from({ length: 11 }, (_, i) => `${(i + 8).toString().padStart(2, "0")}:00`);

export default function AgendaPage() {
  const [weekOffset, setWeekOffset] = useState(0);
  const [showCreate, setShowCreate] = useState(false);
  const [filterTherapist, setFilterTherapist] = useState("");

  // Calculate current week
  const { startDate, endDate, days } = useMemo(() => {
    const now = new Date();
    const start = new Date(now);
    start.setDate(now.getDate() - now.getDay() + 1 + weekOffset * 7); // Monday
    start.setHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setDate(start.getDate() + 6); // Sunday
    end.setHours(23, 59, 59, 999);

    const daysList = Array.from({ length: 6 }, (_, i) => {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      return d;
    });

    return {
      startDate: start.toISOString().split("T")[0],
      endDate: end.toISOString().split("T")[0],
      days: daysList,
    };
  }, [weekOffset]);

  const { data: appointments, isLoading, refetch } = trpc.appointments.getByWeek.useQuery({ startDate, endDate });
  const { data: stats } = trpc.appointments.todayStats.useQuery();
  const { data: staff } = trpc.staff.list.useQuery();

  const filteredAppointments = filterTherapist
    ? appointments?.filter((a) => a.therapist.id === filterTherapist)
    : appointments;

  const dayNames = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
  const today = new Date().toISOString().split("T")[0];

  return (
    <>
      <Header title="Agenda" subtitle="Gestión de citas y horarios" />
      <div className="p-6 space-y-4">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-white rounded-xl p-3.5 border border-gray-100">
            <p className="text-[11px] text-gray-400 uppercase font-medium">Hoy</p>
            <p className="text-xl font-bold text-gray-900 mt-0.5">{stats?.total ?? 0} citas</p>
          </div>
          <div className="bg-white rounded-xl p-3.5 border border-gray-100">
            <p className="text-[11px] text-gray-400 uppercase font-medium">Completadas</p>
            <p className="text-xl font-bold text-green-600 mt-0.5">{stats?.completed ?? 0}</p>
          </div>
          <div className="bg-white rounded-xl p-3.5 border border-gray-100">
            <p className="text-[11px] text-gray-400 uppercase font-medium">Pendientes</p>
            <p className="text-xl font-bold text-blue-600 mt-0.5">{stats?.pending ?? 0}</p>
          </div>
          <div className="bg-white rounded-xl p-3.5 border border-gray-100">
            <p className="text-[11px] text-gray-400 uppercase font-medium">Inasistencias</p>
            <p className="text-xl font-bold text-red-600 mt-0.5">{stats?.noShow ?? 0}</p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setWeekOffset((w) => w - 1)}
              className="p-2 hover:bg-gray-100 rounded-lg transition text-gray-500"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            </button>
            <button
              onClick={() => setWeekOffset(0)}
              className="px-3 py-1.5 text-[12px] font-medium text-brand-medium bg-primary-50 rounded-lg hover:bg-primary-100 transition"
            >
              Hoy
            </button>
            <button
              onClick={() => setWeekOffset((w) => w + 1)}
              className="p-2 hover:bg-gray-100 rounded-lg transition text-gray-500"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </button>
            <span className="text-[13px] font-medium text-gray-700 ml-2">
              {days[0].toLocaleDateString("es", { day: "numeric", month: "short" })} — {days[5].toLocaleDateString("es", { day: "numeric", month: "short", year: "numeric" })}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={filterTherapist}
              onChange={(e) => setFilterTherapist(e.target.value)}
              className="text-[13px] border border-gray-200 rounded-lg px-3 py-1.5 text-gray-600 bg-white"
            >
              <option value="">Todos los terapeutas</option>
              {staff?.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
            <button
              onClick={() => setShowCreate(true)}
              className="px-4 py-2 bg-brand-dark text-white rounded-lg text-[13px] font-medium hover:bg-brand-medium transition"
            >
              + Nueva Cita
            </button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          {/* Day headers */}
          <div className="grid grid-cols-[60px_repeat(6,1fr)] border-b border-gray-100">
            <div className="p-2" />
            {days.map((day, i) => {
              const dateStr = day.toISOString().split("T")[0];
              const isToday = dateStr === today;
              return (
                <div key={i} className={`p-2 text-center border-l border-gray-50 ${isToday ? "bg-primary-50" : ""}`}>
                  <p className={`text-[11px] font-medium ${isToday ? "text-brand-medium" : "text-gray-400"}`}>{dayNames[i]}</p>
                  <p className={`text-[14px] font-semibold ${isToday ? "text-brand-dark" : "text-gray-800"}`}>{day.getDate()}</p>
                </div>
              );
            })}
          </div>

          {/* Time slots */}
          <div className="max-h-[500px] overflow-y-auto">
            {hours.map((hour) => (
              <div key={hour} className="grid grid-cols-[60px_repeat(6,1fr)] border-b border-gray-50 min-h-[52px]">
                <div className="p-1.5 text-[10px] text-gray-400 text-right pr-2 pt-0.5">{hour}</div>
                {days.map((day, dayIdx) => {
                  const dateStr = day.toISOString().split("T")[0];
                  const dayAppointments = filteredAppointments?.filter(
                    (a) => new Date(a.date).toISOString().split("T")[0] === dateStr && a.startTime === hour
                  ) || [];

                  return (
                    <div key={dayIdx} className="border-l border-gray-50 p-0.5 relative">
                      {dayAppointments.map((appt) => {
                        const colors = statusColors[appt.status] || statusColors.SCHEDULED;
                        return (
                          <div
                            key={appt.id}
                            className={`${colors} border rounded-md px-1.5 py-1 text-[10px] leading-tight mb-0.5 cursor-pointer hover:opacity-80 transition`}
                          >
                            <p className="font-medium truncate">{appt.student.firstName} {appt.student.lastName[0]}.</p>
                            <p className="text-[9px] opacity-70 truncate">{appt.therapist.name.split(" ")[0]} · {appt.startTime}-{appt.endTime}</p>
                            {appt.room && <p className="text-[9px] opacity-60">📍 {appt.room.name}</p>}
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {showCreate && (
        <CreateAppointmentDialog
          onClose={() => setShowCreate(false)}
          onCreated={() => { setShowCreate(false); refetch(); }}
        />
      )}
    </>
  );
}

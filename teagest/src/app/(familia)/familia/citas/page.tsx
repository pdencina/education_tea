"use client";

import { trpc } from "@/lib/trpc";

export default function FamiliaCitasPage() {
  const { data: children } = trpc.familyPortal.getMyChildren.useQuery();
  const studentId = children?.[0]?.id || "";

  const { data: appointments, isLoading } = trpc.familyPortal.getAppointments.useQuery(
    { studentId },
    { enabled: !!studentId }
  );

  return (
    <div className="space-y-4">
      <h1 className="text-lg font-bold text-gray-900">Próximas Citas</h1>
      <p className="text-[13px] text-gray-400">Sesiones programadas para tu hijo/a</p>

      {isLoading && (
        <div className="space-y-3 animate-pulse">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-xl p-4 border border-gray-100 h-20" />
          ))}
        </div>
      )}

      {!isLoading && appointments && appointments.length > 0 ? (
        <div className="space-y-3">
          {appointments.map((appt) => (
            <div key={appt.id} className="bg-white rounded-xl border border-gray-100 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[14px] font-semibold text-gray-900">
                    {new Date(appt.date).toLocaleDateString("es", { weekday: "long", day: "numeric", month: "long" })}
                  </p>
                  <p className="text-[13px] text-gray-500 mt-0.5">
                    {appt.startTime} - {appt.endTime}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[13px] font-medium text-brand-dark">{appt.therapist.name}</p>
                  <p className="text-[11px] text-gray-400">{appt.therapist.specialty || "Terapeuta"}</p>
                  {appt.room && <p className="text-[11px] text-gray-400">📍 {appt.room.name}</p>}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        !isLoading && (
          <div className="bg-white rounded-xl border border-gray-100 p-8 text-center">
            <p className="text-[13px] text-gray-400">No hay citas programadas próximamente</p>
          </div>
        )
      )}
    </div>
  );
}

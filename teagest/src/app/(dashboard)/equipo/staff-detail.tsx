"use client";

import { trpc } from "@/lib/trpc";

const roleLabels: Record<string, string> = {
  ADMIN: "Administrador",
  COORDINATOR: "Coordinador/a",
  TEACHER: "Docente",
  SPECIALIST: "Especialista",
};

const typeLabels: Record<string, string> = {
  INDIVIDUAL: "Individual",
  GROUP: "Grupal",
  OCCUPATIONAL_THERAPY: "T.O.",
  SPEECH_THERAPY: "Fono.",
  PSYCHOLOGY: "Psicología",
  OTHER: "Otro",
};

interface StaffDetailProps {
  staffId: string;
  onClose: () => void;
  onAssign: () => void;
  onRefetch: () => void;
}

export function StaffDetail({ staffId, onClose, onAssign, onRefetch }: StaffDetailProps) {
  const { data: member, isLoading } = trpc.staff.getById.useQuery({ id: staffId });
  const unassignMutation = trpc.staff.unassign.useMutation({
    onSuccess: () => onRefetch(),
  });

  if (isLoading || !member) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="absolute inset-0 bg-black/50" onClick={onClose} />
        <div className="relative bg-white rounded-2xl shadow-xl p-8 animate-pulse w-96">
          <div className="h-6 bg-gray-200 rounded w-40" />
        </div>
      </div>
    );
  }

  const initials = member.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-xl max-w-lg w-full mx-4 max-h-[85vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-100 sticky top-0 bg-white rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-400 to-tea-pink rounded-full flex items-center justify-center">
                <span className="text-sm font-semibold text-white">{initials}</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">{member.name}</h3>
                <p className="text-sm text-gray-400">
                  {roleLabels[member.role]} {member.specialty ? `· ${member.specialty}` : ""}
                </p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-6 space-y-5">
          {/* Info */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-xs text-gray-400">Email</p>
              <p className="text-gray-700 font-medium truncate">{member.email}</p>
            </div>
            {member.phone && (
              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-xs text-gray-400">Teléfono</p>
                <p className="text-gray-700 font-medium">{member.phone}</p>
              </div>
            )}
            {member.license && (
              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-xs text-gray-400">Cédula/Matrícula</p>
                <p className="text-gray-700 font-medium">{member.license}</p>
              </div>
            )}
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-xs text-gray-400">Desde</p>
              <p className="text-gray-700 font-medium">
                {new Date(member.createdAt).toLocaleDateString("es", { month: "long", year: "numeric" })}
              </p>
            </div>
          </div>

          {/* Assigned students */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-gray-800 text-sm">
                Alumnos asignados ({member.assignments.length})
              </h4>
              <button
                onClick={onAssign}
                className="px-3 py-1.5 bg-primary-500 text-white rounded-lg text-xs font-medium hover:bg-primary-600 transition"
              >
                + Asignar
              </button>
            </div>

            {member.assignments.length === 0 ? (
              <p className="text-sm text-gray-400">No tiene alumnos asignados.</p>
            ) : (
              <div className="space-y-2">
                {member.assignments.map((a) => {
                  const levelColor =
                    a.student.supportLevel === "LEVEL_1" ? "bg-blue-100 text-blue-700" :
                    a.student.supportLevel === "LEVEL_2" ? "bg-yellow-100 text-yellow-700" :
                    "bg-red-100 text-red-700";
                  return (
                    <div key={a.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                          <span className="text-[10px] font-medium text-gray-600">
                            {a.student.firstName[0]}{a.student.lastName[0]}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-700">{a.student.firstName} {a.student.lastName}</p>
                          <p className="text-xs text-gray-400">{a.student.group?.name || "Sin grupo"}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${levelColor}`}>
                          {a.student.supportLevel === "LEVEL_1" ? "N1" : a.student.supportLevel === "LEVEL_2" ? "N2" : "N3"}
                        </span>
                        <button
                          onClick={() => unassignMutation.mutate({ userId: staffId, studentId: a.student.id })}
                          className="p-1 text-gray-300 hover:text-red-500 transition"
                          title="Remover asignación"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Recent sessions */}
          {member.sessions.length > 0 && (
            <div>
              <h4 className="font-semibold text-gray-800 text-sm mb-3">Últimas sesiones</h4>
              <div className="space-y-2">
                {member.sessions.slice(0, 5).map((s) => (
                  <div key={s.id} className="flex items-center justify-between text-xs bg-gray-50 rounded-lg px-3 py-2">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500">
                        {new Date(s.date).toLocaleDateString("es", { day: "numeric", month: "short" })}
                      </span>
                      <span className="text-gray-700 font-medium">
                        {s.student.firstName} {s.student.lastName}
                      </span>
                    </div>
                    <span className="text-gray-400">{typeLabels[s.type] || s.type}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

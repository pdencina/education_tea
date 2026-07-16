"use client";

type Student = {
  assignments: {
    user: {
      id: string;
      name: string;
      email: string;
      role: string;
      specialty: string | null;
      avatar: string | null;
    };
  }[];
  familyLinks: {
    user: {
      id: string;
      name: string;
      email: string;
    };
    relationship: string;
  }[];
};

const roleLabels: Record<string, string> = {
  ADMIN: "Administrador",
  COORDINATOR: "Coordinador/a",
  TEACHER: "Docente",
  SPECIALIST: "Especialista",
  FAMILY: "Familia",
};

const roleColors: Record<string, string> = {
  ADMIN: "bg-purple-100 text-purple-700",
  COORDINATOR: "bg-blue-100 text-blue-700",
  TEACHER: "bg-green-100 text-green-700",
  SPECIALIST: "bg-orange-100 text-orange-700",
  FAMILY: "bg-pink-100 text-pink-700",
};

export function TabTeam({ student }: { student: Student }) {
  return (
    <div className="space-y-6">
      {/* Equipo profesional */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Equipo Asignado
        </h3>

        {student.assignments.length > 0 ? (
          <div className="space-y-3">
            {student.assignments.map((a) => {
              const initials = a.user.name.split(" ").map((n) => n[0]).join("").toUpperCase();
              const roleColor = roleColors[a.user.role] || "bg-gray-100 text-gray-700";
              return (
                <div key={a.user.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-blue-700">{initials}</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">{a.user.name}</p>
                      <p className="text-xs text-gray-500">
                        {a.user.specialty || a.user.email}
                      </p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${roleColor}`}>
                    {roleLabels[a.user.role] || a.user.role}
                  </span>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-sm text-gray-500">No hay profesionales asignados a este alumno.</p>
        )}
      </div>

      {/* Familia */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          Familia Vinculada
        </h3>

        {student.familyLinks.length > 0 ? (
          <div className="space-y-3">
            {student.familyLinks.map((fl) => {
              const initials = fl.user.name.split(" ").map((n) => n[0]).join("").toUpperCase();
              return (
                <div key={fl.user.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-pink-700">{initials}</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">{fl.user.name}</p>
                      <p className="text-xs text-gray-500">{fl.user.email}</p>
                    </div>
                  </div>
                  <span className="px-2 py-1 bg-pink-100 text-pink-700 rounded-full text-xs font-medium">
                    {fl.relationship}
                  </span>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-sm text-gray-500">No hay familia vinculada a este alumno.</p>
        )}
      </div>
    </div>
  );
}

"use client";

type StudentWithRelations = {
  id: string;
  code: string;
  firstName: string;
  lastName: string;
  birthDate: Date;
  supportLevel: string;
  status: string;
  group: { id: string; name: string } | null;
  assignments: { user: { id: string; name: string; avatar: string | null } }[];
};

const levelConfig: Record<string, { label: string; color: string }> = {
  LEVEL_1: { label: "Nivel 1", color: "bg-blue-100 text-blue-700" },
  LEVEL_2: { label: "Nivel 2", color: "bg-yellow-100 text-yellow-700" },
  LEVEL_3: { label: "Nivel 3", color: "bg-red-100 text-red-700" },
};

const colorPalette = [
  "from-blue-400 to-blue-600",
  "from-pink-400 to-pink-600",
  "from-green-400 to-green-600",
  "from-purple-400 to-purple-600",
  "from-orange-400 to-orange-600",
  "from-teal-400 to-teal-600",
  "from-indigo-400 to-indigo-600",
  "from-rose-400 to-rose-600",
];

function getAge(birthDate: Date): number {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
}

function getInitials(firstName: string, lastName: string): string {
  return `${firstName[0]}${lastName[0]}`.toUpperCase();
}

function getColorFromName(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colorPalette[Math.abs(hash) % colorPalette.length];
}

export function StudentCard({ student }: { student: StudentWithRelations }) {
  const level = levelConfig[student.supportLevel] || levelConfig.LEVEL_1;
  const age = getAge(student.birthDate);
  const initials = getInitials(student.firstName, student.lastName);
  const avatarColor = getColorFromName(student.firstName + student.lastName);

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition cursor-pointer group">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div
            className={`w-12 h-12 bg-gradient-to-br ${avatarColor} rounded-full flex items-center justify-center`}
          >
            <span className="text-white font-semibold text-sm">{initials}</span>
          </div>
          <div>
            <h4 className="font-medium text-gray-800 group-hover:text-blue-600 transition-colors">
              {student.firstName} {student.lastName}
            </h4>
            <p className="text-xs text-gray-500">
              {age} años{student.group ? ` · ${student.group.name.split(" (")[0]}` : ""}
            </p>
          </div>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${level.color}`}>
          {level.label}
        </span>
      </div>

      {/* Team */}
      {student.assignments.length > 0 && (
        <div className="mt-4 flex items-center gap-2">
          <div className="flex -space-x-2">
            {student.assignments.slice(0, 3).map((a, idx) => (
              <div
                key={idx}
                className="w-6 h-6 bg-gray-200 rounded-full border-2 border-white flex items-center justify-center"
                title={a.user.name}
              >
                <span className="text-[9px] font-medium text-gray-700">
                  {a.user.name.split(" ").map((n) => n[0]).join("")}
                </span>
              </div>
            ))}
            {student.assignments.length > 3 && (
              <div className="w-6 h-6 bg-gray-100 rounded-full border-2 border-white flex items-center justify-center">
                <span className="text-[9px] font-medium text-gray-500">
                  +{student.assignments.length - 3}
                </span>
              </div>
            )}
          </div>
          <span className="text-xs text-gray-500">
            {student.assignments.length} profesional{student.assignments.length !== 1 ? "es" : ""}
          </span>
        </div>
      )}

      {/* Code */}
      <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
        <span className="text-xs text-gray-400 font-mono">{student.code}</span>
        <svg
          className="w-4 h-4 text-gray-300 group-hover:text-blue-500 transition-colors"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </div>
  );
}

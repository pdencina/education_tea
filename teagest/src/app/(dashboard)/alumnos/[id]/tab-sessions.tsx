"use client";

import { trpc } from "@/lib/trpc";

const typeLabels: Record<string, { label: string; color: string }> = {
  INDIVIDUAL: { label: "Individual", color: "bg-blue-100 text-blue-700" },
  GROUP: { label: "Grupal", color: "bg-purple-100 text-purple-700" },
  OCCUPATIONAL_THERAPY: { label: "T.O.", color: "bg-orange-100 text-orange-700" },
  SPEECH_THERAPY: { label: "Fono.", color: "bg-teal-100 text-teal-700" },
  PSYCHOLOGY: { label: "Psicología", color: "bg-pink-100 text-pink-700" },
  OTHER: { label: "Otro", color: "bg-gray-100 text-gray-700" },
};

const moodEmojis: Record<string, string> = {
  excelente: "😊",
  bien: "🙂",
  neutral: "😐",
  dificil: "😟",
  crisis: "😢",
};

export function TabSessions({ studentId }: { studentId: string }) {
  const { data: sessions, isLoading } = trpc.sessions.getByStudent.useQuery({
    studentId,
    limit: 15,
  });

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-200 p-4 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-48 mb-2" />
            <div className="h-3 bg-gray-200 rounded w-32" />
          </div>
        ))}
      </div>
    );
  }

  if (!sessions || sessions.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
        <div className="w-14 h-14 bg-yellow-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-7 h-7 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <h3 className="font-semibold text-gray-800 mb-1">Sin sesiones registradas</h3>
        <p className="text-sm text-gray-500">Ve al módulo Sesiones para registrar una.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">Últimas {sessions.length} sesiones</p>
      </div>
      {sessions.map((session) => {
        const type = typeLabels[session.type] || typeLabels.OTHER;
        const moodEmoji = session.mood ? moodEmojis[session.mood] || "" : "";
        return (
          <div key={session.id} className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 bg-gray-100 rounded-lg flex items-center justify-center text-base flex-shrink-0">
                  {moodEmoji || "📝"}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${type.color}`}>
                      {type.label}
                    </span>
                    <span className="text-xs text-gray-400">
                      {new Date(session.date).toLocaleDateString("es", { weekday: "short", day: "numeric", month: "short" })}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {session.startTime}{session.endTime ? ` - ${session.endTime}` : ""} · {session.user.name}
                  </p>
                  {session.notes && (
                    <p className="text-sm text-gray-700 mt-2">{session.notes}</p>
                  )}
                  {session.activities && (
                    <p className="text-xs text-gray-400 mt-1">Actividades: {Array.isArray(session.activities) ? session.activities.join(", ") : session.activities}</p>
                  )}
                </div>
              </div>
              {session.participation && (
                <span className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded whitespace-nowrap">
                  {session.participation}
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

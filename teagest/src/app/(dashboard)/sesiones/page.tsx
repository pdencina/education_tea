"use client";

import { useState } from "react";
import { Header } from "@/components/header";
import { trpc } from "@/lib/trpc";
import { CreateSessionDialog } from "./create-session-dialog";

const typeLabels: Record<string, { label: string; color: string }> = {
  INDIVIDUAL: { label: "Individual", color: "bg-blue-100 text-blue-700" },
  GROUP: { label: "Grupal", color: "bg-purple-100 text-purple-700" },
  OCCUPATIONAL_THERAPY: { label: "Terapia Ocupacional", color: "bg-orange-100 text-orange-700" },
  SPEECH_THERAPY: { label: "Fonoaudiología", color: "bg-teal-100 text-teal-700" },
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

export default function SesionesPage() {
  const [showCreate, setShowCreate] = useState(false);
  const [filterDate, setFilterDate] = useState("");
  const [filterType, setFilterType] = useState("");

  const { data: sessions, isLoading, refetch } = trpc.sessions.list.useQuery({
    date: filterDate || undefined,
    type: (filterType as any) || undefined,
    limit: 50,
  });

  const { data: stats } = trpc.sessions.stats.useQuery();

  return (
    <>
      <Header title="Sesiones" subtitle="Registro y seguimiento de sesiones" />
      <div className="p-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Esta semana</p>
                <p className="text-2xl font-bold text-gray-800">{stats?.thisWeek ?? "—"}</p>
              </div>
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total registradas</p>
                <p className="text-2xl font-bold text-gray-800">{stats?.total ?? "—"}</p>
              </div>
              <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center justify-center">
            <button
              onClick={() => setShowCreate(true)}
              className="px-5 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Registrar Sesión
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-3 flex-wrap">
          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600 bg-white"
          >
            <option value="">Todos los tipos</option>
            <option value="INDIVIDUAL">Individual</option>
            <option value="GROUP">Grupal</option>
            <option value="OCCUPATIONAL_THERAPY">Terapia Ocupacional</option>
            <option value="SPEECH_THERAPY">Fonoaudiología</option>
            <option value="PSYCHOLOGY">Psicología</option>
            <option value="OTHER">Otro</option>
          </select>
          {(filterDate || filterType) && (
            <button
              onClick={() => { setFilterDate(""); setFilterType(""); }}
              className="text-sm text-gray-500 hover:text-gray-700 px-3 py-2"
            >
              Limpiar filtros
            </button>
          )}
        </div>

        {/* Sessions List */}
        {isLoading && (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-200 p-4 animate-pulse">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-lg" />
                  <div className="space-y-2 flex-1">
                    <div className="h-4 bg-gray-200 rounded w-48" />
                    <div className="h-3 bg-gray-200 rounded w-32" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!isLoading && sessions && sessions.length > 0 && (
          <div className="space-y-3">
            {sessions.map((session) => {
              const type = typeLabels[session.type] || typeLabels.OTHER;
              const moodEmoji = session.mood ? moodEmojis[session.mood] || "" : "";
              return (
                <div key={session.id} className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-sm transition">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-lg flex-shrink-0">
                        {moodEmoji || "📝"}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium text-gray-800">
                            {session.student.firstName} {session.student.lastName}
                          </p>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${type.color}`}>
                            {type.label}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {new Date(session.date).toLocaleDateString("es", { weekday: "short", day: "numeric", month: "short" })}
                          {" · "}
                          {session.startTime}{session.endTime ? ` - ${session.endTime}` : ""}
                          {" · "}
                          {session.user.name}
                        </p>
                        {session.notes && (
                          <p className="text-sm text-gray-600 mt-2 line-clamp-2">{session.notes}</p>
                        )}
                        {session.activities && (
                          <p className="text-xs text-gray-400 mt-1">Actividades: {session.activities}</p>
                        )}
                      </div>
                    </div>
                    {session.participation && (
                      <span className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded">
                        Participación: {session.participation}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {!isLoading && sessions && sessions.length === 0 && (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <div className="w-16 h-16 bg-yellow-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Sin sesiones registradas</h3>
            <p className="text-gray-500 text-sm mb-4">
              {filterDate || filterType ? "No hay sesiones con los filtros aplicados" : "Registra tu primera sesión de trabajo"}
            </p>
            <button
              onClick={() => setShowCreate(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition"
            >
              Registrar Sesión
            </button>
          </div>
        )}
      </div>

      {/* Create Session Dialog */}
      {showCreate && (
        <CreateSessionDialog
          onClose={() => setShowCreate(false)}
          onCreated={() => {
            setShowCreate(false);
            refetch();
          }}
        />
      )}
    </>
  );
}

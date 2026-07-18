"use client";

import { useState } from "react";
import { Header } from "@/components/header";
import { trpc } from "@/lib/trpc";

const noteTypeConfig: Record<string, { label: string; color: string; icon: string }> = {
  EVOLUTION: { label: "Evolución", color: "bg-blue-100 text-blue-700", icon: "📝" },
  OBSERVATION: { label: "Observación", color: "bg-yellow-100 text-yellow-700", icon: "👁️" },
  RECOMMENDATION: { label: "Recomendación", color: "bg-green-100 text-green-700", icon: "💡" },
  INTERCONSULTATION: { label: "Interconsulta", color: "bg-purple-100 text-purple-700", icon: "🔄" },
  INITIAL_ASSESSMENT: { label: "Evaluación Inicial", color: "bg-orange-100 text-orange-700", icon: "📋" },
  DISCHARGE: { label: "Alta", color: "bg-gray-100 text-gray-700", icon: "✅" },
};

export default function HistorialClinicoPage() {
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterSpecialty, setFilterSpecialty] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [newNote, setNewNote] = useState({ type: "EVOLUTION", title: "", content: "", isPrivate: false });

  const { data: students } = trpc.students.list.useQuery({});
  const { data: notes, isLoading, refetch } = trpc.clinicalHistory.getByStudent.useQuery(
    { studentId: selectedStudentId, type: (filterType as any) || undefined, specialty: filterSpecialty || undefined },
    { enabled: !!selectedStudentId }
  );
  const { data: specialties } = trpc.clinicalHistory.getSpecialties.useQuery(
    { studentId: selectedStudentId },
    { enabled: !!selectedStudentId }
  );

  const createMutation = trpc.clinicalHistory.create.useMutation({
    onSuccess: () => { setShowCreate(false); setNewNote({ type: "EVOLUTION", title: "", content: "", isPrivate: false }); refetch(); },
  });
  const deleteMutation = trpc.clinicalHistory.delete.useMutation({ onSuccess: () => refetch() });

  const handleCreate = () => {
    if (!newNote.content.trim() || !selectedStudentId) return;
    createMutation.mutate({
      studentId: selectedStudentId,
      type: newNote.type as any,
      title: newNote.title || undefined,
      content: newNote.content,
      isPrivate: newNote.isPrivate,
    });
  };

  return (
    <>
      <Header title="Historial Clínico" subtitle="Ficha unificada multi-profesional" />
      <div className="p-6 space-y-5">
        {/* Student selector */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <label className="text-[13px] font-medium text-gray-600">Paciente:</label>
            <select
              value={selectedStudentId}
              onChange={(e) => setSelectedStudentId(e.target.value)}
              className="border border-gray-200 rounded-lg px-4 py-2 text-[13px] text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 min-w-[240px]"
            >
              <option value="">Seleccionar paciente...</option>
              {students?.map((s) => (
                <option key={s.id} value={s.id}>{s.firstName} {s.lastName}</option>
              ))}
            </select>
          </div>
          {selectedStudentId && (
            <button
              onClick={() => setShowCreate(!showCreate)}
              className="px-4 py-2 bg-brand-dark text-white rounded-lg text-[13px] font-medium hover:bg-brand-medium transition"
            >
              {showCreate ? "Cancelar" : "+ Nueva Nota"}
            </button>
          )}
        </div>

        {/* Create note form */}
        {showCreate && selectedStudentId && (
          <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-3">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="col-span-2">
                <label className="block text-[12px] font-medium text-gray-600 mb-1">Tipo de nota</label>
                <select
                  value={newNote.type}
                  onChange={(e) => setNewNote({ ...newNote, type: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                >
                  {Object.entries(noteTypeConfig).map(([key, val]) => (
                    <option key={key} value={key}>{val.icon} {val.label}</option>
                  ))}
                </select>
              </div>
              <div className="col-span-2">
                <label className="block text-[12px] font-medium text-gray-600 mb-1">Título (opcional)</label>
                <input
                  value={newNote.title}
                  onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                  placeholder="Ej: Sesión de T.O. - regulación sensorial"
                />
              </div>
            </div>
            <div>
              <label className="block text-[12px] font-medium text-gray-600 mb-1">Contenido *</label>
              <textarea
                value={newNote.content}
                onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
                rows={4}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-primary-500/20 resize-none"
                placeholder="Describe la evolución, observaciones, conductas, respuestas del paciente..."
              />
            </div>
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-[12px] text-gray-500">
                <input
                  type="checkbox"
                  checked={newNote.isPrivate}
                  onChange={(e) => setNewNote({ ...newNote, isPrivate: e.target.checked })}
                  className="rounded border-gray-300"
                />
                Nota privada (solo visible para mi especialidad)
              </label>
              <button
                onClick={handleCreate}
                disabled={!newNote.content.trim() || createMutation.isPending}
                className="px-5 py-2 bg-brand-dark text-white rounded-lg text-[13px] font-medium hover:bg-brand-medium transition disabled:opacity-50"
              >
                {createMutation.isPending ? "Guardando..." : "Guardar Nota"}
              </button>
            </div>
          </div>
        )}

        {/* Filters */}
        {selectedStudentId && (
          <div className="flex gap-2 flex-wrap">
            <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="text-[12px] border border-gray-200 rounded-lg px-3 py-1.5 text-gray-600 bg-white">
              <option value="">Todos los tipos</option>
              {Object.entries(noteTypeConfig).map(([key, val]) => (
                <option key={key} value={key}>{val.label}</option>
              ))}
            </select>
            {specialties && specialties.length > 0 && (
              <select value={filterSpecialty} onChange={(e) => setFilterSpecialty(e.target.value)} className="text-[12px] border border-gray-200 rounded-lg px-3 py-1.5 text-gray-600 bg-white">
                <option value="">Todas las especialidades</option>
                {specialties.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            )}
            {(filterType || filterSpecialty) && (
              <button onClick={() => { setFilterType(""); setFilterSpecialty(""); }} className="text-[12px] text-gray-400 hover:text-gray-600 px-2">
                Limpiar
              </button>
            )}
          </div>
        )}

        {/* No student */}
        {!selectedStudentId && (
          <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
            <div className="w-14 h-14 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-800 mb-1">Historial Clínico Unificado</h3>
            <p className="text-[13px] text-gray-400">Selecciona un paciente para ver o escribir en su ficha clínica</p>
          </div>
        )}

        {/* Timeline */}
        {selectedStudentId && !isLoading && notes && notes.length > 0 && (
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-[19px] top-0 bottom-0 w-px bg-gray-200" />

            <div className="space-y-4">
              {notes.map((note) => {
                const typeInfo = noteTypeConfig[note.type] || noteTypeConfig.EVOLUTION;
                return (
                  <div key={note.id} className="relative pl-12">
                    {/* Timeline dot */}
                    <div className="absolute left-[12px] top-4 w-[15px] h-[15px] bg-white border-2 border-brand-light rounded-full z-10" />

                    <div className="bg-white rounded-xl border border-gray-100 p-4 hover:shadow-soft transition">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${typeInfo.color}`}>
                            {typeInfo.icon} {typeInfo.label}
                          </span>
                          {note.specialty && (
                            <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-[10px] font-medium">
                              {note.specialty}
                            </span>
                          )}
                          {note.isPrivate && (
                            <span className="px-2 py-0.5 bg-red-50 text-red-600 rounded text-[10px] font-medium">
                              🔒 Privada
                            </span>
                          )}
                        </div>
                        <button
                          onClick={() => { if (confirm("¿Eliminar esta nota?")) deleteMutation.mutate({ id: note.id }); }}
                          className="p-1 text-gray-300 hover:text-red-500 transition opacity-0 group-hover:opacity-100"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>

                      {/* Title */}
                      {note.title && (
                        <h4 className="text-[13px] font-semibold text-gray-800 mb-1">{note.title}</h4>
                      )}

                      {/* Content */}
                      <p className="text-[13px] text-gray-600 leading-relaxed whitespace-pre-wrap">{note.content}</p>

                      {/* Footer */}
                      <div className="flex items-center gap-3 mt-3 pt-2 border-t border-gray-50 text-[11px] text-gray-400">
                        <span>{note.author.name}</span>
                        <span>·</span>
                        <span>{note.author.specialty || note.author.role}</span>
                        <span>·</span>
                        <span>{new Date(note.createdAt).toLocaleDateString("es", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {selectedStudentId && !isLoading && (!notes || notes.length === 0) && (
          <div className="bg-white rounded-xl border border-gray-100 p-8 text-center">
            <p className="text-[13px] text-gray-400">No hay notas clínicas para este paciente. Sé el primero en registrar una evolución.</p>
          </div>
        )}
      </div>
    </>
  );
}

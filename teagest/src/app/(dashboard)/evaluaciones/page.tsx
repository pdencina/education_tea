"use client";

import { useState } from "react";
import { Header } from "@/components/header";
import { trpc } from "@/lib/trpc";
import { EvaluationForm } from "./evaluation-form";

const typeLabels: Record<string, { label: string; color: string; desc: string }> = {
  ADOS_2: { label: "ADOS-2", color: "bg-blue-100 text-blue-700", desc: "Escala de Observación Diagnóstica del Autismo" },
  ADI_R: { label: "ADI-R", color: "bg-purple-100 text-purple-700", desc: "Entrevista Diagnóstica de Autismo Revisada" },
  SENSORY_PROFILE: { label: "Perfil Sensorial", color: "bg-orange-100 text-orange-700", desc: "Evaluación de procesamiento sensorial" },
  VINELAND: { label: "Vineland-3", color: "bg-green-100 text-green-700", desc: "Escalas de Conducta Adaptativa" },
  OTHER: { label: "Otra", color: "bg-gray-100 text-gray-700", desc: "Evaluación personalizada" },
};

export default function EvaluacionesPage() {
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [selectedType, setSelectedType] = useState<string>("");

  const { data: students } = trpc.students.list.useQuery({});
  const { data: evaluations, refetch } = trpc.evaluations.getByStudent.useQuery(
    { studentId: selectedStudentId },
    { enabled: !!selectedStudentId }
  );

  return (
    <>
      <Header title="Evaluaciones Clínicas" subtitle="ADOS-2, ADI-R, Perfil Sensorial y más" />
      <div className="p-6 space-y-6">
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
        </div>

        {/* No student selected */}
        {!selectedStudentId && (
          <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
            <div className="w-14 h-14 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-800 mb-1">Evaluaciones Clínicas</h3>
            <p className="text-[13px] text-gray-400">Selecciona un paciente para ver o crear evaluaciones</p>
          </div>
        )}

        {/* Student selected - show evaluation types and history */}
        {selectedStudentId && !showForm && (
          <>
            {/* New evaluation buttons */}
            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <h3 className="font-semibold text-gray-800 mb-3 text-[14px]">Nueva Evaluación</h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                {Object.entries(typeLabels).map(([key, val]) => (
                  <button
                    key={key}
                    onClick={() => { setSelectedType(key); setShowForm(true); }}
                    className="p-3 bg-gray-50 rounded-xl text-center hover:bg-primary-50 hover:border-primary-200 border border-transparent transition group"
                  >
                    <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold ${val.color} mb-1.5`}>
                      {val.label}
                    </span>
                    <p className="text-[10px] text-gray-400 leading-tight">{val.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Evaluation history */}
            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <h3 className="font-semibold text-gray-800 mb-3 text-[14px]">Historial de Evaluaciones</h3>
              {evaluations && evaluations.length > 0 ? (
                <div className="space-y-2">
                  {evaluations.map((ev) => {
                    const typeInfo = typeLabels[ev.type] || typeLabels.OTHER;
                    return (
                      <div key={ev.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                        <div className="flex items-center gap-3">
                          <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${typeInfo.color}`}>
                            {typeInfo.label}
                          </span>
                          <div>
                            <p className="text-[13px] font-medium text-gray-800">
                              {new Date(ev.date).toLocaleDateString("es", { day: "numeric", month: "long", year: "numeric" })}
                            </p>
                            <p className="text-[11px] text-gray-400">
                              Evaluador: {ev.evaluator.name}
                              {ev.score && ` · Resultado: ${ev.score}`}
                            </p>
                          </div>
                        </div>
                        {ev.summary && (
                          <p className="text-[11px] text-gray-500 max-w-xs truncate hidden md:block">{ev.summary}</p>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-[13px] text-gray-400 text-center py-4">No hay evaluaciones registradas para este paciente</p>
              )}
            </div>
          </>
        )}

        {/* Evaluation Form */}
        {showForm && selectedStudentId && (
          <EvaluationForm
            studentId={selectedStudentId}
            type={selectedType}
            onClose={() => setShowForm(false)}
            onSaved={() => { setShowForm(false); refetch(); }}
          />
        )}
      </div>
    </>
  );
}

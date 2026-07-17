"use client";

import { useState } from "react";
import { Header } from "@/components/header";
import { trpc } from "@/lib/trpc";
import { ScheduleEditor } from "./schedule-editor";

export default function AgendaVisualPage() {
  const [showEditor, setShowEditor] = useState(false);
  const [editingId, setEditingId] = useState<string>("");

  const { data: schedules, isLoading, refetch } = trpc.schedules.list.useQuery({});

  const deleteMutation = trpc.schedules.delete.useMutation({ onSuccess: () => refetch() });

  return (
    <>
      <Header title="Agenda Visual" subtitle="Pictogramas y secuencias de actividades" />
      <div className="p-6 space-y-6">
        {/* Actions */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">{schedules?.length || 0} agendas creadas</p>
          <button
            onClick={() => { setEditingId(""); setShowEditor(true); }}
            className="px-4 py-2 bg-primary-500 text-white rounded-xl text-sm font-medium hover:bg-primary-600 transition flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Nueva Agenda
          </button>
        </div>

        {/* Schedules grid */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 animate-pulse">
                <div className="h-5 bg-gray-200 rounded w-32 mb-3" />
                <div className="flex gap-2">
                  {[1, 2, 3, 4].map((j) => (
                    <div key={j} className="w-14 h-14 bg-gray-100 rounded-xl" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {!isLoading && schedules && schedules.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {schedules.map((schedule) => {
              const items = (schedule.items as any[]) || [];
              return (
                <div
                  key={schedule.id}
                  className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition group"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-medium text-gray-800">{schedule.title}</h4>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {items.length} pictograma{items.length !== 1 ? "s" : ""}
                        {schedule.isTemplate && " · Plantilla"}
                      </p>
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition">
                      <button
                        onClick={() => { setEditingId(schedule.id); setShowEditor(true); }}
                        className="p-1.5 text-gray-400 hover:text-primary-500 hover:bg-primary-50 rounded-lg transition"
                        title="Editar"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => { if (confirm("¿Eliminar esta agenda?")) deleteMutation.mutate({ id: schedule.id }); }}
                        className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition"
                        title="Eliminar"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Pictogram preview */}
                  <div className="flex gap-2 overflow-x-auto pb-1">
                    {items.slice(0, 6).map((item: any, idx: number) => (
                      <div key={idx} className="flex flex-col items-center flex-shrink-0">
                        <div className="w-14 h-14 bg-pastel-yellow rounded-xl flex items-center justify-center overflow-hidden border border-yellow-100">
                          <img
                            src={item.pictogramUrl}
                            alt={item.label}
                            className="w-12 h-12 object-contain"
                          />
                        </div>
                        <span className="text-[10px] text-gray-500 mt-1 max-w-14 truncate text-center">
                          {item.label}
                        </span>
                      </div>
                    ))}
                    {items.length > 6 && (
                      <div className="flex flex-col items-center justify-center flex-shrink-0">
                        <div className="w-14 h-14 bg-gray-100 rounded-xl flex items-center justify-center">
                          <span className="text-xs text-gray-400 font-medium">+{items.length - 6}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {schedule.isTemplate && (
                    <div className="mt-3 pt-3 border-t border-gray-50">
                      <span className="text-[10px] px-2 py-0.5 bg-pastel-purple text-primary-700 rounded-full font-medium">Plantilla</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {!isLoading && (!schedules || schedules.length === 0) && (
          <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm">
            <div className="w-16 h-16 bg-pastel-green rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Agenda Visual</h3>
            <p className="text-gray-500 text-sm mb-4">
              Crea secuencias de pictogramas para anticipar actividades del día
            </p>
            <button
              onClick={() => { setEditingId(""); setShowEditor(true); }}
              className="px-4 py-2 bg-primary-500 text-white rounded-xl text-sm font-medium hover:bg-primary-600 transition"
            >
              Crear Primera Agenda
            </button>
          </div>
        )}
      </div>

      {/* Editor */}
      {showEditor && (
        <ScheduleEditor
          scheduleId={editingId}
          onClose={() => setShowEditor(false)}
          onSaved={() => { setShowEditor(false); refetch(); }}
        />
      )}
    </>
  );
}

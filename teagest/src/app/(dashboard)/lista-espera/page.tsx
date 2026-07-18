"use client";

import { useState } from "react";
import { Header } from "@/components/header";
import { trpc } from "@/lib/trpc";
import { AddEntryDialog } from "./add-entry-dialog";

const priorityConfig: Record<string, { label: string; color: string; dot: string }> = {
  HIGH: { label: "Alta", color: "bg-red-50 text-red-700 border-red-200", dot: "bg-red-500" },
  MEDIUM: { label: "Media", color: "bg-yellow-50 text-yellow-700 border-yellow-200", dot: "bg-yellow-500" },
  LOW: { label: "Baja", color: "bg-green-50 text-green-700 border-green-200", dot: "bg-green-500" },
};

const statusConfig: Record<string, { label: string; color: string }> = {
  WAITING: { label: "En espera", color: "bg-blue-100 text-blue-700" },
  CONTACTED: { label: "Contactado", color: "bg-purple-100 text-purple-700" },
  ACCEPTED: { label: "Aceptado", color: "bg-teal-100 text-teal-700" },
  ENROLLED: { label: "Inscrito", color: "bg-green-100 text-green-700" },
  DECLINED: { label: "Declinó", color: "bg-gray-100 text-gray-600" },
  EXPIRED: { label: "Expirado", color: "bg-gray-100 text-gray-400" },
};

export default function ListaEsperaPage() {
  const [showAdd, setShowAdd] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>("");
  const [filterPriority, setFilterPriority] = useState<string>("");

  const { data: entries, isLoading, refetch } = trpc.waitingList.list.useQuery({
    status: (filterStatus as any) || undefined,
    priority: (filterPriority as any) || undefined,
  });
  const { data: stats } = trpc.waitingList.stats.useQuery();

  const updateStatusMutation = trpc.waitingList.updateStatus.useMutation({ onSuccess: () => refetch() });
  const updatePriorityMutation = trpc.waitingList.updatePriority.useMutation({ onSuccess: () => refetch() });
  const deleteMutation = trpc.waitingList.delete.useMutation({ onSuccess: () => refetch() });

  return (
    <>
      <Header title="Lista de Espera" subtitle="Gestión de cupos y priorización" />
      <div className="p-6 space-y-5">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <div className="bg-white rounded-xl p-3.5 border border-gray-100">
            <p className="text-[11px] text-gray-400 uppercase font-medium">Total</p>
            <p className="text-xl font-bold text-gray-900 mt-0.5">{stats?.total ?? 0}</p>
          </div>
          <div className="bg-white rounded-xl p-3.5 border border-gray-100">
            <p className="text-[11px] text-gray-400 uppercase font-medium">En espera</p>
            <p className="text-xl font-bold text-blue-600 mt-0.5">{stats?.waiting ?? 0}</p>
          </div>
          <div className="bg-white rounded-xl p-3.5 border border-gray-100">
            <p className="text-[11px] text-gray-400 uppercase font-medium">Contactados</p>
            <p className="text-xl font-bold text-purple-600 mt-0.5">{stats?.contacted ?? 0}</p>
          </div>
          <div className="bg-white rounded-xl p-3.5 border border-gray-100">
            <p className="text-[11px] text-gray-400 uppercase font-medium">Inscritos</p>
            <p className="text-xl font-bold text-green-600 mt-0.5">{stats?.enrolled ?? 0}</p>
          </div>
          <div className="bg-white rounded-xl p-3.5 border border-red-100">
            <p className="text-[11px] text-red-400 uppercase font-medium">Prioridad alta</p>
            <p className="text-xl font-bold text-red-600 mt-0.5">{stats?.highPriority ?? 0}</p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex gap-2">
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="text-[13px] border border-gray-200 rounded-lg px-3 py-1.5 text-gray-600 bg-white">
              <option value="">Todos los estados</option>
              {Object.entries(statusConfig).map(([k, v]) => (
                <option key={k} value={k}>{v.label}</option>
              ))}
            </select>
            <select value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)} className="text-[13px] border border-gray-200 rounded-lg px-3 py-1.5 text-gray-600 bg-white">
              <option value="">Todas las prioridades</option>
              <option value="HIGH">Alta</option>
              <option value="MEDIUM">Media</option>
              <option value="LOW">Baja</option>
            </select>
          </div>
          <button onClick={() => setShowAdd(true)} className="px-4 py-2 bg-brand-dark text-white rounded-lg text-[13px] font-medium hover:bg-brand-medium transition">
            + Agregar a lista
          </button>
        </div>

        {/* List */}
        {isLoading && (
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-xl p-4 border border-gray-100 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-48" />
              </div>
            ))}
          </div>
        )}

        {!isLoading && entries && entries.length > 0 && (
          <div className="space-y-2">
            {entries.map((entry, idx) => {
              const priority = priorityConfig[entry.priority];
              const status = statusConfig[entry.status];
              const waitDays = Math.floor((Date.now() - new Date(entry.createdAt).getTime()) / (1000 * 60 * 60 * 24));

              return (
                <div key={entry.id} className="bg-white rounded-xl p-4 border border-gray-100 hover:shadow-soft transition">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      {/* Position */}
                      <div className="w-7 h-7 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-[11px] font-bold text-gray-500">{idx + 1}</span>
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-[14px] font-semibold text-gray-900">{entry.childName}</p>
                          <div className={`w-2 h-2 rounded-full ${priority.dot}`} title={`Prioridad ${priority.label}`} />
                          <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${status.color}`}>{status.label}</span>
                        </div>
                        <div className="flex flex-wrap items-center gap-3 mt-1 text-[11px] text-gray-400">
                          <span>👤 {entry.parentName}</span>
                          <span>📞 {entry.parentPhone}</span>
                          {entry.parentEmail && <span>✉️ {entry.parentEmail}</span>}
                          <span>⏱️ {waitDays} días esperando</span>
                        </div>
                        {entry.diagnosis && (
                          <p className="text-[11px] text-gray-500 mt-1">Dx: {entry.diagnosis}</p>
                        )}
                        {entry.requestedServices && (
                          <p className="text-[11px] text-gray-400 mt-0.5">Servicios: {entry.requestedServices}</p>
                        )}
                        {entry.notes && (
                          <p className="text-[11px] text-gray-400 mt-0.5 italic">{entry.notes}</p>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1 flex-shrink-0">
                      {entry.status === "WAITING" && (
                        <button
                          onClick={() => updateStatusMutation.mutate({ id: entry.id, status: "CONTACTED" })}
                          className="px-2.5 py-1 bg-purple-50 text-purple-700 rounded-md text-[11px] font-medium hover:bg-purple-100 transition"
                        >
                          Contactar
                        </button>
                      )}
                      {entry.status === "CONTACTED" && (
                        <button
                          onClick={() => updateStatusMutation.mutate({ id: entry.id, status: "ENROLLED" })}
                          className="px-2.5 py-1 bg-green-50 text-green-700 rounded-md text-[11px] font-medium hover:bg-green-100 transition"
                        >
                          Inscribir
                        </button>
                      )}
                      <select
                        value={entry.priority}
                        onChange={(e) => updatePriorityMutation.mutate({ id: entry.id, priority: e.target.value as any })}
                        className="text-[10px] border border-gray-200 rounded-md px-1.5 py-1 bg-white"
                      >
                        <option value="HIGH">🔴 Alta</option>
                        <option value="MEDIUM">🟡 Media</option>
                        <option value="LOW">🟢 Baja</option>
                      </select>
                      <button
                        onClick={() => { if (confirm("¿Eliminar de la lista?")) deleteMutation.mutate({ id: entry.id }); }}
                        className="p-1.5 text-gray-300 hover:text-red-500 transition"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {!isLoading && (!entries || entries.length === 0) && (
          <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
            <div className="w-14 h-14 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-800 mb-1">Lista de Espera Vacía</h3>
            <p className="text-[13px] text-gray-400">No hay candidatos en espera actualmente</p>
          </div>
        )}
      </div>

      {showAdd && (
        <AddEntryDialog onClose={() => setShowAdd(false)} onCreated={() => { setShowAdd(false); refetch(); }} />
      )}
    </>
  );
}

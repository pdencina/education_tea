"use client";

import { useState } from "react";
import { trpc } from "@/lib/trpc";

export function TabPeriodos() {
  const { data: periods, isLoading, refetch } = trpc.admin.listPeriods.useQuery();
  const [showCreate, setShowCreate] = useState(false);

  const toggleMutation = trpc.admin.togglePeriodActive.useMutation({ onSuccess: () => refetch() });
  const deleteMutation = trpc.admin.deletePeriod.useMutation({ onSuccess: () => refetch() });
  const createMutation = trpc.admin.createPeriod.useMutation({
    onSuccess: () => { setShowCreate(false); refetch(); },
  });

  const handleCreate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    createMutation.mutate({
      name: form.get("name") as string,
      startDate: form.get("startDate") as string,
      endDate: form.get("endDate") as string,
      isActive: form.get("isActive") === "on",
    });
  };

  return (
    <div className="space-y-4 max-w-2xl">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-800">Períodos Académicos</h3>
        <button
          onClick={() => setShowCreate(!showCreate)}
          className="px-4 py-2 bg-primary-500 text-white rounded-xl text-sm font-medium hover:bg-primary-600 transition"
        >
          {showCreate ? "Cancelar" : "+ Nuevo Período"}
        </button>
      </div>

      {/* Create form */}
      {showCreate && (
        <form onSubmit={handleCreate} className="bg-pastel-lavender/50 rounded-2xl p-5 space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Nombre *</label>
            <input name="name" required placeholder="Ej: Marzo - Julio 2026" className="w-full px-3 py-2.5 bg-white border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-300" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Fecha inicio *</label>
              <input name="startDate" type="date" required className="w-full px-3 py-2.5 bg-white border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-300" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Fecha fin *</label>
              <input name="endDate" type="date" required className="w-full px-3 py-2.5 bg-white border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-300" />
            </div>
          </div>
          <label className="flex items-center gap-2 text-sm text-gray-600">
            <input name="isActive" type="checkbox" className="rounded border-gray-300 text-primary-500 focus:ring-primary-300" />
            Marcar como período activo
          </label>
          <button type="submit" disabled={createMutation.isPending} className="px-4 py-2 bg-primary-500 text-white rounded-xl text-sm font-medium hover:bg-primary-600 transition disabled:opacity-50">
            {createMutation.isPending ? "Creando..." : "Crear Período"}
          </button>
        </form>
      )}

      {/* List */}
      {isLoading ? (
        <div className="animate-pulse space-y-3">{[1,2].map(i => <div key={i} className="h-16 bg-gray-100 rounded-xl" />)}</div>
      ) : (
        <div className="space-y-2">
          {periods?.map((p) => (
            <div key={p.id} className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-medium text-gray-800 text-sm">{p.name}</p>
                  {p.isActive && <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-[10px] font-medium">Activo</span>}
                </div>
                <p className="text-xs text-gray-400 mt-0.5">
                  {new Date(p.startDate).toLocaleDateString("es", { day: "numeric", month: "short", year: "numeric" })} — {new Date(p.endDate).toLocaleDateString("es", { day: "numeric", month: "short", year: "numeric" })}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {!p.isActive && (
                  <button
                    onClick={() => toggleMutation.mutate({ id: p.id, isActive: true })}
                    className="px-3 py-1.5 text-xs font-medium text-primary-600 bg-primary-50 rounded-lg hover:bg-primary-100 transition"
                  >
                    Activar
                  </button>
                )}
                <button
                  onClick={() => { if (confirm("¿Eliminar este período?")) deleteMutation.mutate({ id: p.id }); }}
                  className="p-1.5 text-gray-300 hover:text-red-500 transition"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
              </div>
            </div>
          ))}
          {periods?.length === 0 && <p className="text-sm text-gray-400 text-center py-4">No hay períodos creados</p>}
        </div>
      )}
    </div>
  );
}

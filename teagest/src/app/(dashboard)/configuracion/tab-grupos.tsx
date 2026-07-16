"use client";

import { useState } from "react";
import { trpc } from "@/lib/trpc";

export function TabGrupos() {
  const { data: groups, isLoading, refetch } = trpc.admin.listGroups.useQuery();
  const [showCreate, setShowCreate] = useState(false);

  const createMutation = trpc.admin.createGroup.useMutation({
    onSuccess: () => { setShowCreate(false); refetch(); },
  });
  const deleteMutation = trpc.admin.deleteGroup.useMutation({ onSuccess: () => refetch() });

  const handleCreate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    createMutation.mutate({
      name: form.get("name") as string,
      capacity: parseInt(form.get("capacity") as string) || 8,
      level: (form.get("level") as string) || undefined,
    });
  };

  return (
    <div className="space-y-4 max-w-2xl">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-800">Grupos</h3>
        <button
          onClick={() => setShowCreate(!showCreate)}
          className="px-4 py-2 bg-primary-500 text-white rounded-xl text-sm font-medium hover:bg-primary-600 transition"
        >
          {showCreate ? "Cancelar" : "+ Nuevo Grupo"}
        </button>
      </div>

      {showCreate && (
        <form onSubmit={handleCreate} className="bg-pastel-teal/50 rounded-2xl p-5 space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Nombre *</label>
            <input name="name" required placeholder="Ej: Grupo A (4-6 años)" className="w-full px-3 py-2.5 bg-white border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-300" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Capacidad</label>
              <input name="capacity" type="number" defaultValue={8} min={1} className="w-full px-3 py-2.5 bg-white border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-300" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Nivel</label>
              <select name="level" className="w-full px-3 py-2.5 bg-white border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-300">
                <option value="">Sin especificar</option>
                <option value="preescolar">Preescolar</option>
                <option value="primaria_baja">Primaria Baja</option>
                <option value="primaria_alta">Primaria Alta</option>
                <option value="secundaria">Secundaria</option>
                <option value="transicion">Transición</option>
              </select>
            </div>
          </div>
          <button type="submit" disabled={createMutation.isPending} className="px-4 py-2 bg-primary-500 text-white rounded-xl text-sm font-medium hover:bg-primary-600 transition disabled:opacity-50">
            {createMutation.isPending ? "Creando..." : "Crear Grupo"}
          </button>
        </form>
      )}

      {isLoading ? (
        <div className="animate-pulse space-y-3">{[1,2,3].map(i => <div key={i} className="h-16 bg-gray-100 rounded-xl" />)}</div>
      ) : (
        <div className="space-y-2">
          {groups?.map((g) => (
            <div key={g.id} className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-pastel-teal rounded-xl flex items-center justify-center">
                  <span className="text-sm font-bold text-teal-700">{g._count.students}</span>
                </div>
                <div>
                  <p className="font-medium text-gray-800 text-sm">{g.name}</p>
                  <p className="text-xs text-gray-400">Capacidad: {g.capacity} · {g._count.students} alumnos</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {g.level && (
                  <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-[10px] font-medium">
                    {g.level}
                  </span>
                )}
                <button
                  onClick={() => { if (confirm("¿Eliminar este grupo?")) deleteMutation.mutate({ id: g.id }); }}
                  className="p-1.5 text-gray-300 hover:text-red-500 transition"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
              </div>
            </div>
          ))}
          {groups?.length === 0 && <p className="text-sm text-gray-400 text-center py-4">No hay grupos creados</p>}
        </div>
      )}
    </div>
  );
}

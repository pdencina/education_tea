"use client";

import { useState } from "react";
import { trpc } from "@/lib/trpc";

export function TabAreas() {
  const { data: areas, isLoading, refetch } = trpc.admin.listDevAreas.useQuery();
  const [showCreate, setShowCreate] = useState(false);

  const createMutation = trpc.admin.createDevArea.useMutation({
    onSuccess: () => { setShowCreate(false); refetch(); },
  });
  const deleteMutation = trpc.admin.deleteDevArea.useMutation({ onSuccess: () => refetch() });

  const handleCreate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    createMutation.mutate({
      name: form.get("name") as string,
      icon: (form.get("icon") as string) || undefined,
      description: (form.get("description") as string) || undefined,
    });
  };

  const emojiOptions = ["🗣️", "🤝", "🧑‍🦯", "📚", "🎯", "🧠", "🏃", "🎨", "🎵", "💪", "👁️", "❤️"];

  return (
    <div className="space-y-4 max-w-2xl">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-gray-800">Áreas de Desarrollo</h3>
          <p className="text-xs text-gray-400 mt-0.5">Se usan para organizar los objetivos del PEI</p>
        </div>
        <button
          onClick={() => setShowCreate(!showCreate)}
          className="px-4 py-2 bg-primary-500 text-white rounded-xl text-sm font-medium hover:bg-primary-600 transition"
        >
          {showCreate ? "Cancelar" : "+ Nueva Área"}
        </button>
      </div>

      {showCreate && (
        <form onSubmit={handleCreate} className="bg-pastel-yellow/50 rounded-2xl p-5 space-y-3">
          <div className="grid grid-cols-[auto_1fr] gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Icono</label>
              <select name="icon" className="px-3 py-2.5 bg-white border border-gray-100 rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-primary-300">
                {emojiOptions.map((e) => (
                  <option key={e} value={e}>{e}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Nombre *</label>
              <input name="name" required placeholder="Ej: Comunicación" className="w-full px-3 py-2.5 bg-white border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-300" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Descripción</label>
            <input name="description" placeholder="Breve descripción del área (opcional)" className="w-full px-3 py-2.5 bg-white border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-300" />
          </div>
          <button type="submit" disabled={createMutation.isPending} className="px-4 py-2 bg-primary-500 text-white rounded-xl text-sm font-medium hover:bg-primary-600 transition disabled:opacity-50">
            {createMutation.isPending ? "Creando..." : "Crear Área"}
          </button>
        </form>
      )}

      {isLoading ? (
        <div className="animate-pulse space-y-3">{[1,2,3].map(i => <div key={i} className="h-14 bg-gray-100 rounded-xl" />)}</div>
      ) : (
        <div className="space-y-2">
          {areas?.map((area, idx) => (
            <div key={area.id} className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-pastel-yellow rounded-xl flex items-center justify-center">
                  <span className="text-lg">{area.icon || "📌"}</span>
                </div>
                <div>
                  <p className="font-medium text-gray-800 text-sm">{area.name}</p>
                  {area.description && <p className="text-xs text-gray-400">{area.description}</p>}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-300">#{idx + 1}</span>
                <button
                  onClick={() => { if (confirm(`¿Eliminar el área "${area.name}"?`)) deleteMutation.mutate({ id: area.id }); }}
                  className="p-1.5 text-gray-300 hover:text-red-500 transition"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
              </div>
            </div>
          ))}
          {areas?.length === 0 && <p className="text-sm text-gray-400 text-center py-4">No hay áreas de desarrollo creadas</p>}
        </div>
      )}
    </div>
  );
}

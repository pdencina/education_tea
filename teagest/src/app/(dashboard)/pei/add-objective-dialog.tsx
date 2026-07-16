"use client";

import { useState } from "react";
import { trpc } from "@/lib/trpc";

interface AddObjectiveDialogProps {
  peiId: string;
  area: { id: string; name: string };
  onClose: () => void;
  onCreated: () => void;
}

export function AddObjectiveDialog({ peiId, area, onClose, onCreated }: AddObjectiveDialogProps) {
  const [error, setError] = useState("");

  const addMutation = trpc.pei.addObjective.useMutation({
    onSuccess: () => onCreated(),
    onError: (err) => setError(err.message || "Error al agregar objetivo"),
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    const form = new FormData(e.currentTarget);
    const description = form.get("description") as string;
    const targetLevel = form.get("targetLevel") as string;
    const targetDate = form.get("targetDate") as string;

    if (!description) {
      setError("La descripción es obligatoria");
      return;
    }

    addMutation.mutate({
      peiId,
      areaId: area.id,
      description,
      targetLevel: (targetLevel || "ACHIEVED_INDEPENDENT") as any,
      targetDate: targetDate || undefined,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-xl max-w-md w-full mx-4">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Nuevo Objetivo</h3>
              <p className="text-sm text-gray-500">Área: {area.name}</p>
            </div>
            <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">{error}</div>
          )}

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1.5">
              Descripción del objetivo *
            </label>
            <textarea
              id="description"
              name="description"
              rows={3}
              required
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              placeholder="Ej: Solicitar objetos usando pictogramas de forma espontánea"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="targetLevel" className="block text-sm font-medium text-gray-700 mb-1.5">
                Meta esperada
              </label>
              <select
                id="targetLevel"
                name="targetLevel"
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="ACHIEVED_INDEPENDENT">Logrado independiente</option>
                <option value="ACHIEVED_WITH_SUPPORT">Logrado con apoyo</option>
                <option value="IN_PROGRESS">En proceso</option>
              </select>
            </div>
            <div>
              <label htmlFor="targetDate" className="block text-sm font-medium text-gray-700 mb-1.5">
                Fecha meta
              </label>
              <input
                id="targetDate"
                name="targetDate"
                type="date"
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition">
              Cancelar
            </button>
            <button type="submit" disabled={addMutation.isPending} className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition disabled:opacity-50">
              {addMutation.isPending ? "Guardando..." : "Agregar Objetivo"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

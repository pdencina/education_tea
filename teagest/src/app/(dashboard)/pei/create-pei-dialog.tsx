"use client";

import { useState } from "react";
import { trpc } from "@/lib/trpc";

interface CreatePEIDialogProps {
  studentId: string;
  onClose: () => void;
  onCreated: () => void;
}

export function CreatePEIDialog({ studentId, onClose, onCreated }: CreatePEIDialogProps) {
  const [error, setError] = useState("");
  const { data: periods } = trpc.periods.list.useQuery();

  const createMutation = trpc.pei.create.useMutation({
    onSuccess: () => onCreated(),
    onError: (err) => setError(err.message || "Error al crear PEI"),
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    const form = new FormData(e.currentTarget);
    const periodId = form.get("periodId") as string;
    const startDate = form.get("startDate") as string;
    const reviewDate = form.get("reviewDate") as string;
    const notes = form.get("notes") as string;

    if (!periodId || !startDate) {
      setError("Período y fecha de inicio son obligatorios");
      return;
    }

    createMutation.mutate({
      studentId,
      periodId,
      startDate,
      reviewDate: reviewDate || undefined,
      notes: notes || undefined,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-xl max-w-md w-full mx-4">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-800">Crear Nuevo PEI</h3>
            <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <p className="text-sm text-gray-500 mt-1">Si existe un PEI activo, será cerrado automáticamente</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">{error}</div>
          )}

          <div>
            <label htmlFor="periodId" className="block text-sm font-medium text-gray-700 mb-1.5">Período *</label>
            <select
              id="periodId"
              name="periodId"
              required
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Seleccionar período...</option>
              {periods?.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} {p.isActive ? "(Activo)" : ""}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1.5">Fecha inicio *</label>
              <input
                id="startDate"
                name="startDate"
                type="date"
                required
                defaultValue={new Date().toISOString().split("T")[0]}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="reviewDate" className="block text-sm font-medium text-gray-700 mb-1.5">Fecha revisión</label>
              <input
                id="reviewDate"
                name="reviewDate"
                type="date"
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1.5">Observaciones</label>
            <textarea
              id="notes"
              name="notes"
              rows={3}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              placeholder="Enfoque del PEI, prioridades, contexto..."
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition">
              Cancelar
            </button>
            <button type="submit" disabled={createMutation.isPending} className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition disabled:opacity-50">
              {createMutation.isPending ? "Creando..." : "Crear PEI"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

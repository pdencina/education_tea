"use client";

import { useState } from "react";
import { trpc } from "@/lib/trpc";

interface AddEntryDialogProps {
  onClose: () => void;
  onCreated: () => void;
}

export function AddEntryDialog({ onClose, onCreated }: AddEntryDialogProps) {
  const [error, setError] = useState("");

  const createMutation = trpc.waitingList.create.useMutation({
    onSuccess: () => onCreated(),
    onError: (err) => setError(err.message || "Error al agregar"),
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    const form = new FormData(e.currentTarget);

    createMutation.mutate({
      childName: form.get("childName") as string,
      childBirthDate: (form.get("childBirthDate") as string) || undefined,
      childAge: form.get("childAge") ? parseInt(form.get("childAge") as string) : undefined,
      diagnosis: (form.get("diagnosis") as string) || undefined,
      supportLevel: (form.get("supportLevel") as string) || undefined,
      parentName: form.get("parentName") as string,
      parentEmail: (form.get("parentEmail") as string) || undefined,
      parentPhone: form.get("parentPhone") as string,
      priority: (form.get("priority") as any) || "MEDIUM",
      requestedServices: (form.get("requestedServices") as string) || undefined,
      referredBy: (form.get("referredBy") as string) || undefined,
      notes: (form.get("notes") as string) || undefined,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-xl max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-5 border-b border-gray-100 sticky top-0 bg-white rounded-t-2xl">
          <div className="flex items-center justify-between">
            <h3 className="text-[16px] font-semibold text-gray-900">Agregar a Lista de Espera</h3>
            <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-100 rounded-lg text-[13px] text-red-600">{error}</div>
          )}

          {/* Child info */}
          <p className="text-[12px] font-semibold text-gray-400 uppercase tracking-wider">Datos del niño/a</p>

          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <label className="block text-[13px] font-medium text-gray-700 mb-1">Nombre del niño/a *</label>
              <input name="childName" required className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500" placeholder="Nombre completo" />
            </div>
            <div>
              <label className="block text-[13px] font-medium text-gray-700 mb-1">Fecha de nacimiento</label>
              <input name="childBirthDate" type="date" className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500" />
            </div>
            <div>
              <label className="block text-[13px] font-medium text-gray-700 mb-1">Edad (años)</label>
              <input name="childAge" type="number" min="0" max="25" className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500" />
            </div>
            <div>
              <label className="block text-[13px] font-medium text-gray-700 mb-1">Diagnóstico</label>
              <input name="diagnosis" className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500" placeholder="TEA, sospecha TEA, etc." />
            </div>
            <div>
              <label className="block text-[13px] font-medium text-gray-700 mb-1">Nivel de apoyo</label>
              <select name="supportLevel" className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500">
                <option value="">Sin especificar</option>
                <option value="1">Nivel 1</option>
                <option value="2">Nivel 2</option>
                <option value="3">Nivel 3</option>
                <option value="pendiente">Pendiente de evaluación</option>
              </select>
            </div>
          </div>

          {/* Parent info */}
          <p className="text-[12px] font-semibold text-gray-400 uppercase tracking-wider pt-2">Datos del apoderado</p>

          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <label className="block text-[13px] font-medium text-gray-700 mb-1">Nombre apoderado *</label>
              <input name="parentName" required className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500" />
            </div>
            <div>
              <label className="block text-[13px] font-medium text-gray-700 mb-1">Teléfono *</label>
              <input name="parentPhone" required className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500" placeholder="+56 9 ..." />
            </div>
            <div>
              <label className="block text-[13px] font-medium text-gray-700 mb-1">Email</label>
              <input name="parentEmail" type="email" className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500" />
            </div>
          </div>

          {/* Additional */}
          <p className="text-[12px] font-semibold text-gray-400 uppercase tracking-wider pt-2">Información adicional</p>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[13px] font-medium text-gray-700 mb-1">Prioridad</label>
              <select name="priority" className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500">
                <option value="HIGH">🔴 Alta</option>
                <option value="MEDIUM" selected>🟡 Media</option>
                <option value="LOW">🟢 Baja</option>
              </select>
            </div>
            <div>
              <label className="block text-[13px] font-medium text-gray-700 mb-1">Derivado por</label>
              <input name="referredBy" className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500" placeholder="Neurólogo, otro centro..." />
            </div>
            <div className="col-span-2">
              <label className="block text-[13px] font-medium text-gray-700 mb-1">Servicios solicitados</label>
              <input name="requestedServices" className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500" placeholder="T.O., Fono, Psicología, etc." />
            </div>
            <div className="col-span-2">
              <label className="block text-[13px] font-medium text-gray-700 mb-1">Notas</label>
              <textarea name="notes" rows={2} className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 resize-none" placeholder="Observaciones relevantes..." />
            </div>
          </div>

          <div className="flex gap-3 pt-3">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-lg text-[13px] font-medium hover:bg-gray-50 transition">
              Cancelar
            </button>
            <button type="submit" disabled={createMutation.isPending} className="flex-1 px-4 py-2.5 bg-brand-dark text-white rounded-lg text-[13px] font-medium hover:bg-brand-medium transition disabled:opacity-50">
              {createMutation.isPending ? "Agregando..." : "Agregar a Lista"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

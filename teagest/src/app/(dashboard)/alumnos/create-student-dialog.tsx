"use client";

import { useState } from "react";
import { trpc } from "@/lib/trpc";

type Group = {
  id: string;
  name: string;
  _count: { students: number };
};

interface CreateStudentDialogProps {
  groups: Group[];
  onClose: () => void;
  onCreated: () => void;
}

export function CreateStudentDialog({ groups, onClose, onCreated }: CreateStudentDialogProps) {
  const [error, setError] = useState("");

  const createMutation = trpc.students.create.useMutation({
    onSuccess: () => {
      onCreated();
    },
    onError: (err) => {
      setError(err.message || "Error al crear alumno");
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    const form = new FormData(e.currentTarget);
    const data = {
      firstName: form.get("firstName") as string,
      lastName: form.get("lastName") as string,
      birthDate: form.get("birthDate") as string,
      diagnosis: (form.get("diagnosis") as string) || undefined,
      supportLevel: form.get("supportLevel") as "LEVEL_1" | "LEVEL_2" | "LEVEL_3",
      groupId: (form.get("groupId") as string) || undefined,
      notes: (form.get("notes") as string) || undefined,
    };

    if (!data.firstName || !data.lastName || !data.birthDate || !data.supportLevel) {
      setError("Por favor completa los campos obligatorios");
      return;
    }

    createMutation.mutate(data);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Dialog */}
      <div className="relative bg-white rounded-2xl shadow-xl max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-800">Nuevo Alumno</h3>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1.5">
                Nombre *
              </label>
              <input
                id="firstName"
                name="firstName"
                type="text"
                required
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ej: Mateo"
              />
            </div>
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1.5">
                Apellido *
              </label>
              <input
                id="lastName"
                name="lastName"
                type="text"
                required
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ej: Sánchez"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700 mb-1.5">
                Fecha de nacimiento *
              </label>
              <input
                id="birthDate"
                name="birthDate"
                type="date"
                required
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="supportLevel" className="block text-sm font-medium text-gray-700 mb-1.5">
                Nivel de apoyo *
              </label>
              <select
                id="supportLevel"
                name="supportLevel"
                required
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Seleccionar...</option>
                <option value="LEVEL_1">Nivel 1 - Requiere apoyo</option>
                <option value="LEVEL_2">Nivel 2 - Requiere apoyo sustancial</option>
                <option value="LEVEL_3">Nivel 3 - Requiere apoyo muy sustancial</option>
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="groupId" className="block text-sm font-medium text-gray-700 mb-1.5">
              Grupo
            </label>
            <select
              id="groupId"
              name="groupId"
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Sin grupo asignado</option>
              {groups.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="diagnosis" className="block text-sm font-medium text-gray-700 mb-1.5">
              Diagnóstico
            </label>
            <input
              id="diagnosis"
              name="diagnosis"
              type="text"
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ej: TEA - Nivel 2 de apoyo"
            />
          </div>

          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1.5">
              Observaciones
            </label>
            <textarea
              id="notes"
              name="notes"
              rows={3}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              placeholder="Información relevante: intereses, sensibilidades, estrategias que funcionan..."
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={createMutation.isPending}
              className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition disabled:opacity-50"
            >
              {createMutation.isPending ? "Guardando..." : "Crear Alumno"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { trpc } from "@/lib/trpc";

interface AssignDialogProps {
  staffId: string;
  onClose: () => void;
  onAssigned: () => void;
}

export function AssignDialog({ staffId, onClose, onAssigned }: AssignDialogProps) {
  const [error, setError] = useState("");
  const [selectedStudentId, setSelectedStudentId] = useState("");

  const { data: students } = trpc.students.list.useQuery({});

  const assignMutation = trpc.staff.assign.useMutation({
    onSuccess: () => onAssigned(),
    onError: (err) => setError(err.message || "Error al asignar"),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!selectedStudentId) {
      setError("Selecciona un alumno");
      return;
    }

    assignMutation.mutate({ userId: staffId, studentId: selectedStudentId });
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-xl max-w-sm w-full mx-4">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-800">Asignar Alumno</h3>
            <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600">{error}</div>
          )}

          <div>
            <label htmlFor="student" className="block text-sm font-medium text-gray-700 mb-1.5">
              Seleccionar alumno
            </label>
            <select
              id="student"
              value={selectedStudentId}
              onChange={(e) => setSelectedStudentId(e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-300"
            >
              <option value="">Elegir alumno...</option>
              {students?.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.firstName} {s.lastName} — {s.group?.name || "Sin grupo"}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50 transition">
              Cancelar
            </button>
            <button type="submit" disabled={assignMutation.isPending} className="flex-1 px-4 py-2.5 bg-primary-500 text-white rounded-xl text-sm font-medium hover:bg-primary-600 transition disabled:opacity-50">
              {assignMutation.isPending ? "Asignando..." : "Asignar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

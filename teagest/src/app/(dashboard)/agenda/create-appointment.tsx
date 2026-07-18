"use client";

import { useState } from "react";
import { trpc } from "@/lib/trpc";

interface CreateAppointmentDialogProps {
  onClose: () => void;
  onCreated: () => void;
}

export function CreateAppointmentDialog({ onClose, onCreated }: CreateAppointmentDialogProps) {
  const [error, setError] = useState("");

  const { data: students } = trpc.students.list.useQuery({});
  const { data: staff } = trpc.staff.list.useQuery();
  const { data: rooms } = trpc.appointments.listRooms.useQuery();

  const createMutation = trpc.appointments.create.useMutation({
    onSuccess: () => onCreated(),
    onError: (err) => setError(err.message || "Error al crear cita"),
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    const form = new FormData(e.currentTarget);
    const studentId = form.get("studentId") as string;
    const therapistId = form.get("therapistId") as string;
    const roomId = form.get("roomId") as string;
    const date = form.get("date") as string;
    const startTime = form.get("startTime") as string;
    const endTime = form.get("endTime") as string;
    const type = form.get("type") as string;
    const notes = form.get("notes") as string;

    if (!studentId || !therapistId || !date || !startTime || !endTime) {
      setError("Completa los campos obligatorios");
      return;
    }

    createMutation.mutate({
      studentId,
      therapistId,
      roomId: roomId || undefined,
      date,
      startTime,
      endTime,
      type: type || "INDIVIDUAL",
      notes: notes || undefined,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-5 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h3 className="text-[16px] font-semibold text-gray-900">Nueva Cita</h3>
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

          <div>
            <label className="block text-[13px] font-medium text-gray-700 mb-1">Paciente *</label>
            <select name="studentId" required className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500">
              <option value="">Seleccionar...</option>
              {students?.map((s) => (
                <option key={s.id} value={s.id}>{s.firstName} {s.lastName}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[13px] font-medium text-gray-700 mb-1">Terapeuta *</label>
            <select name="therapistId" required className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500">
              <option value="">Seleccionar...</option>
              {staff?.map((s) => (
                <option key={s.id} value={s.id}>{s.name} — {s.specialty || s.role}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-[13px] font-medium text-gray-700 mb-1">Fecha *</label>
              <input name="date" type="date" required defaultValue={new Date().toISOString().split("T")[0]} className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500" />
            </div>
            <div>
              <label className="block text-[13px] font-medium text-gray-700 mb-1">Inicio *</label>
              <input name="startTime" type="time" required className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500" />
            </div>
            <div>
              <label className="block text-[13px] font-medium text-gray-700 mb-1">Fin *</label>
              <input name="endTime" type="time" required className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[13px] font-medium text-gray-700 mb-1">Sala</label>
              <select name="roomId" className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500">
                <option value="">Sin sala</option>
                {rooms?.map((r) => (
                  <option key={r.id} value={r.id}>{r.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[13px] font-medium text-gray-700 mb-1">Tipo</label>
              <select name="type" className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500">
                <option value="INDIVIDUAL">Individual</option>
                <option value="GRUPAL">Grupal</option>
                <option value="EVALUACION">Evaluación</option>
                <option value="TERAPIA_OCUPACIONAL">Terapia Ocupacional</option>
                <option value="FONOAUDIOLOGIA">Fonoaudiología</option>
                <option value="PSICOLOGIA">Psicología</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[13px] font-medium text-gray-700 mb-1">Notas</label>
            <textarea name="notes" rows={2} className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 resize-none" placeholder="Observaciones (opcional)" />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-lg text-[13px] font-medium hover:bg-gray-50 transition">
              Cancelar
            </button>
            <button type="submit" disabled={createMutation.isPending} className="flex-1 px-4 py-2.5 bg-brand-dark text-white rounded-lg text-[13px] font-medium hover:bg-brand-medium transition disabled:opacity-50">
              {createMutation.isPending ? "Creando..." : "Agendar Cita"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

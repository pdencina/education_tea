"use client";

import { useState } from "react";
import { trpc } from "@/lib/trpc";

interface CreateSessionDialogProps {
  onClose: () => void;
  onCreated: () => void;
  preselectedStudentId?: string;
}

export function CreateSessionDialog({ onClose, onCreated, preselectedStudentId }: CreateSessionDialogProps) {
  const [error, setError] = useState("");
  const [selectedMood, setSelectedMood] = useState("");
  const [selectedParticipation, setSelectedParticipation] = useState("");

  const { data: students } = trpc.students.list.useQuery({});

  const createMutation = trpc.sessions.create.useMutation({
    onSuccess: () => onCreated(),
    onError: (err) => setError(err.message || "Error al registrar sesión"),
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    const form = new FormData(e.currentTarget);
    const studentId = form.get("studentId") as string;
    const date = form.get("date") as string;
    const startTime = form.get("startTime") as string;
    const endTime = form.get("endTime") as string;
    const type = form.get("type") as string;
    const activities = form.get("activities") as string;
    const behaviors = form.get("behaviors") as string;
    const notes = form.get("notes") as string;

    if (!studentId || !date || !startTime || !type) {
      setError("Alumno, fecha, hora de inicio y tipo son obligatorios");
      return;
    }

    createMutation.mutate({
      studentId,
      date,
      startTime,
      endTime: endTime || undefined,
      type: type as any,
      activities: activities || undefined,
      behaviors: behaviors || undefined,
      mood: selectedMood || undefined,
      participation: selectedParticipation || undefined,
      notes: notes || undefined,
    });
  };

  const moods = [
    { value: "excelente", emoji: "😊", label: "Excelente" },
    { value: "bien", emoji: "🙂", label: "Bien" },
    { value: "neutral", emoji: "😐", label: "Neutral" },
    { value: "dificil", emoji: "😟", label: "Difícil" },
    { value: "crisis", emoji: "😢", label: "Crisis" },
  ];

  const participationLevels = [
    { value: "alta", label: "Alta", color: "bg-green-100 text-green-700 border-green-200" },
    { value: "media", label: "Media", color: "bg-yellow-100 text-yellow-700 border-yellow-200" },
    { value: "baja", label: "Baja", color: "bg-orange-100 text-orange-700 border-orange-200" },
    { value: "nula", label: "Nula", color: "bg-red-100 text-red-700 border-red-200" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-xl max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-100 sticky top-0 bg-white rounded-t-2xl z-10">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-800">Registrar Sesión</h3>
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

          {/* Alumno */}
          <div>
            <label htmlFor="studentId" className="block text-sm font-medium text-gray-700 mb-1.5">Alumno *</label>
            <select
              id="studentId"
              name="studentId"
              required
              defaultValue={preselectedStudentId || ""}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Seleccionar alumno...</option>
              {students?.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.firstName} {s.lastName}
                </option>
              ))}
            </select>
          </div>

          {/* Fecha y hora */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1.5">Fecha *</label>
              <input
                id="date"
                name="date"
                type="date"
                required
                defaultValue={new Date().toISOString().split("T")[0]}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="startTime" className="block text-sm font-medium text-gray-700 mb-1.5">Inicio *</label>
              <input
                id="startTime"
                name="startTime"
                type="time"
                required
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="endTime" className="block text-sm font-medium text-gray-700 mb-1.5">Fin</label>
              <input
                id="endTime"
                name="endTime"
                type="time"
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Tipo */}
          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1.5">Tipo de sesión *</label>
            <select
              id="type"
              name="type"
              required
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Seleccionar...</option>
              <option value="INDIVIDUAL">Individual</option>
              <option value="GROUP">Grupal</option>
              <option value="OCCUPATIONAL_THERAPY">Terapia Ocupacional</option>
              <option value="SPEECH_THERAPY">Fonoaudiología</option>
              <option value="PSYCHOLOGY">Psicología</option>
              <option value="OTHER">Otro</option>
            </select>
          </div>

          {/* Estado emocional */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Estado emocional</label>
            <div className="flex gap-2">
              {moods.map((m) => (
                <button
                  key={m.value}
                  type="button"
                  onClick={() => setSelectedMood(selectedMood === m.value ? "" : m.value)}
                  className={`flex-1 flex flex-col items-center p-2 rounded-lg border transition ${
                    selectedMood === m.value
                      ? "border-blue-500 bg-blue-50 ring-1 ring-blue-200"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <span className="text-xl">{m.emoji}</span>
                  <span className="text-[10px] text-gray-500 mt-0.5">{m.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Participación */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nivel de participación</label>
            <div className="flex gap-2">
              {participationLevels.map((p) => (
                <button
                  key={p.value}
                  type="button"
                  onClick={() => setSelectedParticipation(selectedParticipation === p.value ? "" : p.value)}
                  className={`flex-1 py-2 rounded-lg border text-xs font-medium transition ${
                    selectedParticipation === p.value
                      ? `${p.color} ring-1 ring-offset-1`
                      : "border-gray-200 text-gray-500 hover:border-gray-300"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Actividades */}
          <div>
            <label htmlFor="activities" className="block text-sm font-medium text-gray-700 mb-1.5">Actividades realizadas</label>
            <input
              id="activities"
              name="activities"
              type="text"
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ej: Trabajo con pictogramas, juego simbólico, motricidad fina"
            />
          </div>

          {/* Conductas */}
          <div>
            <label htmlFor="behaviors" className="block text-sm font-medium text-gray-700 mb-1.5">Conductas observadas</label>
            <input
              id="behaviors"
              name="behaviors"
              type="text"
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ej: Autorregulación mejorada, contacto visual breve"
            />
          </div>

          {/* Notas */}
          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1.5">Observaciones generales</label>
            <textarea
              id="notes"
              name="notes"
              rows={3}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              placeholder="Detalla cómo transcurrió la sesión, logros, dificultades..."
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition">
              Cancelar
            </button>
            <button type="submit" disabled={createMutation.isPending} className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition disabled:opacity-50">
              {createMutation.isPending ? "Guardando..." : "Guardar Sesión"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

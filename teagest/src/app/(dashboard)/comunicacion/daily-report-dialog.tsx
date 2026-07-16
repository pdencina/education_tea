"use client";

import { useState } from "react";
import { trpc } from "@/lib/trpc";

interface DailyReportDialogProps {
  studentId: string;
  studentName: string;
  onClose: () => void;
  onCreated: () => void;
}

export function DailyReportDialog({ studentId, studentName, onClose, onCreated }: DailyReportDialogProps) {
  const [error, setError] = useState("");
  const [mood, setMood] = useState("");
  const [feeding, setFeeding] = useState("");
  const [rest, setRest] = useState("");
  const [participation, setParticipation] = useState("");

  const createMutation = trpc.communication.createReport.useMutation({
    onSuccess: () => onCreated(),
    onError: (err) => setError(err.message || "Error al crear reporte"),
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    const form = new FormData(e.currentTarget);
    const highlights = form.get("highlights") as string;

    createMutation.mutate({
      studentId,
      mood: mood || undefined,
      feeding: feeding || undefined,
      rest: rest || undefined,
      participation: participation || undefined,
      highlights: highlights || undefined,
    });
  };

  const moods = [
    { value: "excelente", emoji: "😊", label: "Excelente" },
    { value: "bien", emoji: "🙂", label: "Bien" },
    { value: "neutral", emoji: "😐", label: "Neutral" },
    { value: "dificil", emoji: "😟", label: "Difícil" },
    { value: "crisis", emoji: "😢", label: "Crisis" },
  ];

  const feedingOptions = [
    { value: "comio_todo", label: "Comió todo" },
    { value: "comio_poco", label: "Comió poco" },
    { value: "no_comio", label: "No comió" },
    { value: "no_aplica", label: "No aplica" },
  ];

  const restOptions = [
    { value: "durmio_bien", label: "Durmió bien" },
    { value: "durmio_poco", label: "Durmió poco" },
    { value: "no_durmio", label: "No durmió" },
    { value: "no_aplica", label: "No aplica" },
  ];

  const participationOptions = [
    { value: "alta", label: "Alta" },
    { value: "media", label: "Media" },
    { value: "baja", label: "Baja" },
    { value: "nula", label: "Nula" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-100 sticky top-0 bg-white rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Reporte Diario</h3>
              <p className="text-sm text-gray-500">{studentName}</p>
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
            <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600">{error}</div>
          )}

          {/* Mood */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Estado de ánimo</label>
            <div className="flex gap-2">
              {moods.map((m) => (
                <button
                  key={m.value}
                  type="button"
                  onClick={() => setMood(mood === m.value ? "" : m.value)}
                  className={`flex-1 flex flex-col items-center p-2.5 rounded-xl border transition ${
                    mood === m.value
                      ? "border-primary-400 bg-primary-50 ring-1 ring-primary-200"
                      : "border-gray-100 hover:border-gray-200"
                  }`}
                >
                  <span className="text-xl">{m.emoji}</span>
                  <span className="text-[10px] text-gray-500 mt-0.5">{m.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Feeding */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">🍽️ Alimentación</label>
            <div className="grid grid-cols-2 gap-2">
              {feedingOptions.map((f) => (
                <button
                  key={f.value}
                  type="button"
                  onClick={() => setFeeding(feeding === f.value ? "" : f.value)}
                  className={`py-2 px-3 rounded-lg border text-xs font-medium transition ${
                    feeding === f.value
                      ? "border-primary-400 bg-primary-50 text-primary-700"
                      : "border-gray-100 text-gray-500 hover:border-gray-200"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Rest */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">😴 Descanso</label>
            <div className="grid grid-cols-2 gap-2">
              {restOptions.map((r) => (
                <button
                  key={r.value}
                  type="button"
                  onClick={() => setRest(rest === r.value ? "" : r.value)}
                  className={`py-2 px-3 rounded-lg border text-xs font-medium transition ${
                    rest === r.value
                      ? "border-primary-400 bg-primary-50 text-primary-700"
                      : "border-gray-100 text-gray-500 hover:border-gray-200"
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          {/* Participation */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">⭐ Participación</label>
            <div className="grid grid-cols-4 gap-2">
              {participationOptions.map((p) => (
                <button
                  key={p.value}
                  type="button"
                  onClick={() => setParticipation(participation === p.value ? "" : p.value)}
                  className={`py-2 rounded-lg border text-xs font-medium transition ${
                    participation === p.value
                      ? "border-primary-400 bg-primary-50 text-primary-700"
                      : "border-gray-100 text-gray-500 hover:border-gray-200"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Highlights */}
          <div>
            <label htmlFor="highlights" className="block text-sm font-medium text-gray-700 mb-1.5">
              Logros y observaciones del día
            </label>
            <textarea
              id="highlights"
              name="highlights"
              rows={3}
              className="w-full px-3 py-2.5 border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-transparent resize-none"
              placeholder="Qué logros tuvo hoy, qué actividades disfrutó, algo a tener en cuenta..."
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50 transition">
              Cancelar
            </button>
            <button type="submit" disabled={createMutation.isPending} className="flex-1 px-4 py-2.5 bg-primary-500 text-white rounded-xl text-sm font-medium hover:bg-primary-600 transition disabled:opacity-50">
              {createMutation.isPending ? "Enviando..." : "Enviar Reporte"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

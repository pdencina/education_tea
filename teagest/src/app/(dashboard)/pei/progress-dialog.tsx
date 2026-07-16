"use client";

import { useState } from "react";
import { trpc } from "@/lib/trpc";

interface ProgressDialogProps {
  objective: { id: string; description: string };
  onClose: () => void;
  onSaved: () => void;
}

export function ProgressDialog({ objective, onClose, onSaved }: ProgressDialogProps) {
  const [error, setError] = useState("");
  const [selectedLevel, setSelectedLevel] = useState<string>("");

  const { data: history } = trpc.pei.getProgress.useQuery({ objectiveId: objective.id });

  const registerMutation = trpc.pei.registerProgress.useMutation({
    onSuccess: () => onSaved(),
    onError: (err) => setError(err.message || "Error al registrar progreso"),
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    const form = new FormData(e.currentTarget);
    const levelAchieved = form.get("levelAchieved") as string;
    const notes = form.get("notes") as string;

    if (!levelAchieved) {
      setError("Selecciona el nivel alcanzado");
      return;
    }

    registerMutation.mutate({
      objectiveId: objective.id,
      levelAchieved: levelAchieved as any,
      notes: notes || undefined,
    });
  };

  const levelOptions = [
    { value: "NOT_STARTED", label: "No iniciado", emoji: "⬜", description: "Aún no se ha trabajado" },
    { value: "IN_PROGRESS", label: "En proceso", emoji: "🟡", description: "Se está trabajando activamente" },
    { value: "ACHIEVED_WITH_SUPPORT", label: "Logrado con apoyo", emoji: "🔵", description: "Lo logra con ayuda del adulto" },
    { value: "ACHIEVED_INDEPENDENT", label: "Logrado independiente", emoji: "🟢", description: "Lo realiza sin ayuda" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-xl max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Registrar Progreso</h3>
              <p className="text-sm text-gray-500 mt-1 line-clamp-2">{objective.description}</p>
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

          {/* Level selector */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nivel alcanzado *</label>
            <div className="grid grid-cols-2 gap-2">
              {levelOptions.map((opt) => (
                <label
                  key={opt.value}
                  className={`cursor-pointer border rounded-lg p-3 transition ${
                    selectedLevel === opt.value
                      ? "border-blue-500 bg-blue-50 ring-2 ring-blue-200"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="levelAchieved"
                    value={opt.value}
                    className="sr-only"
                    onChange={(e) => setSelectedLevel(e.target.value)}
                  />
                  <div className="text-center">
                    <span className="text-lg">{opt.emoji}</span>
                    <p className="text-xs font-medium text-gray-800 mt-1">{opt.label}</p>
                    <p className="text-[10px] text-gray-500 mt-0.5">{opt.description}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1.5">
              Observaciones
            </label>
            <textarea
              id="notes"
              name="notes"
              rows={3}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              placeholder="Describe el contexto: qué actividad se realizó, cómo respondió..."
            />
          </div>

          {/* History */}
          {history && history.length > 0 && (
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Historial reciente</p>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {history.slice(0, 5).map((h) => (
                  <div key={h.id} className="flex items-center justify-between text-xs bg-gray-50 rounded-lg px-3 py-2">
                    <div>
                      <span className="font-medium text-gray-700">
                        {levelOptions.find((l) => l.value === h.levelAchieved)?.emoji}{" "}
                        {levelOptions.find((l) => l.value === h.levelAchieved)?.label}
                      </span>
                      {h.notes && <p className="text-gray-500 mt-0.5">{h.notes}</p>}
                    </div>
                    <div className="text-right text-gray-400 flex-shrink-0 ml-3">
                      <p>{new Date(h.date).toLocaleDateString("es", { day: "numeric", month: "short" })}</p>
                      <p>{h.registeredBy.name.split(" ")[0]}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition">
              Cancelar
            </button>
            <button type="submit" disabled={registerMutation.isPending || !selectedLevel} className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition disabled:opacity-50">
              {registerMutation.isPending ? "Guardando..." : "Registrar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

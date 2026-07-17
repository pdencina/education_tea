"use client";

import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { PictogramSearch } from "./pictogram-search";

type ScheduleItem = {
  id: string;
  pictogramId: number;
  pictogramUrl: string;
  label: string;
  order: number;
};

interface ScheduleEditorProps {
  scheduleId?: string;
  onClose: () => void;
  onSaved: () => void;
}

export function ScheduleEditor({ scheduleId, onClose, onSaved }: ScheduleEditorProps) {
  const [title, setTitle] = useState("");
  const [items, setItems] = useState<ScheduleItem[]>([]);
  const [isTemplate, setIsTemplate] = useState(false);
  const [error, setError] = useState("");

  // Load existing schedule if editing
  const { data: existing } = trpc.schedules.getById.useQuery(
    { id: scheduleId || "" },
    { enabled: !!scheduleId }
  );

  useEffect(() => {
    if (existing) {
      setTitle(existing.title);
      setItems((existing.items as any[]) || []);
      setIsTemplate(existing.isTemplate);
    }
  }, [existing]);

  const createMutation = trpc.schedules.create.useMutation({
    onSuccess: () => onSaved(),
    onError: (err) => setError(err.message),
  });

  const updateMutation = trpc.schedules.update.useMutation({
    onSuccess: () => onSaved(),
    onError: (err) => setError(err.message),
  });

  const handleSave = () => {
    if (!title.trim()) {
      setError("El título es obligatorio");
      return;
    }
    if (items.length === 0) {
      setError("Agrega al menos un pictograma");
      return;
    }

    if (scheduleId) {
      updateMutation.mutate({ id: scheduleId, title, items });
    } else {
      createMutation.mutate({ title, items, isTemplate });
    }
  };

  const addPictogram = (pictogram: { id: number; url: string; label: string }) => {
    const newItem: ScheduleItem = {
      id: `item-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      pictogramId: pictogram.id,
      pictogramUrl: pictogram.url,
      label: pictogram.label,
      order: items.length,
    };
    setItems([...items, newItem]);
  };

  const removeItem = (itemId: string) => {
    setItems(items.filter((i) => i.id !== itemId).map((i, idx) => ({ ...i, order: idx })));
  };

  const moveItem = (index: number, direction: "up" | "down") => {
    const newItems = [...items];
    const swapIdx = direction === "up" ? index - 1 : index + 1;
    if (swapIdx < 0 || swapIdx >= newItems.length) return;
    [newItems[index], newItems[swapIdx]] = [newItems[swapIdx], newItems[index]];
    setItems(newItems.map((i, idx) => ({ ...i, order: idx })));
  };

  const isSaving = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-xl max-w-3xl w-full mx-4 max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-gray-100 flex items-center justify-between flex-shrink-0">
          <h3 className="text-lg font-semibold text-gray-800">
            {scheduleId ? "Editar Agenda" : "Nueva Agenda Visual"}
          </h3>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {error && (
            <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600">{error}</div>
          )}

          {/* Title */}
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-600 mb-1.5">Título de la agenda *</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ej: Rutina de la mañana, Actividades del lunes..."
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 focus:bg-white transition"
              />
            </div>
            {!scheduleId && (
              <label className="flex items-center gap-2 text-sm text-gray-600 mt-7">
                <input
                  type="checkbox"
                  checked={isTemplate}
                  onChange={(e) => setIsTemplate(e.target.checked)}
                  className="rounded border-gray-300 text-primary-500 focus:ring-primary-300"
                />
                Plantilla
              </label>
            )}
          </div>

          {/* Current sequence */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Secuencia ({items.length} pictograma{items.length !== 1 ? "s" : ""})
            </label>
            {items.length === 0 ? (
              <div className="bg-gray-50 rounded-xl p-6 text-center border-2 border-dashed border-gray-200">
                <p className="text-sm text-gray-400">
                  Busca pictogramas abajo y agrégalos a la secuencia
                </p>
              </div>
            ) : (
              <div className="flex gap-2 overflow-x-auto pb-2 bg-pastel-yellow/30 rounded-xl p-3 border border-yellow-100">
                {items.map((item, idx) => (
                  <div key={item.id} className="flex flex-col items-center flex-shrink-0 relative group/item">
                    <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center border border-gray-100 shadow-sm">
                      <img src={item.pictogramUrl} alt={item.label} className="w-14 h-14 object-contain" />
                    </div>
                    <span className="text-[10px] text-gray-600 mt-1 max-w-16 truncate text-center font-medium">
                      {item.label}
                    </span>
                    {/* Controls */}
                    <div className="absolute -top-1 -right-1 flex gap-0.5 opacity-0 group-hover/item:opacity-100 transition">
                      <button
                        onClick={() => removeItem(item.id)}
                        className="w-4 h-4 bg-red-500 text-white rounded-full flex items-center justify-center text-[8px]"
                      >
                        ✕
                      </button>
                    </div>
                    <div className="flex gap-0.5 mt-0.5 opacity-0 group-hover/item:opacity-100 transition">
                      {idx > 0 && (
                        <button onClick={() => moveItem(idx, "up")} className="text-[10px] text-gray-400 hover:text-primary-500">←</button>
                      )}
                      {idx < items.length - 1 && (
                        <button onClick={() => moveItem(idx, "down")} className="text-[10px] text-gray-400 hover:text-primary-500">→</button>
                      )}
                    </div>
                    {/* Order number */}
                    <div className="absolute -bottom-1 -left-1 w-4 h-4 bg-primary-500 text-white rounded-full flex items-center justify-center text-[8px] font-bold">
                      {idx + 1}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Pictogram Search */}
          <PictogramSearch onSelect={addPictogram} />
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-gray-100 flex gap-3 flex-shrink-0">
          <button onClick={onClose} className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50 transition">
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex-1 px-4 py-2.5 bg-primary-500 text-white rounded-xl text-sm font-medium hover:bg-primary-600 transition disabled:opacity-50"
          >
            {isSaving ? "Guardando..." : scheduleId ? "Actualizar" : "Guardar Agenda"}
          </button>
        </div>
      </div>
    </div>
  );
}

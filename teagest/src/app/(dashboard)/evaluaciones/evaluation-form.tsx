"use client";

import { useState } from "react";
import { trpc } from "@/lib/trpc";

interface EvaluationFormProps {
  studentId: string;
  type: string;
  onClose: () => void;
  onSaved: () => void;
}

// ADOS-2 domains
const ados2Domains = [
  { id: "communication", name: "Comunicación", maxScore: 8, items: ["Frecuencia de vocalizaciones", "Uso de palabras/frases", "Señalar", "Gestos descriptivos", "Contacto visual", "Expresiones faciales", "Disfrute compartido", "Solicitud"] },
  { id: "social_interaction", name: "Interacción Social Recíproca", maxScore: 14, items: ["Contacto visual inusual", "Expresiones dirigidas", "Disfrute en interacción", "Solicitudes", "Mostrar", "Inicio de atención conjunta", "Respuesta a atención conjunta", "Calidad de aberturas sociales"] },
  { id: "play", name: "Juego", maxScore: 5, items: ["Juego funcional con objetos", "Imaginación/creatividad", "Juego simbólico", "Juego interactivo", "Variedad de juego"] },
  { id: "restricted_behaviors", name: "Comportamientos Restringidos", maxScore: 8, items: ["Manierismos", "Intereses sensoriales inusuales", "Intereses restringidos", "Conductas repetitivas", "Autolesión", "Agresividad", "Ansiedad", "Hiperactividad"] },
];

// ADI-R areas
const adirDomains = [
  { id: "language_communication", name: "Lenguaje y Comunicación", items: ["Nivel de lenguaje", "Comprensión verbal", "Señalar para expresar interés", "Gestos convencionales", "Asentir/negar con cabeza", "Comunicación espontánea", "Conversación recíproca", "Habla repetitiva"] },
  { id: "social_development", name: "Desarrollo Social", items: ["Sonrisa social", "Contacto visual", "Expresiones faciales", "Compartir disfrute", "Ofrecer consuelo", "Calidad de amistades", "Juego imaginativo con pares", "Interés en niños"] },
  { id: "restricted_repetitive", name: "Conductas Restringidas y Repetitivas", items: ["Preocupaciones inusuales", "Rituales/compulsiones", "Manierismos de manos/dedos", "Intereses sensoriales inusuales", "Uso repetitivo de objetos", "Dificultad con cambios", "Resistencia a cambios triviales"] },
];

// Perfil Sensorial areas
const sensoryDomains = [
  { id: "auditory", name: "Procesamiento Auditivo", items: ["Respuesta a sonidos fuertes", "Filtrado auditivo", "Atención a sonidos", "Localización del sonido"] },
  { id: "visual", name: "Procesamiento Visual", items: ["Contacto visual", "Seguimiento visual", "Sensibilidad a la luz", "Discriminación visual"] },
  { id: "tactile", name: "Procesamiento Táctil", items: ["Respuesta al tacto ligero", "Tolerancia a texturas", "Conciencia corporal", "Presión profunda"] },
  { id: "vestibular", name: "Procesamiento Vestibular", items: ["Equilibrio", "Tolerancia al movimiento", "Búsqueda de movimiento", "Seguridad gravitacional"] },
  { id: "oral", name: "Procesamiento Oral", items: ["Texturas alimenticias", "Selectividad alimentaria", "Conciencia oral", "Exploración oral de objetos"] },
];

const scoreOptions = [
  { value: "0", label: "0 - Sin anomalía" },
  { value: "1", label: "1 - Leve/infrecuente" },
  { value: "2", label: "2 - Definida/frecuente" },
  { value: "3", label: "3 - Marcada/severa" },
];

const sensoryScoreOptions = [
  { value: "1", label: "Casi nunca" },
  { value: "2", label: "Rara vez" },
  { value: "3", label: "A veces" },
  { value: "4", label: "Frecuentemente" },
  { value: "5", label: "Casi siempre" },
];

export function EvaluationForm({ studentId, type, onClose, onSaved }: EvaluationFormProps) {
  const [scores, setScores] = useState<Record<string, Record<string, string>>>({});
  const [summary, setSummary] = useState("");
  const [classification, setClassification] = useState("");
  const [error, setError] = useState("");

  const createMutation = trpc.evaluations.create.useMutation({
    onSuccess: () => onSaved(),
    onError: (err) => setError(err.message || "Error al guardar"),
  });

  const domains = type === "ADOS_2" ? ados2Domains : type === "ADI_R" ? adirDomains : type === "SENSORY_PROFILE" ? sensoryDomains : [];
  const scoreOpts = type === "SENSORY_PROFILE" ? sensoryScoreOptions : scoreOptions;

  const typeLabels: Record<string, string> = {
    ADOS_2: "ADOS-2",
    ADI_R: "ADI-R",
    SENSORY_PROFILE: "Perfil Sensorial",
    VINELAND: "Vineland-3",
    OTHER: "Evaluación",
  };

  const setScore = (domainId: string, itemIdx: number, value: string) => {
    setScores((prev) => ({
      ...prev,
      [domainId]: { ...(prev[domainId] || {}), [itemIdx]: value },
    }));
  };

  const handleSubmit = () => {
    setError("");

    createMutation.mutate({
      studentId,
      type: type as any,
      date: new Date().toISOString().split("T")[0],
      data: { domains: scores, rawType: type },
      summary: summary || undefined,
      score: classification || undefined,
    });
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="p-5 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
        <div>
          <h3 className="text-[15px] font-semibold text-gray-900">{typeLabels[type] || "Evaluación"}</h3>
          <p className="text-[12px] text-gray-400 mt-0.5">Complete los ítems de cada dominio</p>
        </div>
        <div className="flex gap-2">
          <button onClick={onClose} className="px-4 py-2 border border-gray-200 text-gray-600 rounded-lg text-[13px] font-medium hover:bg-gray-50 transition">
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={createMutation.isPending}
            className="px-4 py-2 bg-brand-dark text-white rounded-lg text-[13px] font-medium hover:bg-brand-medium transition disabled:opacity-50"
          >
            {createMutation.isPending ? "Guardando..." : "Guardar Evaluación"}
          </button>
        </div>
      </div>

      {error && (
        <div className="mx-5 mt-4 p-3 bg-red-50 border border-red-100 rounded-lg text-[13px] text-red-600">{error}</div>
      )}

      {/* Domains */}
      <div className="p-5 space-y-6 max-h-[60vh] overflow-y-auto">
        {domains.map((domain) => (
          <div key={domain.id} className="border border-gray-100 rounded-xl overflow-hidden">
            <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
              <h4 className="text-[13px] font-semibold text-gray-800">{domain.name}</h4>
            </div>
            <div className="divide-y divide-gray-50">
              {domain.items.map((item, idx) => (
                <div key={idx} className="px-4 py-2.5 flex items-center justify-between gap-4">
                  <span className="text-[12px] text-gray-600 flex-1">{item}</span>
                  <select
                    value={scores[domain.id]?.[idx] || ""}
                    onChange={(e) => setScore(domain.id, idx, e.target.value)}
                    className="text-[11px] border border-gray-200 rounded-md px-2 py-1 bg-white focus:outline-none focus:ring-1 focus:ring-primary-400 w-44"
                  >
                    <option value="">Sin puntuar</option>
                    {scoreOpts.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* For OTHER or VINELAND - free text */}
        {(type === "OTHER" || type === "VINELAND") && (
          <div className="border border-gray-100 rounded-xl p-4">
            <label className="block text-[13px] font-medium text-gray-700 mb-2">Datos de la evaluación</label>
            <textarea
              rows={6}
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-primary-500/20 resize-none"
              placeholder="Registre los resultados, observaciones y datos relevantes de la evaluación..."
            />
          </div>
        )}

        {/* Classification / Score */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-[13px] font-medium text-gray-700 mb-1.5">Clasificación / Resultado</label>
            {type === "ADOS_2" ? (
              <select
                value={classification}
                onChange={(e) => setClassification(e.target.value)}
                className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-primary-500/20"
              >
                <option value="">Seleccionar...</option>
                <option value="Autismo">Autismo</option>
                <option value="Espectro Autista">Espectro Autista</option>
                <option value="No Espectro">No Espectro Autista</option>
              </select>
            ) : (
              <input
                type="text"
                value={classification}
                onChange={(e) => setClassification(e.target.value)}
                className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                placeholder="Ej: TEA Nivel 2, Rango atípico, etc."
              />
            )}
          </div>
          <div>
            <label className="block text-[13px] font-medium text-gray-700 mb-1.5">Resumen clínico</label>
            <textarea
              rows={3}
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-primary-500/20 resize-none"
              placeholder="Interpretación de resultados, recomendaciones..."
            />
          </div>
        </div>
      </div>
    </div>
  );
}

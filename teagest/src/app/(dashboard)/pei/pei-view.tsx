"use client";

import { useState } from "react";
import { AddObjectiveDialog } from "./add-objective-dialog";
import { ProgressDialog } from "./progress-dialog";

type PEIData = {
  id: string;
  startDate: Date;
  reviewDate: Date | null;
  status: string;
  notes: string | null;
  period: { name: string };
  objectives: {
    id: string;
    description: string;
    targetLevel: string;
    currentStatus: string;
    targetDate: Date | null;
    order: number;
    area: { id: string; name: string; icon: string | null };
    progress: {
      id: string;
      date: Date;
      levelAchieved: string;
      notes: string | null;
      registeredBy: { name: string };
    }[];
  }[];
};

const statusConfig: Record<string, { label: string; color: string; bgColor: string }> = {
  NOT_STARTED: { label: "No iniciado", color: "text-gray-600", bgColor: "bg-gray-100" },
  IN_PROGRESS: { label: "En proceso", color: "text-yellow-700", bgColor: "bg-yellow-100" },
  ACHIEVED_WITH_SUPPORT: { label: "Logrado con apoyo", color: "text-blue-700", bgColor: "bg-blue-100" },
  ACHIEVED_INDEPENDENT: { label: "Logrado independiente", color: "text-green-700", bgColor: "bg-green-100" },
};

function getStatusIcon(status: string) {
  switch (status) {
    case "ACHIEVED_INDEPENDENT":
    case "ACHIEVED_WITH_SUPPORT":
      return (
        <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
          <svg className="w-3.5 h-3.5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
      );
    case "IN_PROGRESS":
      return (
        <div className="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
          <div className="w-2 h-2 bg-yellow-500 rounded-full" />
        </div>
      );
    default:
      return (
        <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
          <div className="w-2 h-2 bg-gray-400 rounded-full" />
        </div>
      );
  }
}

export function PEIView({ pei, studentId, onUpdate }: { pei: PEIData; studentId: string; onUpdate: () => void }) {
  const [addObjectiveArea, setAddObjectiveArea] = useState<{ id: string; name: string } | null>(null);
  const [progressObjective, setProgressObjective] = useState<{ id: string; description: string } | null>(null);

  // Group objectives by area
  const objectivesByArea = pei.objectives.reduce((acc, obj) => {
    const areaId = obj.area.id;
    if (!acc[areaId]) {
      acc[areaId] = { area: obj.area, objectives: [] };
    }
    acc[areaId].objectives.push(obj);
    return acc;
  }, {} as Record<string, { area: typeof pei.objectives[0]["area"]; objectives: typeof pei.objectives }>);

  // Calculate stats
  const totalObjectives = pei.objectives.length;
  const achieved = pei.objectives.filter(
    (o) => o.currentStatus === "ACHIEVED_INDEPENDENT" || o.currentStatus === "ACHIEVED_WITH_SUPPORT"
  ).length;
  const inProgress = pei.objectives.filter((o) => o.currentStatus === "IN_PROGRESS").length;
  const notStarted = pei.objectives.filter((o) => o.currentStatus === "NOT_STARTED").length;

  return (
    <div className="space-y-6">
      {/* PEI Header */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-gray-800">PEI Activo</h3>
            <p className="text-sm text-gray-500">Período: {pei.period.name}</p>
          </div>
          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
            Activo
          </span>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-gray-50 rounded-lg p-3 text-center">
            <p className="text-xl font-bold text-gray-800">{totalObjectives}</p>
            <p className="text-xs text-gray-500">Objetivos</p>
          </div>
          <div className="bg-green-50 rounded-lg p-3 text-center">
            <p className="text-xl font-bold text-green-600">{achieved}</p>
            <p className="text-xs text-gray-500">Logrados</p>
          </div>
          <div className="bg-yellow-50 rounded-lg p-3 text-center">
            <p className="text-xl font-bold text-yellow-600">{inProgress}</p>
            <p className="text-xs text-gray-500">En proceso</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-3 text-center">
            <p className="text-xl font-bold text-gray-400">{notStarted}</p>
            <p className="text-xs text-gray-500">No iniciados</p>
          </div>
        </div>

        {/* Progress bar */}
        {totalObjectives > 0 && (
          <div className="mt-4">
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>Progreso general</span>
              <span>{totalObjectives > 0 ? Math.round((achieved / totalObjectives) * 100) : 0}%</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2.5">
              <div
                className="bg-green-500 h-2.5 rounded-full transition-all"
                style={{ width: `${totalObjectives > 0 ? (achieved / totalObjectives) * 100 : 0}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Objectives by Area */}
      {Object.values(objectivesByArea).map(({ area, objectives }) => {
        const areaAchieved = objectives.filter(
          (o) => o.currentStatus === "ACHIEVED_INDEPENDENT" || o.currentStatus === "ACHIEVED_WITH_SUPPORT"
        ).length;

        return (
          <div key={area.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            {/* Area Header */}
            <div className="p-4 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-xl">{area.icon || "📌"}</span>
                <div>
                  <h4 className="font-semibold text-gray-800">{area.name}</h4>
                  <p className="text-xs text-gray-500">
                    {objectives.length} objetivo{objectives.length !== 1 ? "s" : ""} · {areaAchieved} logrado{areaAchieved !== 1 ? "s" : ""}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-16 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: `${objectives.length > 0 ? (areaAchieved / objectives.length) * 100 : 0}%` }}
                    />
                  </div>
                  <span className="text-xs font-medium text-gray-600">
                    {objectives.length > 0 ? Math.round((areaAchieved / objectives.length) * 100) : 0}%
                  </span>
                </div>
                <button
                  onClick={() => setAddObjectiveArea({ id: area.id, name: area.name })}
                  className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                  title="Agregar objetivo"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Objectives */}
            <div className="divide-y divide-gray-100">
              {objectives.map((obj) => {
                const status = statusConfig[obj.currentStatus] || statusConfig.NOT_STARTED;
                return (
                  <div key={obj.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition">
                    <div className="flex items-center gap-3 flex-1">
                      {getStatusIcon(obj.currentStatus)}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800">{obj.description}</p>
                        {obj.targetDate && (
                          <p className="text-xs text-gray-500">
                            Meta: {new Date(obj.targetDate).toLocaleDateString("es", { month: "short", year: "numeric" })}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${status.bgColor} ${status.color}`}>
                        {status.label}
                      </span>
                      <button
                        onClick={() => setProgressObjective({ id: obj.id, description: obj.description })}
                        className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                        title="Registrar progreso"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* Empty objectives state */}
      {pei.objectives.length === 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
          <p className="text-gray-500 mb-3">Este PEI no tiene objetivos definidos aún</p>
          <p className="text-sm text-gray-400">Agrega objetivos organizados por área de desarrollo</p>
        </div>
      )}

      {/* Dialogs */}
      {addObjectiveArea && (
        <AddObjectiveDialog
          peiId={pei.id}
          area={addObjectiveArea}
          onClose={() => setAddObjectiveArea(null)}
          onCreated={() => {
            setAddObjectiveArea(null);
            onUpdate();
          }}
        />
      )}

      {progressObjective && (
        <ProgressDialog
          objective={progressObjective}
          onClose={() => setProgressObjective(null)}
          onSaved={() => {
            setProgressObjective(null);
            onUpdate();
          }}
        />
      )}
    </div>
  );
}

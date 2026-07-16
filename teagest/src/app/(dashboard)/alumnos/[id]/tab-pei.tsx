"use client";

import { trpc } from "@/lib/trpc";

const statusConfig: Record<string, { label: string; color: string; bgColor: string }> = {
  NOT_STARTED: { label: "No iniciado", color: "text-gray-600", bgColor: "bg-gray-100" },
  IN_PROGRESS: { label: "En proceso", color: "text-yellow-700", bgColor: "bg-yellow-100" },
  ACHIEVED_WITH_SUPPORT: { label: "Logrado con apoyo", color: "text-blue-700", bgColor: "bg-blue-100" },
  ACHIEVED_INDEPENDENT: { label: "Logrado independiente", color: "text-green-700", bgColor: "bg-green-100" },
};

export function TabPEI({ studentId }: { studentId: string }) {
  const { data: pei, isLoading } = trpc.pei.getByStudent.useQuery({ studentId });

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6 animate-pulse">
        <div className="h-5 bg-gray-200 rounded w-40 mb-4" />
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 rounded w-full" />
          <div className="h-4 bg-gray-200 rounded w-3/4" />
        </div>
      </div>
    );
  }

  if (!pei) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
        <p className="text-gray-500">No hay un PEI activo para este alumno.</p>
        <p className="text-sm text-gray-400 mt-1">Ve al módulo PEI para crear uno.</p>
      </div>
    );
  }

  // Group by area
  const byArea = pei.objectives.reduce((acc, obj) => {
    const areaId = obj.area.id;
    if (!acc[areaId]) acc[areaId] = { area: obj.area, objectives: [] };
    acc[areaId].objectives.push(obj);
    return acc;
  }, {} as Record<string, { area: any; objectives: typeof pei.objectives }>);

  const totalObj = pei.objectives.length;
  const achieved = pei.objectives.filter(
    (o) => o.currentStatus === "ACHIEVED_INDEPENDENT" || o.currentStatus === "ACHIEVED_WITH_SUPPORT"
  ).length;

  return (
    <div className="space-y-4">
      {/* Summary */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="font-semibold text-gray-800">PEI — {pei.period.name}</h3>
            <p className="text-xs text-gray-500 mt-0.5">{totalObj} objetivos · {achieved} logrados</p>
          </div>
          <span className="text-sm font-bold text-green-600">
            {totalObj > 0 ? Math.round((achieved / totalObj) * 100) : 0}%
          </span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-2.5">
          <div
            className="bg-green-500 h-2.5 rounded-full transition-all"
            style={{ width: `${totalObj > 0 ? (achieved / totalObj) * 100 : 0}%` }}
          />
        </div>
      </div>

      {/* Areas */}
      {Object.values(byArea).map(({ area, objectives }) => (
        <div key={area.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-4 py-3 bg-gray-50 border-b border-gray-100 flex items-center gap-2">
            <span>{area.icon || "📌"}</span>
            <span className="font-medium text-gray-800 text-sm">{area.name}</span>
            <span className="text-xs text-gray-400 ml-auto">{objectives.length} obj.</span>
          </div>
          <div className="divide-y divide-gray-50">
            {objectives.map((obj) => {
              const status = statusConfig[obj.currentStatus] || statusConfig.NOT_STARTED;
              return (
                <div key={obj.id} className="px-4 py-3 flex items-center justify-between">
                  <p className="text-sm text-gray-700 flex-1">{obj.description}</p>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ml-3 whitespace-nowrap ${status.bgColor} ${status.color}`}>
                    {status.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

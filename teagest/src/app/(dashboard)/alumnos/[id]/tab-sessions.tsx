"use client";

import { trpc } from "@/lib/trpc";

export function TabSessions({ studentId }: { studentId: string }) {
  // We'll use a simple query for now - sessions router will be built in next phase
  // For now show placeholder with info
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
      <div className="w-14 h-14 bg-yellow-50 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg className="w-7 h-7 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-gray-800 mb-2">Historial de Sesiones</h3>
      <p className="text-gray-500 text-sm">El registro de sesiones estará disponible próximamente.</p>
      <p className="text-gray-400 text-xs mt-2">Ve al módulo Sesiones para registrar nuevas sesiones con este alumno.</p>
    </div>
  );
}

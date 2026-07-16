"use client";

import { useState } from "react";
import { Header } from "@/components/header";
import { trpc } from "@/lib/trpc";
import { PEIView } from "./pei-view";
import { CreatePEIDialog } from "./create-pei-dialog";

export default function PEIPage() {
  const [selectedStudentId, setSelectedStudentId] = useState<string>("");
  const [showCreatePEI, setShowCreatePEI] = useState(false);

  const { data: students } = trpc.students.list.useQuery({});

  const { data: pei, isLoading: peiLoading, refetch: refetchPEI } = trpc.pei.getByStudent.useQuery(
    { studentId: selectedStudentId },
    { enabled: !!selectedStudentId }
  );

  return (
    <>
      <Header title="Plan Educativo Individualizado" subtitle="Gestión de PEI y objetivos" />
      <div className="p-6 space-y-6">
        {/* Student selector */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <label className="text-sm font-medium text-gray-700">Alumno:</label>
            <select
              value={selectedStudentId}
              onChange={(e) => setSelectedStudentId(e.target.value)}
              className="border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[250px]"
            >
              <option value="">Seleccionar alumno...</option>
              {students?.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.firstName} {s.lastName} — {s.group?.name?.split(" (")[0] || "Sin grupo"}
                </option>
              ))}
            </select>
          </div>

          {selectedStudentId && (
            <button
              onClick={() => setShowCreatePEI(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Nuevo PEI
            </button>
          )}
        </div>

        {/* Empty state - no student selected */}
        {!selectedStudentId && (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Plan Educativo Individualizado</h3>
            <p className="text-gray-500">Selecciona un alumno para ver o crear su PEI</p>
          </div>
        )}

        {/* Loading */}
        {selectedStudentId && peiLoading && (
          <div className="bg-white rounded-xl border border-gray-200 p-8 animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-48 mb-4" />
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded w-full" />
              <div className="h-4 bg-gray-200 rounded w-3/4" />
              <div className="h-4 bg-gray-200 rounded w-1/2" />
            </div>
          </div>
        )}

        {/* No PEI for this student */}
        {selectedStudentId && !peiLoading && !pei && (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <div className="w-16 h-16 bg-yellow-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Sin PEI activo</h3>
            <p className="text-gray-500 mb-4">Este alumno no tiene un Plan Educativo activo</p>
            <button
              onClick={() => setShowCreatePEI(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition"
            >
              Crear PEI
            </button>
          </div>
        )}

        {/* PEI View */}
        {selectedStudentId && !peiLoading && pei && (
          <PEIView pei={pei} studentId={selectedStudentId} onUpdate={refetchPEI} />
        )}
      </div>

      {/* Create PEI Dialog */}
      {showCreatePEI && (
        <CreatePEIDialog
          studentId={selectedStudentId}
          onClose={() => setShowCreatePEI(false)}
          onCreated={() => {
            setShowCreatePEI(false);
            refetchPEI();
          }}
        />
      )}
    </>
  );
}

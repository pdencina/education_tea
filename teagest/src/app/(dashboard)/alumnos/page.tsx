"use client";

import { useState } from "react";
import { Header } from "@/components/header";
import { trpc } from "@/lib/trpc";
import { StudentCard } from "./student-card";
import { CreateStudentDialog } from "./create-student-dialog";

export default function AlumnosPage() {
  const [groupFilter, setGroupFilter] = useState<string>("");
  const [levelFilter, setLevelFilter] = useState<string>("");
  const [search, setSearch] = useState("");
  const [showCreate, setShowCreate] = useState(false);

  const { data: students, isLoading, refetch } = trpc.students.list.useQuery({
    groupId: groupFilter || undefined,
    supportLevel: (levelFilter as any) || undefined,
    search: search || undefined,
  });

  const { data: groups } = trpc.groups.list.useQuery();

  return (
    <>
      <Header title="Alumnos" subtitle="Gestión de expedientes" />
      <div className="p-6 space-y-6">
        {/* Filters */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex gap-3 flex-wrap">
            <input
              type="text"
              placeholder="Buscar por nombre..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 w-52"
            />
            <select
              value={groupFilter}
              onChange={(e) => setGroupFilter(e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600 bg-white"
            >
              <option value="">Todos los grupos</option>
              {groups?.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name} ({g._count.students})
                </option>
              ))}
            </select>
            <select
              value={levelFilter}
              onChange={(e) => setLevelFilter(e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600 bg-white"
            >
              <option value="">Todos los niveles</option>
              <option value="LEVEL_1">Nivel 1</option>
              <option value="LEVEL_2">Nivel 2</option>
              <option value="LEVEL_3">Nivel 3</option>
            </select>
          </div>
          <button
            onClick={() => setShowCreate(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Nuevo Alumno
          </button>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-200 p-5 animate-pulse">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gray-200 rounded-full" />
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-32" />
                    <div className="h-3 bg-gray-200 rounded w-24" />
                  </div>
                </div>
                <div className="mt-4 h-2 bg-gray-200 rounded w-full" />
              </div>
            ))}
          </div>
        )}

        {/* Student Cards */}
        {!isLoading && students && (
          <>
            <p className="text-sm text-gray-500">
              {students.length} alumno{students.length !== 1 ? "s" : ""} encontrado{students.length !== 1 ? "s" : ""}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {students.map((student) => (
                <StudentCard key={student.id} student={student} />
              ))}
            </div>
            {students.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <p className="text-gray-500">No se encontraron alumnos con los filtros aplicados</p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Create Student Dialog */}
      {showCreate && (
        <CreateStudentDialog
          groups={groups || []}
          onClose={() => setShowCreate(false)}
          onCreated={() => {
            setShowCreate(false);
            refetch();
          }}
        />
      )}
    </>
  );
}

"use client";

import { useState } from "react";
import { Header } from "@/components/header";
import { trpc } from "@/lib/trpc";
import { StaffDetail } from "./staff-detail";
import { AssignDialog } from "./assign-dialog";

const roleLabels: Record<string, string> = {
  ADMIN: "Administrador",
  COORDINATOR: "Coordinador/a",
  TEACHER: "Docente",
  SPECIALIST: "Especialista",
};

const roleColors: Record<string, string> = {
  ADMIN: "bg-purple-100 text-purple-700",
  COORDINATOR: "bg-blue-100 text-blue-700",
  TEACHER: "bg-green-100 text-green-700",
  SPECIALIST: "bg-orange-100 text-orange-700",
};

const avatarGradients = [
  "from-primary-400 to-tea-pink",
  "from-blue-400 to-teal-400",
  "from-orange-400 to-pink-400",
  "from-green-400 to-teal-400",
  "from-purple-400 to-blue-400",
  "from-pink-400 to-orange-400",
];

export default function EquipoPage() {
  const [selectedStaffId, setSelectedStaffId] = useState<string>("");
  const [showAssign, setShowAssign] = useState<string>("");

  const { data: staff, isLoading, refetch } = trpc.staff.list.useQuery();

  return (
    <>
      <Header title="Equipo" subtitle="Equipo multidisciplinario del centro" />
      <div className="p-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
            <p className="text-sm text-gray-400">Total profesionales</p>
            <p className="text-2xl font-bold text-gray-800 mt-1">{staff?.length ?? 0}</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
            <p className="text-sm text-gray-400">Docentes</p>
            <p className="text-2xl font-bold text-green-600 mt-1">
              {staff?.filter((s) => s.role === "TEACHER").length ?? 0}
            </p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
            <p className="text-sm text-gray-400">Especialistas</p>
            <p className="text-2xl font-bold text-orange-600 mt-1">
              {staff?.filter((s) => s.role === "SPECIALIST").length ?? 0}
            </p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
            <p className="text-sm text-gray-400">Coordinadores</p>
            <p className="text-2xl font-bold text-blue-600 mt-1">
              {staff?.filter((s) => s.role === "COORDINATOR" || s.role === "ADMIN").length ?? 0}
            </p>
          </div>
        </div>

        {/* Staff grid */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 animate-pulse">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gray-200 rounded-full" />
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-32" />
                    <div className="h-3 bg-gray-200 rounded w-24" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!isLoading && staff && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {staff.map((member, idx) => {
              const roleColor = roleColors[member.role] || "bg-gray-100 text-gray-700";
              const gradient = avatarGradients[idx % avatarGradients.length];
              const initials = member.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

              return (
                <div
                  key={member.id}
                  className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition cursor-pointer group"
                  onClick={() => setSelectedStaffId(member.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 bg-gradient-to-br ${gradient} rounded-full flex items-center justify-center shadow-sm`}>
                        <span className="text-sm font-semibold text-white">{initials}</span>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-800 group-hover:text-primary-600 transition-colors">
                          {member.name}
                        </h4>
                        <p className="text-xs text-gray-400">{member.specialty || member.email}</p>
                      </div>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${roleColor}`}>
                      {roleLabels[member.role] || member.role}
                    </span>
                  </div>

                  {/* Stats */}
                  <div className="mt-4 flex items-center gap-4 text-xs text-gray-400">
                    <div className="flex items-center gap-1">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span>{member._count.assignments} alumnos</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span>{member._count.sessions} sesiones</span>
                    </div>
                  </div>

                  {/* Assigned students preview */}
                  {member.assignments.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-gray-50">
                      <div className="flex -space-x-2">
                        {member.assignments.slice(0, 5).map((a, i) => (
                          <div
                            key={i}
                            className="w-7 h-7 bg-gray-100 rounded-full border-2 border-white flex items-center justify-center"
                            title={`${a.student.firstName} ${a.student.lastName}`}
                          >
                            <span className="text-[9px] font-medium text-gray-500">
                              {a.student.firstName[0]}{a.student.lastName[0]}
                            </span>
                          </div>
                        ))}
                        {member.assignments.length > 5 && (
                          <div className="w-7 h-7 bg-gray-50 rounded-full border-2 border-white flex items-center justify-center">
                            <span className="text-[9px] font-medium text-gray-400">+{member.assignments.length - 5}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Staff detail modal */}
      {selectedStaffId && (
        <StaffDetail
          staffId={selectedStaffId}
          onClose={() => setSelectedStaffId("")}
          onAssign={() => setShowAssign(selectedStaffId)}
          onRefetch={refetch}
        />
      )}

      {/* Assign dialog */}
      {showAssign && (
        <AssignDialog
          staffId={showAssign}
          onClose={() => setShowAssign("")}
          onAssigned={() => {
            setShowAssign("");
            refetch();
          }}
        />
      )}
    </>
  );
}

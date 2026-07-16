"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { trpc } from "@/lib/trpc";
import { Header } from "@/components/header";
import { TabInfo } from "./tab-info";
import { TabPEI } from "./tab-pei";
import { TabSessions } from "./tab-sessions";
import { TabTeam } from "./tab-team";

const tabs = [
  { id: "info", label: "Información", icon: "📋" },
  { id: "pei", label: "PEI", icon: "🎯" },
  { id: "sessions", label: "Sesiones", icon: "📅" },
  { id: "team", label: "Equipo", icon: "👥" },
];

export default function StudentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const studentId = params.id as string;
  const [activeTab, setActiveTab] = useState("info");

  const { data: student, isLoading } = trpc.students.getById.useQuery(
    { id: studentId },
    { enabled: !!studentId }
  );

  if (isLoading) {
    return (
      <>
        <Header title="Cargando..." subtitle="Expediente del alumno" />
        <div className="p-6">
          <div className="bg-white rounded-xl border border-gray-200 p-8 animate-pulse">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gray-200 rounded-full" />
              <div className="space-y-2">
                <div className="h-5 bg-gray-200 rounded w-48" />
                <div className="h-4 bg-gray-200 rounded w-32" />
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (!student) {
    return (
      <>
        <Header title="Alumno no encontrado" />
        <div className="p-6">
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <p className="text-gray-500 mb-4">Este alumno no existe o no tienes acceso.</p>
            <button
              onClick={() => router.push("/alumnos")}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition"
            >
              Volver a Alumnos
            </button>
          </div>
        </div>
      </>
    );
  }

  const levelConfig: Record<string, { label: string; color: string }> = {
    LEVEL_1: { label: "Nivel 1", color: "bg-blue-100 text-blue-700" },
    LEVEL_2: { label: "Nivel 2", color: "bg-yellow-100 text-yellow-700" },
    LEVEL_3: { label: "Nivel 3", color: "bg-red-100 text-red-700" },
  };

  const level = levelConfig[student.supportLevel] || levelConfig.LEVEL_1;
  const age = Math.floor((Date.now() - new Date(student.birthDate).getTime()) / (365.25 * 24 * 60 * 60 * 1000));
  const initials = `${student.firstName[0]}${student.lastName[0]}`.toUpperCase();

  return (
    <>
      <Header
        title={`${student.firstName} ${student.lastName}`}
        subtitle="Expediente del alumno"
      />
      <div className="p-6 space-y-6">
        {/* Student Header Card */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xl">{initials}</span>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-800">
                  {student.firstName} {student.lastName}
                </h2>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-sm text-gray-500">{age} años</span>
                  <span className="text-gray-300">·</span>
                  <span className="text-sm text-gray-500">{student.group?.name || "Sin grupo"}</span>
                  <span className="text-gray-300">·</span>
                  <span className="text-sm text-gray-500 font-mono">{student.code}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${level.color}`}>
                {level.label}
              </span>
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                Activo
              </span>
            </div>
          </div>

          {student.diagnosis && (
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-xs font-medium text-gray-500 uppercase mb-1">Diagnóstico</p>
              <p className="text-sm text-gray-700">{student.diagnosis}</p>
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <div className="flex gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2.5 text-sm font-medium rounded-t-lg transition-colors ${
                  activeTab === tab.id
                    ? "bg-white border border-gray-200 border-b-white text-blue-600 -mb-px"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                }`}
              >
                <span className="mr-1.5">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === "info" && <TabInfo student={student} />}
        {activeTab === "pei" && <TabPEI studentId={studentId} />}
        {activeTab === "sessions" && <TabSessions studentId={studentId} />}
        {activeTab === "team" && <TabTeam student={student} />}
      </div>
    </>
  );
}

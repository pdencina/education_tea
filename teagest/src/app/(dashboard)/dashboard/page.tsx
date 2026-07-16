"use client";

import { Header } from "@/components/header";
import { trpc } from "@/lib/trpc";

export default function DashboardPage() {
  const { data: students } = trpc.students.list.useQuery({});
  const { data: sessionStats } = trpc.sessions.stats.useQuery();

  const totalStudents = students?.length ?? 0;
  const level1 = students?.filter((s) => s.supportLevel === "LEVEL_1").length ?? 0;
  const level2 = students?.filter((s) => s.supportLevel === "LEVEL_2").length ?? 0;
  const level3 = students?.filter((s) => s.supportLevel === "LEVEL_3").length ?? 0;

  return (
    <>
      <Header title="Dashboard" subtitle="Resumen del centro" />
      <div className="p-6 space-y-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Alumnos Activos</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">{totalStudents}</p>
              </div>
              <div className="w-11 h-11 bg-pastel-purple rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Sesiones esta Semana</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">{sessionStats?.thisWeek ?? 0}</p>
              </div>
              <div className="w-11 h-11 bg-pastel-teal rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Total Sesiones</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">{sessionStats?.total ?? 0}</p>
              </div>
              <div className="w-11 h-11 bg-pastel-yellow rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Nivel de Apoyo</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full">{level1}</span>
                  <span className="text-xs px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded-full">{level2}</span>
                  <span className="text-xs px-2 py-0.5 bg-red-100 text-red-700 rounded-full">{level3}</span>
                </div>
              </div>
              <div className="w-11 h-11 bg-pastel-pink rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Quick actions */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <h3 className="font-semibold text-gray-800 mb-4">Acciones rápidas</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <a href="/alumnos" className="flex flex-col items-center gap-2 p-4 rounded-xl bg-pastel-purple/50 hover:bg-pastel-purple transition-colors">
              <span className="text-2xl">👤</span>
              <span className="text-xs font-medium text-gray-700">Nuevo Alumno</span>
            </a>
            <a href="/pei" className="flex flex-col items-center gap-2 p-4 rounded-xl bg-pastel-teal/50 hover:bg-pastel-teal transition-colors">
              <span className="text-2xl">🎯</span>
              <span className="text-xs font-medium text-gray-700">Gestionar PEI</span>
            </a>
            <a href="/sesiones" className="flex flex-col items-center gap-2 p-4 rounded-xl bg-pastel-yellow/50 hover:bg-pastel-yellow transition-colors">
              <span className="text-2xl">📝</span>
              <span className="text-xs font-medium text-gray-700">Registrar Sesión</span>
            </a>
            <a href="/reportes" className="flex flex-col items-center gap-2 p-4 rounded-xl bg-pastel-pink/50 hover:bg-pastel-pink transition-colors">
              <span className="text-2xl">📊</span>
              <span className="text-xs font-medium text-gray-700">Ver Reportes</span>
            </a>
          </div>
        </div>

        {/* Recent students */}
        {students && students.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <h3 className="font-semibold text-gray-800 mb-4">Alumnos recientes</h3>
            <div className="space-y-3">
              {students.slice(0, 5).map((s) => (
                <a
                  key={s.id}
                  href={`/alumnos/${s.id}`}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-gradient-to-br from-primary-400 to-tea-pink rounded-full flex items-center justify-center">
                      <span className="text-xs font-semibold text-white">
                        {s.firstName[0]}{s.lastName[0]}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">{s.firstName} {s.lastName}</p>
                      <p className="text-xs text-gray-400">{s.group?.name || "Sin grupo"}</p>
                    </div>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    s.supportLevel === "LEVEL_1" ? "bg-blue-100 text-blue-700" :
                    s.supportLevel === "LEVEL_2" ? "bg-yellow-100 text-yellow-700" :
                    "bg-red-100 text-red-700"
                  }`}>
                    {s.supportLevel === "LEVEL_1" ? "Nivel 1" : s.supportLevel === "LEVEL_2" ? "Nivel 2" : "Nivel 3"}
                  </span>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

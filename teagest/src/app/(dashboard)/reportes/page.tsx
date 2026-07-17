"use client";

import { useState } from "react";
import { Header } from "@/components/header";
import { trpc } from "@/lib/trpc";
import { StudentReportView } from "./student-report";

export default function ReportesPage() {
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [showReport, setShowReport] = useState(false);

  const { data: stats, isLoading: statsLoading } = trpc.reports.dashboardStats.useQuery();
  const { data: byLevel } = trpc.reports.studentsByLevel.useQuery();
  const { data: byArea } = trpc.reports.objectivesByArea.useQuery();
  const { data: sessionsWeek } = trpc.reports.sessionsPerWeek.useQuery();
  const { data: students } = trpc.students.list.useQuery({});

  return (
    <>
      <Header title="Reportes" subtitle="Indicadores y reportes del centro" />
      <div className="p-6 space-y-6">
        {/* KPI Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <KPICard label="Alumnos Activos" value={stats?.totalStudents ?? "—"} icon="👤" color="bg-pastel-purple" />
          <KPICard label="Profesionales" value={stats?.totalStaff ?? "—"} icon="👥" color="bg-pastel-teal" />
          <KPICard label="Sesiones Totales" value={stats?.totalSessions ?? "—"} icon="📅" color="bg-pastel-yellow" />
          <KPICard label="% Objetivos Logrados" value={stats ? `${stats.achievementRate}%` : "—"} icon="🎯" color="bg-pastel-green" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Objectives by Area */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <h3 className="font-semibold text-gray-800 mb-4">Progreso por Área de Desarrollo</h3>
            {byArea && byArea.length > 0 ? (
              <div className="space-y-3">
                {byArea.map((area) => (
                  <div key={area.name}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">
                        {area.icon || "📌"} {area.name}
                      </span>
                      <span className="font-medium text-gray-800">{area.percentage}%</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2.5">
                      <div
                        className="bg-primary-500 h-2.5 rounded-full transition-all"
                        style={{ width: `${area.percentage}%` }}
                      />
                    </div>
                    <div className="flex gap-3 mt-1 text-[10px] text-gray-400">
                      <span>Logrados: {area.achieved}</span>
                      <span>En proceso: {area.inProgress}</span>
                      <span>Sin iniciar: {area.notStarted}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400 text-center py-4">No hay objetivos registrados</p>
            )}
          </div>

          {/* Sessions per week chart */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <h3 className="font-semibold text-gray-800 mb-4">Sesiones por Semana</h3>
            {sessionsWeek && sessionsWeek.length > 0 ? (
              <div className="flex items-end gap-2 h-40">
                {sessionsWeek.map((week, idx) => {
                  const maxCount = Math.max(...sessionsWeek.map((w) => w.count), 1);
                  const height = (week.count / maxCount) * 100;
                  return (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-1">
                      <span className="text-[10px] text-gray-500 font-medium">{week.count}</span>
                      <div
                        className="w-full bg-gradient-to-t from-primary-500 to-primary-300 rounded-t-lg transition-all min-h-[4px]"
                        style={{ height: `${Math.max(height, 3)}%` }}
                      />
                      <span className="text-[9px] text-gray-400 whitespace-nowrap">{week.label}</span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-gray-400 text-center py-4">No hay datos de sesiones</p>
            )}
          </div>

          {/* Students by level */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <h3 className="font-semibold text-gray-800 mb-4">Alumnos por Nivel de Apoyo</h3>
            {byLevel ? (
              <div className="space-y-3">
                <LevelBar label="Nivel 1 — Requiere apoyo" count={byLevel.level1} total={stats?.totalStudents || 1} color="bg-blue-400" />
                <LevelBar label="Nivel 2 — Apoyo sustancial" count={byLevel.level2} total={stats?.totalStudents || 1} color="bg-yellow-400" />
                <LevelBar label="Nivel 3 — Apoyo muy sustancial" count={byLevel.level3} total={stats?.totalStudents || 1} color="bg-red-400" />
              </div>
            ) : (
              <p className="text-sm text-gray-400 text-center py-4">Sin datos</p>
            )}
          </div>

          {/* Generate PDF report */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <h3 className="font-semibold text-gray-800 mb-2">Reporte de Progreso por Alumno</h3>
            <p className="text-sm text-gray-400 mb-4">Genera un reporte completo con objetivos, sesiones y progreso</p>

            <div className="space-y-3">
              <select
                value={selectedStudentId}
                onChange={(e) => setSelectedStudentId(e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 focus:bg-white transition"
              >
                <option value="">Seleccionar alumno...</option>
                {students?.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.firstName} {s.lastName}
                  </option>
                ))}
              </select>

              <button
                onClick={() => setShowReport(true)}
                disabled={!selectedStudentId}
                className="w-full px-4 py-2.5 bg-primary-500 text-white rounded-xl text-sm font-medium hover:bg-primary-600 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Generar Reporte
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Student Report Modal */}
      {showReport && selectedStudentId && (
        <StudentReportView
          studentId={selectedStudentId}
          onClose={() => setShowReport(false)}
        />
      )}
    </>
  );
}

function KPICard({ label, value, icon, color }: { label: string; value: string | number; icon: string; color: string }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-gray-400">{label}</p>
          <p className="text-2xl font-bold text-gray-800 mt-1">{value}</p>
        </div>
        <div className={`w-10 h-10 ${color} rounded-xl flex items-center justify-center`}>
          <span className="text-base">{icon}</span>
        </div>
      </div>
    </div>
  );
}

function LevelBar({ label, count, total, color }: { label: string; count: number; total: number; color: string }) {
  const percentage = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="text-gray-600">{label}</span>
        <span className="font-medium text-gray-800">{count} ({percentage}%)</span>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-2.5">
        <div className={`${color} h-2.5 rounded-full transition-all`} style={{ width: `${percentage}%` }} />
      </div>
    </div>
  );
}

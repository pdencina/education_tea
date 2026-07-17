"use client";

import { useRef } from "react";
import { trpc } from "@/lib/trpc";

const statusLabels: Record<string, string> = {
  NOT_STARTED: "No iniciado",
  IN_PROGRESS: "En proceso",
  ACHIEVED_WITH_SUPPORT: "Logrado con apoyo",
  ACHIEVED_INDEPENDENT: "Logrado independiente",
};

const sessionTypeLabels: Record<string, string> = {
  INDIVIDUAL: "Individual",
  GROUP: "Grupal",
  OCCUPATIONAL_THERAPY: "Terapia Ocupacional",
  SPEECH_THERAPY: "Fonoaudiología",
  PSYCHOLOGY: "Psicología",
  OTHER: "Otro",
};

interface StudentReportViewProps {
  studentId: string;
  onClose: () => void;
}

export function StudentReportView({ studentId, onClose }: StudentReportViewProps) {
  const reportRef = useRef<HTMLDivElement>(null);
  const { data: report, isLoading } = trpc.reports.studentReport.useQuery({ studentId });

  const handlePrint = () => {
    const content = reportRef.current;
    if (!content) return;

    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Reporte - ${report?.student.firstName} ${report?.student.lastName}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: 'Segoe UI', Arial, sans-serif; font-size: 12px; color: #333; padding: 20px; }
          h1 { font-size: 20px; color: #7c3aed; margin-bottom: 4px; }
          h2 { font-size: 14px; color: #555; margin: 16px 0 8px; padding-bottom: 4px; border-bottom: 1px solid #eee; }
          h3 { font-size: 12px; color: #666; margin: 12px 0 6px; }
          .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px; padding-bottom: 12px; border-bottom: 2px solid #7c3aed; }
          .stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; margin: 12px 0; }
          .stat { text-align: center; padding: 8px; background: #f9fafb; border-radius: 6px; }
          .stat-value { font-size: 18px; font-weight: bold; color: #7c3aed; }
          .stat-label { font-size: 10px; color: #888; }
          .objective { padding: 6px 0; border-bottom: 1px solid #f3f4f6; display: flex; justify-content: space-between; align-items: center; }
          .badge { padding: 2px 8px; border-radius: 10px; font-size: 10px; font-weight: 500; }
          .badge-green { background: #dcfce7; color: #166534; }
          .badge-yellow { background: #fef3c7; color: #92400e; }
          .badge-gray { background: #f3f4f6; color: #6b7280; }
          .session { padding: 4px 0; font-size: 11px; color: #555; }
          .footer { margin-top: 30px; padding-top: 12px; border-top: 1px solid #eee; font-size: 10px; color: #999; text-align: center; }
          @media print { body { padding: 0; } }
        </style>
      </head>
      <body>
        ${content.innerHTML}
      </body>
      </html>
    `);
    printWindow.document.close();
    setTimeout(() => printWindow.print(), 500);
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative bg-white rounded-2xl p-8 animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-48" />
        </div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="absolute inset-0 bg-black/50" onClick={onClose} />
        <div className="relative bg-white rounded-2xl p-8 text-center">
          <p className="text-gray-500">No se encontraron datos para este alumno.</p>
          <button onClick={onClose} className="mt-4 px-4 py-2 bg-primary-500 text-white rounded-xl text-sm">Cerrar</button>
        </div>
      </div>
    );
  }

  const { student, pei, recentSessions, stats } = report;

  // Group objectives by area
  const objectivesByArea = pei?.objectives.reduce((acc, obj) => {
    const areaName = obj.area.name;
    if (!acc[areaName]) acc[areaName] = { icon: obj.area.icon, objectives: [] };
    acc[areaName].objectives.push(obj);
    return acc;
  }, {} as Record<string, { icon: string | null; objectives: typeof pei.objectives }>) || {};

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-xl max-w-3xl w-full mx-4 max-h-[90vh] overflow-hidden flex flex-col">
        {/* Actions bar */}
        <div className="p-4 border-b border-gray-100 flex items-center justify-between flex-shrink-0">
          <h3 className="font-semibold text-gray-800">Reporte de Progreso</h3>
          <div className="flex gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-primary-500 text-white rounded-xl text-sm font-medium hover:bg-primary-600 transition flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              Imprimir / PDF
            </button>
            <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Report content (printable) */}
        <div className="flex-1 overflow-y-auto p-6" ref={reportRef}>
          {/* Header */}
          <div className="header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px", paddingBottom: "12px", borderBottom: "2px solid #7c3aed" }}>
            <div>
              <h1 style={{ fontSize: "20px", color: "#7c3aed", marginBottom: "4px" }}>
                Reporte de Progreso
              </h1>
              <p style={{ fontSize: "14px", color: "#666" }}>
                {student.firstName} {student.lastName} — {student.code}
              </p>
              <p style={{ fontSize: "11px", color: "#999", marginTop: "4px" }}>
                {student.group?.name || "Sin grupo"} · Nivel de apoyo: {student.supportLevel.replace("LEVEL_", "")}
              </p>
            </div>
            <div style={{ textAlign: "right", fontSize: "11px", color: "#999" }}>
              <p>Fecha: {new Date().toLocaleDateString("es", { day: "numeric", month: "long", year: "numeric" })}</p>
              {pei && <p>Período: {pei.period.name}</p>}
            </div>
          </div>

          {/* Stats */}
          {pei && (
            <>
              <h2 style={{ fontSize: "14px", color: "#555", margin: "16px 0 8px", paddingBottom: "4px", borderBottom: "1px solid #eee" }}>
                Resumen del PEI
              </h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "8px", margin: "12px 0" }}>
                <div style={{ textAlign: "center", padding: "8px", background: "#f9fafb", borderRadius: "6px" }}>
                  <div style={{ fontSize: "18px", fontWeight: "bold", color: "#7c3aed" }}>{stats.totalObjectives}</div>
                  <div style={{ fontSize: "10px", color: "#888" }}>Total</div>
                </div>
                <div style={{ textAlign: "center", padding: "8px", background: "#dcfce7", borderRadius: "6px" }}>
                  <div style={{ fontSize: "18px", fontWeight: "bold", color: "#166534" }}>{stats.achieved}</div>
                  <div style={{ fontSize: "10px", color: "#888" }}>Logrados</div>
                </div>
                <div style={{ textAlign: "center", padding: "8px", background: "#fef3c7", borderRadius: "6px" }}>
                  <div style={{ fontSize: "18px", fontWeight: "bold", color: "#92400e" }}>{stats.inProgress}</div>
                  <div style={{ fontSize: "10px", color: "#888" }}>En proceso</div>
                </div>
                <div style={{ textAlign: "center", padding: "8px", background: "#f3f4f6", borderRadius: "6px" }}>
                  <div style={{ fontSize: "18px", fontWeight: "bold", color: "#6b7280" }}>{stats.notStarted}</div>
                  <div style={{ fontSize: "10px", color: "#888" }}>Sin iniciar</div>
                </div>
              </div>

              {/* Objectives by area */}
              <h2 style={{ fontSize: "14px", color: "#555", margin: "16px 0 8px", paddingBottom: "4px", borderBottom: "1px solid #eee" }}>
                Objetivos por Área
              </h2>
              {Object.entries(objectivesByArea).map(([areaName, { icon, objectives }]) => (
                <div key={areaName} style={{ marginBottom: "12px" }}>
                  <h3 style={{ fontSize: "12px", color: "#666", margin: "8px 0 6px" }}>
                    {icon || "📌"} {areaName}
                  </h3>
                  {objectives.map((obj) => (
                    <div key={obj.id} style={{ padding: "5px 0", borderBottom: "1px solid #f3f4f6", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: "11px", color: "#444", flex: 1 }}>{obj.description}</span>
                      <span style={{
                        padding: "2px 8px",
                        borderRadius: "10px",
                        fontSize: "10px",
                        fontWeight: 500,
                        marginLeft: "8px",
                        background: obj.currentStatus.includes("ACHIEVED") ? "#dcfce7" : obj.currentStatus === "IN_PROGRESS" ? "#fef3c7" : "#f3f4f6",
                        color: obj.currentStatus.includes("ACHIEVED") ? "#166534" : obj.currentStatus === "IN_PROGRESS" ? "#92400e" : "#6b7280",
                      }}>
                        {statusLabels[obj.currentStatus]}
                      </span>
                    </div>
                  ))}
                </div>
              ))}
            </>
          )}

          {/* Recent sessions */}
          {recentSessions.length > 0 && (
            <>
              <h2 style={{ fontSize: "14px", color: "#555", margin: "16px 0 8px", paddingBottom: "4px", borderBottom: "1px solid #eee" }}>
                Últimas Sesiones
              </h2>
              {recentSessions.slice(0, 5).map((s) => (
                <div key={s.id} style={{ padding: "4px 0", fontSize: "11px", color: "#555" }}>
                  {new Date(s.date).toLocaleDateString("es", { day: "numeric", month: "short" })} — {sessionTypeLabels[s.type]} — {s.user.name}
                  {s.notes && <span style={{ color: "#999" }}> · {s.notes.substring(0, 60)}{s.notes.length > 60 ? "..." : ""}</span>}
                </div>
              ))}
            </>
          )}

          {/* Team */}
          {student.assignments.length > 0 && (
            <>
              <h2 style={{ fontSize: "14px", color: "#555", margin: "16px 0 8px", paddingBottom: "4px", borderBottom: "1px solid #eee" }}>
                Equipo Asignado
              </h2>
              {student.assignments.map((a) => (
                <div key={a.user.name} style={{ padding: "3px 0", fontSize: "11px", color: "#555" }}>
                  {a.user.name} — {a.user.specialty || a.user.role}
                </div>
              ))}
            </>
          )}

          {/* Footer */}
          <div style={{ marginTop: "30px", paddingTop: "12px", borderTop: "1px solid #eee", fontSize: "10px", color: "#999", textAlign: "center" }}>
            <p>Generado por TEAGest · {new Date().toLocaleDateString("es", { day: "numeric", month: "long", year: "numeric" })}</p>
            <p>Este reporte es confidencial y contiene información sensible de un menor.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

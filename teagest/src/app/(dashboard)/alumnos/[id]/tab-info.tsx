"use client";

type Student = {
  id: string;
  code: string;
  firstName: string;
  lastName: string;
  birthDate: Date;
  photo: string | null;
  diagnosis: string | null;
  supportLevel: string;
  entryDate: Date;
  status: string;
  notes: string | null;
  group: { id: string; name: string } | null;
  documents: { id: string; name: string; url: string; type: string; createdAt: Date }[];
};

export function TabInfo({ student }: { student: Student }) {
  const birthDate = new Date(student.birthDate);
  const entryDate = new Date(student.entryDate);

  const supportLevelText: Record<string, string> = {
    LEVEL_1: "Nivel 1 — Requiere apoyo",
    LEVEL_2: "Nivel 2 — Requiere apoyo sustancial",
    LEVEL_3: "Nivel 3 — Requiere apoyo muy sustancial",
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Datos personales */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          Datos Personales
        </h3>
        <div className="space-y-3">
          <InfoRow label="Nombre completo" value={`${student.firstName} ${student.lastName}`} />
          <InfoRow label="Código" value={student.code} mono />
          <InfoRow label="Fecha de nacimiento" value={birthDate.toLocaleDateString("es", { day: "numeric", month: "long", year: "numeric" })} />
          <InfoRow label="Edad" value={`${Math.floor((Date.now() - birthDate.getTime()) / (365.25 * 24 * 60 * 60 * 1000))} años`} />
          <InfoRow label="Fecha de ingreso" value={entryDate.toLocaleDateString("es", { day: "numeric", month: "long", year: "numeric" })} />
          <InfoRow label="Grupo" value={student.group?.name || "Sin grupo asignado"} />
        </div>
      </div>

      {/* Datos clínicos */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Información Clínica
        </h3>
        <div className="space-y-3">
          <InfoRow label="Diagnóstico" value={student.diagnosis || "No especificado"} />
          <InfoRow label="Nivel de apoyo" value={supportLevelText[student.supportLevel] || "No especificado"} />
          <InfoRow label="Estado" value={student.status === "ACTIVE" ? "Activo" : student.status} />
        </div>
      </div>

      {/* Observaciones */}
      {student.notes && (
        <div className="bg-white rounded-xl border border-gray-200 p-5 lg:col-span-2">
          <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Observaciones
          </h3>
          <p className="text-sm text-gray-700 whitespace-pre-wrap">{student.notes}</p>
        </div>
      )}

      {/* Documentos */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 lg:col-span-2">
        <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
          Documentos
        </h3>
        {student.documents && student.documents.length > 0 ? (
          <div className="space-y-2">
            {student.documents.map((doc) => (
              <div key={doc.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span className="text-sm text-gray-700">{doc.name}</span>
                </div>
                <span className="text-xs text-gray-400">{doc.type}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">No hay documentos adjuntos</p>
        )}
      </div>
    </div>
  );
}

function InfoRow({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex justify-between items-center py-1.5 border-b border-gray-50 last:border-0">
      <span className="text-sm text-gray-500">{label}</span>
      <span className={`text-sm font-medium text-gray-800 ${mono ? "font-mono" : ""}`}>{value}</span>
    </div>
  );
}

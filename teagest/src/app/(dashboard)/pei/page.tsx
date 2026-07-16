import { Header } from "@/components/header";

export default function PEIPage() {
  return (
    <>
      <Header title="Plan Educativo Individualizado" subtitle="Gestión de PEI y objetivos" />
      <div className="p-6">
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
          <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Planes Educativos</h3>
          <p className="text-gray-500 mb-4">Selecciona un alumno para ver o crear su Plan Educativo Individualizado</p>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition">
            Seleccionar Alumno
          </button>
        </div>
      </div>
    </>
  );
}

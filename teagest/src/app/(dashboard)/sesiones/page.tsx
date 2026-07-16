import { Header } from "@/components/header";

export default function SesionesPage() {
  return (
    <>
      <Header title="Sesiones" subtitle="Registro y calendario de sesiones" />
      <div className="p-6">
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
          <div className="w-16 h-16 bg-yellow-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Registro de Sesiones</h3>
          <p className="text-gray-500 mb-4">Registra y consulta las sesiones de trabajo con cada alumno</p>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition">
            Registrar Sesión
          </button>
        </div>
      </div>
    </>
  );
}

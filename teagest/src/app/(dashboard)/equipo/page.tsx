import { Header } from "@/components/header";

export default function EquipoPage() {
  return (
    <>
      <Header title="Equipo" subtitle="Equipo multidisciplinario del centro" />
      <div className="p-6">
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
          <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Equipo Profesional</h3>
          <p className="text-gray-500 mb-4">Gestiona los profesionales del centro y sus asignaciones</p>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition">
            Agregar Profesional
          </button>
        </div>
      </div>
    </>
  );
}

import { Header } from "@/components/header";

export default function AgendaVisualPage() {
  return (
    <>
      <Header title="Agenda Visual" subtitle="Pictogramas y secuencias de actividades" />
      <div className="p-6">
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
          <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Agenda Visual</h3>
          <p className="text-gray-500 mb-4">Crea agendas visuales con pictogramas para anticipar actividades</p>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition">
            Crear Agenda
          </button>
        </div>
      </div>
    </>
  );
}

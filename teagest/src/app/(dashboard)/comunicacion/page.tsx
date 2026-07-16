import { Header } from "@/components/header";

export default function ComunicacionPage() {
  return (
    <>
      <Header title="Comunicación" subtitle="Mensajes y reportes a familias" />
      <div className="p-6">
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
          <div className="w-16 h-16 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Comunicación con Familias</h3>
          <p className="text-gray-500 mb-4">Envía reportes diarios y mensajes a las familias de tus alumnos</p>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition">
            Nuevo Mensaje
          </button>
        </div>
      </div>
    </>
  );
}

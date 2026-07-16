import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex flex-col items-center justify-center p-8">
      <div className="text-center max-w-2xl">
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-green-500 rounded-2xl flex items-center justify-center">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-gray-900">TEAGest</h1>
        </div>
        <p className="text-lg text-gray-600 mb-8">
          Plataforma integral para la gestión de centros educativos que atienden
          niños con Trastorno del Espectro Autista
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/auth/login"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Iniciar Sesión
          </Link>
          <Link
            href="/auth/registro"
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            Registrar Centro
          </Link>
        </div>
      </div>
    </div>
  );
}

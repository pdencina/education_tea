import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pastel-lavender via-white to-pastel-pink flex flex-col items-center justify-center p-8 relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-pastel-purple rounded-full opacity-40 blur-3xl" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-pastel-teal rounded-full opacity-30 blur-3xl" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-pastel-yellow rounded-full opacity-20 blur-3xl" />

      <div className="text-center max-w-2xl relative z-10">
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-tea-pink rounded-2xl flex items-center justify-center shadow-lg shadow-primary-200/50">
            <svg
              className="w-9 h-9 text-white"
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
          <h1 className="text-5xl font-bold bg-gradient-to-r from-primary-600 via-tea-pink to-primary-500 bg-clip-text text-transparent">
            TEAGest
          </h1>
        </div>
        <p className="text-lg text-gray-500 mb-3">
          Plataforma integral para la gestión de centros educativos
        </p>
        <p className="text-base text-gray-400 mb-10">
          que atienden niños con Trastorno del Espectro Autista
        </p>

        {/* Feature pills */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          <span className="px-3 py-1.5 bg-pastel-purple text-primary-700 rounded-full text-xs font-medium">Plan Educativo</span>
          <span className="px-3 py-1.5 bg-pastel-teal text-teal-700 rounded-full text-xs font-medium">Seguimiento</span>
          <span className="px-3 py-1.5 bg-pastel-pink text-pink-700 rounded-full text-xs font-medium">Comunicación</span>
          <span className="px-3 py-1.5 bg-pastel-yellow text-yellow-700 rounded-full text-xs font-medium">Reportes</span>
          <span className="px-3 py-1.5 bg-pastel-blue text-blue-700 rounded-full text-xs font-medium">Equipo</span>
        </div>

        <div className="flex gap-4 justify-center">
          <Link
            href="/auth/login"
            className="px-8 py-3.5 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl font-medium hover:from-primary-600 hover:to-primary-700 transition-all shadow-lg shadow-primary-200/50 hover:shadow-xl hover:shadow-primary-300/50"
          >
            Iniciar Sesión
          </Link>
          <Link
            href="/auth/registro"
            className="px-8 py-3.5 bg-white border border-gray-200 text-gray-600 rounded-xl font-medium hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm"
          >
            Registrar Centro
          </Link>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("Credenciales inválidas. Intenta de nuevo.");
      setLoading(false);
    } else {
      // Redirect based on role - families go to their portal
      router.push("/dashboard");
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-sidebar-bg relative overflow-hidden items-center justify-center p-12">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary-900/40 via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent-500/10 rounded-full blur-3xl" />

        <div className="relative z-10 max-w-md">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-11 h-11 bg-gradient-to-br from-primary-400 to-accent-400 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <span className="text-xl font-semibold text-white">TEAGest</span>
          </div>
          <h2 className="text-3xl font-bold text-white mb-4 leading-tight">
            Gestión profesional para centros educativos TEA
          </h2>
          <p className="text-sidebar-text/70 text-[15px] leading-relaxed">
            Planes educativos, seguimiento de progreso, comunicación con familias y reportes — todo en una plataforma diseñada para tu equipo.
          </p>
          <div className="mt-10 flex items-center gap-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-white">500+</p>
              <p className="text-[11px] text-sidebar-text/50">Alumnos gestionados</p>
            </div>
            <div className="w-px h-10 bg-white/10" />
            <div className="text-center">
              <p className="text-2xl font-bold text-white">50+</p>
              <p className="text-[11px] text-sidebar-text/50">Centros activos</p>
            </div>
            <div className="w-px h-10 bg-white/10" />
            <div className="text-center">
              <p className="text-2xl font-bold text-white">98%</p>
              <p className="text-[11px] text-sidebar-text/50">Satisfacción</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right panel - Form */}
      <div className="flex-1 flex items-center justify-center p-6 bg-white">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-accent-500 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <span className="text-lg font-semibold text-gray-900">TEAGest</span>
          </div>

          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Bienvenido de vuelta</h1>
            <p className="text-[14px] text-gray-400 mt-1">Ingresa tus credenciales para continuar</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-50 border border-red-100 rounded-lg text-[13px] text-red-600 flex items-center gap-2">
                <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-[13px] font-medium text-gray-700 mb-1.5">
                Correo electrónico
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-[14px] focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all placeholder:text-gray-300"
                placeholder="tu@centro.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-[13px] font-medium text-gray-700 mb-1.5">
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-[14px] focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all placeholder:text-gray-300"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-primary-600 text-white rounded-lg text-[14px] font-medium hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
            >
              {loading ? "Ingresando..." : "Iniciar Sesión"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-[13px] text-gray-400">
              ¿No tienes cuenta?{" "}
              <Link href="/auth/registro" className="text-primary-600 hover:text-primary-700 font-medium">
                Registra tu centro
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

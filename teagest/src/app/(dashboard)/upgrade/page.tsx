"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/header";
import { Suspense } from "react";

const moduleNames: Record<string, string> = {
  "/lista-espera": "Lista de Espera",
  "/evaluaciones": "Evaluaciones Clínicas",
  "/facturacion": "Facturación",
  "/recordatorios": "Recordatorios Automáticos",
  "/agenda-visual": "Agenda Visual",
  "/reportes": "Reportes Avanzados",
  "/indicadores": "Indicadores de Rendimiento",
};

export default function UpgradePage() {
  return (
    <Suspense fallback={null}>
      <UpgradeContent />
    </Suspense>
  );
}

function UpgradeContent() {
  const searchParams = useSearchParams();
  const modulePath = searchParams.get("module") || "";
  const moduleName = moduleNames[modulePath] || "Este módulo";

  return (
    <>
      <Header title="Actualizar Plan" />
      <div className="p-6 flex items-center justify-center min-h-[70vh]">
        <div className="max-w-md text-center">
          <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-5">
            <svg className="w-8 h-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>

          <h2 className="text-xl font-bold text-gray-900 mb-2">
            {moduleName} requiere el plan Centro
          </h2>
          <p className="text-[14px] text-gray-500 mb-6 leading-relaxed">
            Esta funcionalidad no está disponible en tu plan actual. Actualiza al plan <span className="font-semibold text-brand-dark">Centro</span> para acceder a evaluaciones clínicas, facturación, indicadores avanzados y más.
          </p>

          <div className="bg-gray-50 rounded-xl p-4 mb-6 text-left">
            <p className="text-[12px] font-semibold text-gray-500 uppercase tracking-wider mb-2">Plan Centro incluye:</p>
            <ul className="space-y-1.5 text-[13px] text-gray-600">
              <li className="flex items-center gap-2">
                <svg className="w-3.5 h-3.5 text-brand-light flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                50 pacientes, 8 profesionales
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-3.5 h-3.5 text-brand-light flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                Evaluaciones clínicas (ADOS-2, ADI-R)
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-3.5 h-3.5 text-brand-light flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                Facturación y registro de pagos
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-3.5 h-3.5 text-brand-light flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                Recordatorios por WhatsApp + Email
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-3.5 h-3.5 text-brand-light flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                Indicadores avanzados y reportes PDF
              </li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="mailto:contacto@teagest.com?subject=Upgrade al plan Centro"
              className="px-6 py-3 bg-brand-dark text-white rounded-lg text-[14px] font-semibold hover:bg-brand-medium transition"
            >
              Actualizar a Centro — $129.990/mes
            </a>
            <Link
              href="/dashboard"
              className="px-6 py-3 border border-gray-200 text-gray-600 rounded-lg text-[14px] font-medium hover:bg-gray-50 transition"
            >
              Volver
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { SignatureCanvas } from "@/components/signature-canvas";
import { Logo } from "@/components/logo";

export default function ContractPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [contract, setContract] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [signing, setSigning] = useState(false);
  const [signed, setSigned] = useState(false);
  const [error, setError] = useState("");

  const [nombre, setNombre] = useState("");
  const [rut, setRut] = useState("");
  const [email, setEmail] = useState("");
  const [consentimiento, setConsentimiento] = useState(false);
  const [firmaData, setFirmaData] = useState("");

  useEffect(() => {
    fetch(`/api/contracts/${slug}`)
      .then((res) => res.json())
      .then((data) => { setContract(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [slug]);

  const handleSign = async () => {
    if (!nombre || !rut || !firmaData || !consentimiento) {
      setError("Complete todos los campos y firme");
      return;
    }
    setError("");
    setSigning(true);

    const res = await fetch("/api/contracts/sign", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug, firmanteName: nombre, firmanteRut: rut, firmanteEmail: email, firmaData, consentimiento }),
    });

    const data = await res.json();
    setSigning(false);

    if (data.ok) {
      setSigned(true);
    } else {
      setError(data.error || "Error al firmar");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-pulse text-gray-400">Cargando contrato...</div>
      </div>
    );
  }

  if (!contract || contract.error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-600 font-medium">Contrato no encontrado</p>
          <p className="text-[13px] text-gray-400 mt-1">El enlace puede estar incorrecto o expirado.</p>
        </div>
      </div>
    );
  }

  // Already signed view
  if (contract.status === "SIGNED" || signed) {
    return (
      <div className="min-h-screen bg-gray-50 py-10 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
            <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Contrato Firmado</h2>
            <p className="text-[14px] text-gray-500">
              Este contrato fue firmado exitosamente{contract.firmadoAt ? ` el ${new Date(contract.firmadoAt).toLocaleDateString("es-CL", { day: "numeric", month: "long", year: "numeric" })}` : ""}.
            </p>
            {contract.firmanteName && (
              <p className="text-[13px] text-gray-400 mt-2">Firmado por: {contract.firmanteName}</p>
            )}
            {contract.firmaDigital && (
              <div className="mt-4 border-t pt-4">
                <p className="text-[11px] text-gray-400 mb-2">Firma registrada:</p>
                <img src={contract.firmaDigital} alt="Firma" className="h-16 mx-auto opacity-70" />
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <Logo size={40} className="mx-auto mb-3" />
          <h1 className="text-xl font-bold text-gray-900">{contract.title}</h1>
          {contract.plan && (
            <p className="text-[13px] text-gray-500 mt-1">Plan: {contract.plan} · {contract.precio}</p>
          )}
        </div>

        {/* Contract content */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="prose prose-sm max-w-none text-[13px] text-gray-700 leading-relaxed whitespace-pre-wrap">
            {contract.content}
          </div>
        </div>

        {/* Sign form */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
          <h3 className="text-[14px] font-semibold text-gray-800">Datos del Firmante</h3>

          {error && (
            <div className="p-3 bg-red-50 border border-red-100 rounded-lg text-[12px] text-red-600">{error}</div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-[12px] font-medium text-gray-600 mb-1">Nombre completo *</label>
              <input
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-brand-light/30"
                placeholder="Nombre y apellido"
              />
            </div>
            <div>
              <label className="block text-[12px] font-medium text-gray-600 mb-1">RUT *</label>
              <input
                value={rut}
                onChange={(e) => setRut(e.target.value)}
                className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-brand-light/30"
                placeholder="12.345.678-9"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-[12px] font-medium text-gray-600 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-brand-light/30"
                placeholder="correo@ejemplo.com"
              />
            </div>
          </div>

          {/* Signature */}
          <SignatureCanvas onSign={setFirmaData} />

          {firmaData && (
            <div className="flex items-center gap-2 text-[12px] text-green-600">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              Firma capturada
            </div>
          )}

          {/* Consent */}
          <label className="flex items-start gap-2 text-[12px] text-gray-600">
            <input
              type="checkbox"
              checked={consentimiento}
              onChange={(e) => setConsentimiento(e.target.checked)}
              className="mt-0.5 rounded border-gray-300"
            />
            <span>
              Acepto que esta firma electrónica simple tiene validez legal conforme a la Ley 19.799 de Chile.
              Declaro haber leído y aceptado las condiciones del contrato.
            </span>
          </label>

          {/* Submit */}
          <button
            onClick={handleSign}
            disabled={signing || !nombre || !rut || !firmaData || !consentimiento}
            className="w-full py-3 bg-brand-dark text-white rounded-lg text-[14px] font-semibold hover:bg-brand-medium transition disabled:opacity-40"
          >
            {signing ? "Firmando..." : "Firmar Contrato"}
          </button>
        </div>

        <p className="text-center text-[10px] text-gray-400">
          Firma electrónica simple · Ley 19.799 Chile · Auditoría con hash SHA-256
        </p>
      </div>
    </div>
  );
}

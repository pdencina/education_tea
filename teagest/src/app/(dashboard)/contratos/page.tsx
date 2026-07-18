"use client";

import { useState } from "react";
import { Header } from "@/components/header";
import { trpc } from "@/lib/trpc";

const statusLabels: Record<string, { label: string; color: string }> = {
  PENDING: { label: "Pendiente", color: "bg-yellow-100 text-yellow-700" },
  SIGNED: { label: "Firmado", color: "bg-green-100 text-green-700" },
  DRAFT: { label: "Borrador", color: "bg-gray-100 text-gray-600" },
  CANCELLED: { label: "Cancelado", color: "bg-red-100 text-red-600" },
};

export default function ContratosPage() {
  const [showCreate, setShowCreate] = useState(false);
  const { data: contracts, isLoading, refetch } = trpc.contracts.list.useQuery();
  const { data: students } = trpc.students.list.useQuery({});

  const createMutation = trpc.contracts.create.useMutation({ onSuccess: () => { setShowCreate(false); refetch(); } });
  const deleteMutation = trpc.contracts.delete.useMutation({ onSuccess: () => refetch() });

  const appUrl = typeof window !== "undefined" ? window.location.origin : "";

  return (
    <>
      <Header title="Contratos" subtitle="Firma digital de contratos con familias" />
      <div className="p-6 space-y-5">
        {/* Actions */}
        <div className="flex items-center justify-between">
          <p className="text-[13px] text-gray-500">{contracts?.length || 0} contratos</p>
          <button onClick={() => setShowCreate(!showCreate)} className="px-4 py-2 bg-brand-dark text-white rounded-lg text-[13px] font-medium hover:bg-brand-medium transition">
            {showCreate ? "Cancelar" : "+ Crear Contrato"}
          </button>
        </div>

        {/* Create form */}
        {showCreate && (
          <form onSubmit={(e) => { e.preventDefault(); const f = new FormData(e.currentTarget); createMutation.mutate({ title: f.get("title") as string, content: f.get("content") as string, studentId: (f.get("studentId") as string) || undefined, plan: (f.get("plan") as string) || undefined, precio: (f.get("precio") as string) || undefined }); }} className="bg-white rounded-xl border border-gray-100 p-5 space-y-3">
            <p className="text-[13px] font-semibold text-gray-800">Nuevo Contrato</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <input name="title" required placeholder="Título del contrato *" className="col-span-2 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-[12px]" />
              <select name="studentId" className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-[12px]">
                <option value="">Sin paciente asociado</option>
                {students?.map((s) => (<option key={s.id} value={s.id}>{s.firstName} {s.lastName}</option>))}
              </select>
              <input name="plan" placeholder="Plan (ej: Centro)" className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-[12px]" />
              <input name="precio" placeholder="Precio (ej: $129.990/mes)" className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-[12px]" />
            </div>
            <textarea name="content" required rows={8} placeholder="Contenido del contrato. Cláusulas, condiciones, etc..." className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-[12px] resize-none" />
            <button type="submit" disabled={createMutation.isPending} className="px-4 py-2 bg-brand-dark text-white rounded-lg text-[12px] font-medium disabled:opacity-50">
              {createMutation.isPending ? "Creando..." : "Crear y Generar Link"}
            </button>
          </form>
        )}

        {/* Contracts list */}
        {!isLoading && contracts && contracts.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden divide-y divide-gray-50">
            {contracts.map((c) => {
              const status = statusLabels[c.status] || statusLabels.PENDING;
              const signUrl = `${appUrl}/contrato/${c.slug}`;
              return (
                <div key={c.id} className="p-4 hover:bg-gray-50/50 transition">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-[13px] font-medium text-gray-800">{c.title}</p>
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${status.color}`}>{status.label}</span>
                      </div>
                      <div className="flex items-center gap-3 mt-1 text-[11px] text-gray-400">
                        {c.student && <span>{c.student.firstName} {c.student.lastName}</span>}
                        {c.plan && <span>Plan: {c.plan}</span>}
                        <span>{new Date(c.createdAt).toLocaleDateString("es-CL")}</span>
                        {c.firmanteName && <span>Firmado por: {c.firmanteName}</span>}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {c.status === "PENDING" && (
                        <button
                          onClick={() => navigator.clipboard.writeText(signUrl)}
                          className="px-2.5 py-1.5 bg-blue-50 text-blue-700 rounded-md text-[11px] font-medium hover:bg-blue-100 transition"
                          title="Copiar link de firma"
                        >
                          Copiar Link
                        </button>
                      )}
                      <a
                        href={`/contrato/${c.slug}`}
                        target="_blank"
                        className="px-2.5 py-1.5 bg-gray-100 text-gray-600 rounded-md text-[11px] font-medium hover:bg-gray-200 transition"
                      >
                        Ver
                      </a>
                      <button
                        onClick={() => { if (confirm("¿Eliminar contrato?")) deleteMutation.mutate({ id: c.id }); }}
                        className="p-1.5 text-gray-300 hover:text-red-500 transition"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </div>
                  </div>
                  {c.status === "PENDING" && (
                    <div className="mt-2 p-2 bg-gray-50 rounded-lg flex items-center gap-2">
                      <span className="text-[10px] text-gray-400">Link de firma:</span>
                      <code className="text-[10px] text-brand-medium bg-white px-2 py-0.5 rounded border flex-1 truncate">{signUrl}</code>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {!isLoading && (!contracts || contracts.length === 0) && (
          <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
            <h3 className="font-semibold text-gray-800 mb-1">Sin contratos</h3>
            <p className="text-[13px] text-gray-400">Crea un contrato y envía el link a la familia para que firme digitalmente.</p>
          </div>
        )}
      </div>
    </>
  );
}

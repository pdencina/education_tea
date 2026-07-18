"use client";

import { useState } from "react";
import { Header } from "@/components/header";
import { trpc } from "@/lib/trpc";

const statusConfig: Record<string, { label: string; color: string }> = {
  PENDING: { label: "Pendiente", color: "bg-yellow-100 text-yellow-700" },
  PAID: { label: "Pagada", color: "bg-green-100 text-green-700" },
  OVERDUE: { label: "Vencida", color: "bg-red-100 text-red-700" },
  CANCELLED: { label: "Anulada", color: "bg-gray-100 text-gray-500" },
  PARTIAL: { label: "Pago parcial", color: "bg-blue-100 text-blue-700" },
};

const methodLabels: Record<string, string> = {
  CASH: "Efectivo",
  TRANSFER: "Transferencia",
  DEBIT_CARD: "Débito",
  CREDIT_CARD: "Crédito",
  FONASA: "FONASA",
  ISAPRE: "Isapre",
  INSURANCE: "Seguro",
  OTHER: "Otro",
};

export default function FacturacionPage() {
  const [filterStatus, setFilterStatus] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [showPayment, setShowPayment] = useState<string>("");

  const { data: invoices, isLoading, refetch } = trpc.billing.list.useQuery({ status: (filterStatus as any) || undefined });
  const { data: stats } = trpc.billing.stats.useQuery();
  const { data: students } = trpc.students.list.useQuery({});

  const createMutation = trpc.billing.create.useMutation({ onSuccess: () => { setShowCreate(false); refetch(); } });
  const payMutation = trpc.billing.registerPayment.useMutation({ onSuccess: () => { setShowPayment(""); refetch(); } });
  const cancelMutation = trpc.billing.cancel.useMutation({ onSuccess: () => refetch() });

  const formatCLP = (amount: number) => `$${amount.toLocaleString("es-CL")}`;

  return (
    <>
      <Header title="Facturación" subtitle="Boletas, cobros y pagos" />
      <div className="p-6 space-y-5">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-white rounded-xl p-3.5 border border-gray-100">
            <p className="text-[11px] text-gray-400 uppercase font-medium">Ingresos del mes</p>
            <p className="text-xl font-bold text-green-600 mt-0.5">{formatCLP(stats?.monthRevenue ?? 0)}</p>
          </div>
          <div className="bg-white rounded-xl p-3.5 border border-gray-100">
            <p className="text-[11px] text-gray-400 uppercase font-medium">Por cobrar</p>
            <p className="text-xl font-bold text-yellow-600 mt-0.5">{formatCLP(stats?.totalPending ?? 0)}</p>
            <p className="text-[10px] text-gray-400">{stats?.pendingCount ?? 0} boletas</p>
          </div>
          <div className="bg-white rounded-xl p-3.5 border border-gray-100">
            <p className="text-[11px] text-gray-400 uppercase font-medium">Vencidas</p>
            <p className="text-xl font-bold text-red-600 mt-0.5">{formatCLP(stats?.totalOverdue ?? 0)}</p>
            <p className="text-[10px] text-gray-400">{stats?.overdueCount ?? 0} boletas</p>
          </div>
          <div className="bg-white rounded-xl p-3.5 border border-gray-100">
            <p className="text-[11px] text-gray-400 uppercase font-medium">Total cobrado</p>
            <p className="text-xl font-bold text-gray-800 mt-0.5">{formatCLP(stats?.totalPaid ?? 0)}</p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="text-[13px] border border-gray-200 rounded-lg px-3 py-1.5 text-gray-600 bg-white">
            <option value="">Todas las boletas</option>
            {Object.entries(statusConfig).map(([k, v]) => (<option key={k} value={k}>{v.label}</option>))}
          </select>
          <button onClick={() => setShowCreate(true)} className="px-4 py-2 bg-brand-dark text-white rounded-lg text-[13px] font-medium hover:bg-brand-medium transition">
            + Nueva Boleta
          </button>
        </div>

        {/* Create invoice form */}
        {showCreate && (
          <form onSubmit={(e) => { e.preventDefault(); const f = new FormData(e.currentTarget); createMutation.mutate({ studentId: f.get("studentId") as string, description: f.get("description") as string, amount: parseInt(f.get("amount") as string), discount: parseInt((f.get("discount") as string) || "0"), dueDate: f.get("dueDate") as string, convenio: (f.get("convenio") as string) || undefined }); }} className="bg-white rounded-xl border border-gray-100 p-5 space-y-3">
            <p className="text-[13px] font-semibold text-gray-800">Nueva Boleta</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="col-span-2">
                <select name="studentId" required className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-[13px]">
                  <option value="">Paciente *</option>
                  {students?.map((s) => (<option key={s.id} value={s.id}>{s.firstName} {s.lastName}</option>))}
                </select>
              </div>
              <input name="amount" type="number" required placeholder="Monto ($)" className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-[13px]" />
              <input name="discount" type="number" placeholder="Descuento ($)" defaultValue="0" className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-[13px]" />
              <div className="col-span-2">
                <input name="description" required placeholder="Descripción (ej: Sesiones Julio 2026)" className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-[13px]" />
              </div>
              <input name="dueDate" type="date" required className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-[13px]" />
              <select name="convenio" className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-[13px]">
                <option value="">Sin convenio</option>
                <option value="FONASA">FONASA</option>
                <option value="Banmédica">Banmédica</option>
                <option value="Colmena">Colmena</option>
                <option value="Cruz Blanca">Cruz Blanca</option>
                <option value="Vida Tres">Vida Tres</option>
                <option value="Otro">Otro</option>
              </select>
            </div>
            <div className="flex gap-2">
              <button type="button" onClick={() => setShowCreate(false)} className="px-4 py-2 border border-gray-200 text-gray-600 rounded-lg text-[13px] hover:bg-gray-50">Cancelar</button>
              <button type="submit" disabled={createMutation.isPending} className="px-4 py-2 bg-brand-dark text-white rounded-lg text-[13px] font-medium disabled:opacity-50">{createMutation.isPending ? "Creando..." : "Crear Boleta"}</button>
            </div>
          </form>
        )}

        {/* Invoice list */}
        {!isLoading && invoices && invoices.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            <div className="divide-y divide-gray-50">
              {invoices.map((inv) => {
                const status = statusConfig[inv.status] || statusConfig.PENDING;
                const totalPaid = inv.payments.reduce((s, p) => s + p.amount, 0);
                return (
                  <div key={inv.id} className="p-4 hover:bg-gray-50/50 transition">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-gray-100 rounded-lg flex items-center justify-center">
                          <span className="text-[10px] font-bold text-gray-500">{inv.number.split("-")[1]}</span>
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="text-[13px] font-medium text-gray-800">{inv.description}</p>
                            <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${status.color}`}>{status.label}</span>
                            {inv.convenio && <span className="px-1.5 py-0.5 bg-blue-50 text-blue-600 rounded text-[10px] font-medium">{inv.convenio}</span>}
                          </div>
                          <p className="text-[11px] text-gray-400 mt-0.5">
                            {inv.student.firstName} {inv.student.lastName} · {inv.number} · Vence: {new Date(inv.dueDate).toLocaleDateString("es-CL")}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <p className="text-[14px] font-bold text-gray-800">{formatCLP(inv.total)}</p>
                          {totalPaid > 0 && totalPaid < inv.total && (
                            <p className="text-[10px] text-green-600">Pagado: {formatCLP(totalPaid)}</p>
                          )}
                        </div>
                        {(inv.status === "PENDING" || inv.status === "PARTIAL" || inv.status === "OVERDUE") && (
                          <div className="flex gap-1">
                            <button
                              onClick={() => setShowPayment(inv.id)}
                              className="px-2.5 py-1.5 bg-green-50 text-green-700 rounded-md text-[11px] font-medium hover:bg-green-100"
                            >
                              Pagar
                            </button>
                            <button
                              onClick={() => { if (confirm("¿Anular boleta?")) cancelMutation.mutate({ id: inv.id }); }}
                              className="px-2 py-1.5 text-gray-400 hover:text-red-500 rounded-md text-[11px] hover:bg-red-50"
                            >
                              Anular
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {!isLoading && (!invoices || invoices.length === 0) && (
          <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
            <h3 className="font-semibold text-gray-800 mb-1">Sin boletas</h3>
            <p className="text-[13px] text-gray-400">Crea tu primera boleta para comenzar a registrar cobros</p>
          </div>
        )}
      </div>

      {/* Payment dialog */}
      {showPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowPayment("")} />
          <div className="relative bg-white rounded-2xl shadow-xl max-w-sm w-full mx-4 p-5">
            <h3 className="text-[15px] font-semibold text-gray-900 mb-4">Registrar Pago</h3>
            <form onSubmit={(e) => { e.preventDefault(); const f = new FormData(e.currentTarget); payMutation.mutate({ invoiceId: showPayment, amount: parseInt(f.get("amount") as string), method: f.get("method") as any, reference: (f.get("reference") as string) || undefined }); }} className="space-y-3">
              <input name="amount" type="number" required placeholder="Monto pagado ($)" className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-[13px]" />
              <select name="method" required className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-[13px]">
                {Object.entries(methodLabels).map(([k, v]) => (<option key={k} value={k}>{v}</option>))}
              </select>
              <input name="reference" placeholder="N° transferencia / referencia (opcional)" className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-[13px]" />
              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => setShowPayment("")} className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-600 rounded-lg text-[13px]">Cancelar</button>
                <button type="submit" disabled={payMutation.isPending} className="flex-1 px-4 py-2.5 bg-green-600 text-white rounded-lg text-[13px] font-medium disabled:opacity-50">{payMutation.isPending ? "..." : "Registrar Pago"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

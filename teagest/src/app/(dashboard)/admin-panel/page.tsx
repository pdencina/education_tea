"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/header";
import { trpc } from "@/lib/trpc";
import { isSuperAdmin } from "@/lib/super-admin";

const planColors: Record<string, string> = { basic: "bg-gray-100 text-gray-700", center: "bg-brand-muted text-brand-dark", network: "bg-accent/10 text-accent-dark" };
const planNames: Record<string, string> = { basic: "Inicio", center: "Centro", network: "Red" };

export default function AdminPanelPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [selectedTenant, setSelectedTenant] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState<"centros" | "actividad" | "alertas" | "uso">("centros");
  const [noteText, setNoteText] = useState("");

  const email = (session?.user as any)?.email;
  if (session && !isSuperAdmin(email)) { router.push("/dashboard"); return null; }

  const { data: stats } = trpc.superAdmin.globalStats.useQuery(undefined, { enabled: isSuperAdmin(email) });
  const { data: tenants, refetch } = trpc.superAdmin.listTenants.useQuery({ search: search || undefined }, { enabled: isSuperAdmin(email) });
  const { data: tenantDetail } = trpc.superAdmin.getTenant.useQuery({ tenantId: selectedTenant }, { enabled: !!selectedTenant });
  const { data: activity } = trpc.superAdmin.activity.useQuery(undefined, { enabled: tab === "actividad" });
  const { data: churnRisk } = trpc.superAdmin.churnRisk.useQuery(undefined, { enabled: tab === "alertas" });
  const { data: usage } = trpc.superAdmin.usage.useQuery(undefined, { enabled: tab === "uso" });
  const { data: notes, refetch: refetchNotes } = trpc.superAdmin.getNotes.useQuery({ tenantId: selectedTenant }, { enabled: !!selectedTenant });
  const { data: exportData } = trpc.superAdmin.exportData.useQuery(undefined, { enabled: false });

  const changePlanMutation = trpc.superAdmin.changePlan.useMutation({ onSuccess: () => refetch() });
  const createCenterMutation = trpc.superAdmin.createCenter.useMutation({ onSuccess: () => { setShowCreate(false); refetch(); } });
  const deleteMutation = trpc.superAdmin.deleteTenant.useMutation({ onSuccess: () => { setSelectedTenant(""); refetch(); } });
  const addNoteMutation = trpc.superAdmin.addNote.useMutation({ onSuccess: () => { setNoteText(""); refetchNotes(); } });

  const handleImpersonate = async (userId: string) => {
    if (!confirm("¿Entrar como este usuario?")) return;
    const res = await fetch("/api/impersonate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ userId }) });
    if (res.ok) window.location.href = "/dashboard";
  };

  const handleExport = () => {
    if (!tenants) return;
    const csv = "Nombre,Email,Plan,Usuarios,Pacientes,Creado\n" + tenants.map((t) => `"${t.name}","${t.email || ""}","${t.plan}",${t._count.users},${t._count.students},"${new Date(t.createdAt).toLocaleDateString("es-CL")}"`).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "centros-teagest.csv"; a.click();
  };

  const formatCLP = (n: number) => `$${n.toLocaleString("es-CL")}`;

  return (
    <>
      <Header title="🛡️ Super Admin" subtitle="Panel de administración de la plataforma" />
      <div className="p-6 space-y-5">
        {/* MRR + Stats */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
          <div className="bg-white rounded-xl p-3.5 border border-gray-100 col-span-2">
            <p className="text-[11px] text-gray-400 uppercase font-medium">MRR (Ingreso Mensual)</p>
            <p className="text-2xl font-bold text-green-600 mt-0.5">{formatCLP(stats?.mrr ?? 0)}</p>
            <p className="text-[10px] text-gray-400">basado en planes activos</p>
          </div>
          <Stat label="Centros" value={stats?.totalTenants ?? 0} />
          <Stat label="Usuarios" value={stats?.totalUsers ?? 0} />
          <Stat label="Pacientes" value={stats?.totalStudents ?? 0} />
          <Stat label="Nuevos este mes" value={stats?.newThisMonth ?? 0} color="text-blue-600" />
        </div>

        {/* Plan distribution */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white rounded-xl p-3 border border-gray-100 text-center">
            <p className="text-xl font-bold text-gray-600">{stats?.basicCount ?? 0}</p>
            <p className="text-[10px] text-gray-400">Inicio ({formatCLP(49990)}/mes)</p>
          </div>
          <div className="bg-white rounded-xl p-3 border border-gray-100 text-center">
            <p className="text-xl font-bold text-brand-dark">{stats?.centerCount ?? 0}</p>
            <p className="text-[10px] text-gray-400">Centro ({formatCLP(129990)}/mes)</p>
          </div>
          <div className="bg-white rounded-xl p-3 border border-gray-100 text-center">
            <p className="text-xl font-bold text-accent">{stats?.networkCount ?? 0}</p>
            <p className="text-[10px] text-gray-400">Red ({formatCLP(249990)}/mes)</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-gray-100 p-1 rounded-lg w-fit">
          {([["centros", "Centros"], ["actividad", "Actividad"], ["alertas", "Alertas"], ["uso", "Uso"]] as const).map(([id, label]) => (
            <button key={id} onClick={() => setTab(id)} className={`px-3 py-1.5 text-[12px] font-medium rounded-md transition ${tab === id ? "bg-white text-gray-900 shadow-sm" : "text-gray-500"}`}>
              {label} {id === "alertas" && churnRisk && churnRisk.length > 0 && <span className="ml-1 w-4 h-4 bg-red-500 text-white text-[9px] rounded-full inline-flex items-center justify-center">{churnRisk.length}</span>}
            </button>
          ))}
        </div>

        {/* Tab: Centros */}
        {tab === "centros" && (
          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between gap-3">
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar centro..." className="px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-[12px] w-48" />
              <div className="flex gap-2">
                <button onClick={handleExport} className="px-3 py-1.5 text-[11px] text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50">Exportar CSV</button>
                <button onClick={() => setShowCreate(!showCreate)} className="px-3 py-1.5 bg-brand-dark text-white rounded-lg text-[11px] font-medium">{showCreate ? "Cancelar" : "+ Crear Centro"}</button>
              </div>
            </div>

            {showCreate && (
              <form onSubmit={(e) => { e.preventDefault(); const f = new FormData(e.currentTarget); createCenterMutation.mutate({ centerName: f.get("centerName") as string, adminName: f.get("adminName") as string, adminEmail: f.get("adminEmail") as string, adminPassword: f.get("adminPassword") as string, plan: f.get("plan") as any, phone: (f.get("phone") as string) || undefined }); }} className="px-4 py-3 bg-gray-50 border-b border-gray-100">
                <div className="grid grid-cols-3 gap-2 mb-2">
                  <input name="centerName" required placeholder="Nombre centro *" className="px-2.5 py-1.5 bg-white border border-gray-200 rounded text-[11px]" />
                  <input name="adminName" required placeholder="Admin nombre *" className="px-2.5 py-1.5 bg-white border border-gray-200 rounded text-[11px]" />
                  <input name="adminEmail" type="email" required placeholder="Admin email *" className="px-2.5 py-1.5 bg-white border border-gray-200 rounded text-[11px]" />
                  <input name="adminPassword" required placeholder="Contraseña *" className="px-2.5 py-1.5 bg-white border border-gray-200 rounded text-[11px]" />
                  <input name="phone" placeholder="Teléfono" className="px-2.5 py-1.5 bg-white border border-gray-200 rounded text-[11px]" />
                  <select name="plan" defaultValue="basic" className="px-2.5 py-1.5 bg-white border border-gray-200 rounded text-[11px]">
                    <option value="basic">Inicio</option><option value="center">Centro</option><option value="network">Red</option>
                  </select>
                </div>
                <button type="submit" disabled={createCenterMutation.isPending} className="px-3 py-1.5 bg-brand-dark text-white rounded text-[11px] font-medium disabled:opacity-50">{createCenterMutation.isPending ? "..." : "Crear"}</button>
              </form>
            )}

            <div className="divide-y divide-gray-50">
              {tenants?.map((t) => (
                <div key={t.id} className="px-4 py-3 flex items-center justify-between hover:bg-gray-50/50">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 bg-brand-muted rounded-lg flex items-center justify-center"><span className="text-[10px] font-bold text-brand-dark">{t.name.substring(0, 2).toUpperCase()}</span></div>
                    <div>
                      <p className="text-[12px] font-medium text-gray-800">{t.name}</p>
                      <p className="text-[10px] text-gray-400">{t._count.users} usuarios · {t._count.students} pacientes · {new Date(t.createdAt).toLocaleDateString("es-CL", { month: "short", year: "numeric" })}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <select value={t.plan} onChange={(e) => changePlanMutation.mutate({ tenantId: t.id, plan: e.target.value as any })} className={`text-[10px] font-semibold px-2 py-1 rounded border-0 ${planColors[t.plan]}`}>
                      <option value="basic">Inicio</option><option value="center">Centro</option><option value="network">Red</option>
                    </select>
                    <button onClick={() => setSelectedTenant(selectedTenant === t.id ? "" : t.id)} className="px-2 py-1 text-[10px] text-gray-500 hover:bg-gray-100 rounded">Detalle</button>
                    <button onClick={() => { if (confirm(`¿ELIMINAR "${t.name}" y TODOS sus datos? Esto no se puede deshacer.`)) deleteMutation.mutate({ tenantId: t.id }); }} className="px-2 py-1 text-[10px] text-red-400 hover:bg-red-50 hover:text-red-600 rounded">Eliminar</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab: Actividad */}
        {tab === "actividad" && (
          <div className="bg-white rounded-xl border border-gray-100 p-4">
            <h3 className="text-[13px] font-semibold text-gray-800 mb-3">Actividad últimos 7 días</h3>
            <div className="space-y-2">
              {activity?.map((t) => (
                <div key={t.id} className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg text-[12px]">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${t.totalActivity > 0 ? "bg-green-500" : "bg-red-400"}`} />
                    <span className="font-medium text-gray-700">{t.name}</span>
                    <span className={`px-1.5 py-0.5 rounded text-[9px] font-medium ${planColors[t.plan]}`}>{planNames[t.plan]}</span>
                  </div>
                  <div className="flex items-center gap-3 text-[11px] text-gray-500">
                    <span>{t.recentSessions} sesiones</span>
                    <span>{t.recentAppointments} citas</span>
                    <span className="font-medium text-gray-700">{t.totalActivity} total</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab: Alertas (Churn Risk) */}
        {tab === "alertas" && (
          <div className="bg-white rounded-xl border border-gray-100 p-4">
            <h3 className="text-[13px] font-semibold text-gray-800 mb-1">Riesgo de abandono</h3>
            <p className="text-[11px] text-gray-400 mb-3">Centros sin actividad en los últimos 7 días</p>
            {churnRisk && churnRisk.length > 0 ? (
              <div className="space-y-2">
                {churnRisk.map((t: any) => (
                  <div key={t.id} className="flex items-center justify-between py-2 px-3 bg-red-50 rounded-lg text-[12px]">
                    <div>
                      <span className="font-medium text-gray-800">{t.name}</span>
                      <span className="text-gray-400 ml-2">{t.email || "sin email"}</span>
                    </div>
                    <span className="text-[10px] text-red-600 font-medium">Sin actividad 7+ días</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[12px] text-gray-400 text-center py-4">Todos los centros tienen actividad reciente</p>
            )}
          </div>
        )}

        {/* Tab: Uso */}
        {tab === "uso" && (
          <div className="bg-white rounded-xl border border-gray-100 p-4">
            <h3 className="text-[13px] font-semibold text-gray-800 mb-3">Uso vs Límites del Plan</h3>
            <div className="space-y-2">
              {usage?.map((t) => (
                <div key={t.id} className="py-2 px-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between text-[12px] mb-1.5">
                    <span className="font-medium text-gray-700">{t.name}</span>
                    <span className={`px-1.5 py-0.5 rounded text-[9px] font-medium ${planColors[t.plan]}`}>{planNames[t.plan]}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div>
                      <div className="flex justify-between text-gray-500 mb-0.5"><span>Pacientes</span><span>{t.patients}/{t.patientLimit === 99999 ? "∞" : t.patientLimit}</span></div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5"><div className={`h-1.5 rounded-full ${t.patientUsage >= 90 ? "bg-red-500" : t.patientUsage >= 70 ? "bg-yellow-500" : "bg-green-500"}`} style={{ width: `${Math.min(t.patientUsage, 100)}%` }} /></div>
                    </div>
                    <div>
                      <div className="flex justify-between text-gray-500 mb-0.5"><span>Profesionales</span><span>{t.professionals}/{t.professionalLimit === 99999 ? "∞" : t.professionalLimit}</span></div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5"><div className={`h-1.5 rounded-full ${t.professionalUsage >= 90 ? "bg-red-500" : t.professionalUsage >= 70 ? "bg-yellow-500" : "bg-green-500"}`} style={{ width: `${Math.min(t.professionalUsage, 100)}%` }} /></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tenant Detail + Notes */}
        {selectedTenant && tenantDetail && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-xl border border-gray-100 p-4">
              <h3 className="text-[13px] font-semibold text-gray-800 mb-2">{tenantDetail.name} — Usuarios</h3>
              <div className="space-y-1.5">
                {tenantDetail.users.map((user) => (
                  <div key={user.id} className="flex items-center justify-between py-1.5 px-2.5 bg-gray-50 rounded-lg text-[11px]">
                    <div><span className="font-medium text-gray-700">{user.name}</span> <span className="text-gray-400">{user.email}</span></div>
                    <div className="flex items-center gap-1.5">
                      <span className="px-1.5 py-0.5 bg-gray-200 text-gray-600 rounded text-[9px]">{user.role}</span>
                      <button onClick={() => handleImpersonate(user.id)} className="px-1.5 py-0.5 text-[9px] text-brand-medium bg-primary-50 rounded hover:bg-primary-100">Entrar</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Notes CRM */}
            <div className="bg-white rounded-xl border border-gray-100 p-4">
              <h3 className="text-[13px] font-semibold text-gray-800 mb-2">Notas internas</h3>
              <div className="flex gap-2 mb-3">
                <input value={noteText} onChange={(e) => setNoteText(e.target.value)} placeholder="Agregar nota..." className="flex-1 px-2.5 py-1.5 bg-gray-50 border border-gray-200 rounded text-[11px]" />
                <button onClick={() => { if (noteText) addNoteMutation.mutate({ tenantId: selectedTenant, content: noteText }); }} className="px-3 py-1.5 bg-brand-dark text-white rounded text-[10px] font-medium">+</button>
              </div>
              <div className="space-y-1.5 max-h-40 overflow-y-auto">
                {notes?.map((n) => (
                  <div key={n.id} className="py-1.5 px-2.5 bg-yellow-50 rounded text-[11px]">
                    <p className="text-gray-700">{n.content}</p>
                    <p className="text-[9px] text-gray-400 mt-0.5">{new Date(n.createdAt).toLocaleDateString("es-CL", { day: "numeric", month: "short" })} · {n.createdBy}</p>
                  </div>
                ))}
                {(!notes || notes.length === 0) && <p className="text-[11px] text-gray-400">Sin notas</p>}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

function Stat({ label, value, color }: { label: string; value: number; color?: string }) {
  return (
    <div className="bg-white rounded-xl p-3.5 border border-gray-100">
      <p className="text-[10px] text-gray-400 uppercase font-medium">{label}</p>
      <p className={`text-lg font-bold mt-0.5 ${color || "text-gray-900"}`}>{value.toLocaleString()}</p>
    </div>
  );
}

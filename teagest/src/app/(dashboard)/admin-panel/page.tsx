"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/header";
import { trpc } from "@/lib/trpc";
import { isSuperAdmin } from "@/lib/super-admin";

const planColors: Record<string, string> = {
  basic: "bg-gray-100 text-gray-700",
  center: "bg-brand-muted text-brand-dark",
  network: "bg-accent/10 text-accent-dark",
};

const planNames: Record<string, string> = {
  basic: "Inicio",
  center: "Centro",
  network: "Red",
};

export default function AdminPanelPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [selectedTenant, setSelectedTenant] = useState<string>("");
  const [showCreate, setShowCreate] = useState(false);

  const email = (session?.user as any)?.email;

  // Redirect if not super admin
  if (session && !isSuperAdmin(email)) {
    router.push("/dashboard");
    return null;
  }

  const { data: stats } = trpc.superAdmin.globalStats.useQuery(undefined, { enabled: isSuperAdmin(email) });
  const { data: tenants, refetch } = trpc.superAdmin.listTenants.useQuery(undefined, { enabled: isSuperAdmin(email) });
  const { data: tenantDetail } = trpc.superAdmin.getTenant.useQuery({ tenantId: selectedTenant }, { enabled: !!selectedTenant });

  const changePlanMutation = trpc.superAdmin.changePlan.useMutation({ onSuccess: () => refetch() });
  const toggleMutation = trpc.superAdmin.toggleTenant.useMutation({ onSuccess: () => refetch() });
  const createCenterMutation = trpc.superAdmin.createCenter.useMutation({ onSuccess: () => { setShowCreate(false); refetch(); } });

  const handleImpersonate = async (userId: string) => {
    if (!confirm("¿Entrar como este usuario? Tu sesión actual se reemplazará.")) return;
    const res = await fetch("/api/impersonate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
    });
    if (res.ok) {
      window.location.href = "/dashboard";
    }
  };

  return (
    <>
      <Header title="🛡️ Super Admin" subtitle="Panel de administración de la plataforma" />
      <div className="p-6 space-y-6">
        {/* Global Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <StatCard label="Centros" value={stats?.totalTenants ?? 0} />
          <StatCard label="Usuarios" value={stats?.totalUsers ?? 0} />
          <StatCard label="Pacientes" value={stats?.totalStudents ?? 0} />
          <StatCard label="Sesiones" value={stats?.totalSessions ?? 0} />
          <StatCard label="Citas" value={stats?.totalAppointments ?? 0} />
        </div>

        {/* Plan distribution */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white rounded-xl p-4 border border-gray-100 text-center">
            <p className="text-2xl font-bold text-gray-600">{stats?.basicCount ?? 0}</p>
            <p className="text-[11px] text-gray-400">Plan Inicio</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-100 text-center">
            <p className="text-2xl font-bold text-brand-dark">{stats?.centerCount ?? 0}</p>
            <p className="text-[11px] text-gray-400">Plan Centro</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-100 text-center">
            <p className="text-2xl font-bold text-accent">{stats?.networkCount ?? 0}</p>
            <p className="text-[11px] text-gray-400">Plan Red</p>
          </div>
        </div>

        {/* Tenants table */}
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between">
            <h3 className="text-[14px] font-semibold text-gray-800">Centros Registrados</h3>
            <button onClick={() => setShowCreate(!showCreate)} className="px-3 py-1.5 bg-brand-dark text-white rounded-lg text-[12px] font-medium hover:bg-brand-medium transition">
              {showCreate ? "Cancelar" : "+ Crear Centro"}
            </button>
          </div>

          {/* Create center form */}
          {showCreate && (
            <form onSubmit={(e) => { e.preventDefault(); const f = new FormData(e.currentTarget); createCenterMutation.mutate({ centerName: f.get("centerName") as string, adminName: f.get("adminName") as string, adminEmail: f.get("adminEmail") as string, adminPassword: f.get("adminPassword") as string, plan: f.get("plan") as any, phone: (f.get("phone") as string) || undefined }); }} className="px-5 py-4 bg-gray-50 border-b border-gray-100 space-y-3">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                <input name="centerName" required placeholder="Nombre del centro *" className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-[12px] focus:outline-none focus:ring-1 focus:ring-brand-light" />
                <input name="adminName" required placeholder="Nombre del admin *" className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-[12px] focus:outline-none focus:ring-1 focus:ring-brand-light" />
                <input name="adminEmail" type="email" required placeholder="Email del admin *" className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-[12px] focus:outline-none focus:ring-1 focus:ring-brand-light" />
                <input name="adminPassword" required placeholder="Contraseña *" className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-[12px] focus:outline-none focus:ring-1 focus:ring-brand-light" />
                <input name="phone" placeholder="Teléfono (opcional)" className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-[12px] focus:outline-none focus:ring-1 focus:ring-brand-light" />
                <select name="plan" defaultValue="basic" className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-[12px] focus:outline-none focus:ring-1 focus:ring-brand-light">
                  <option value="basic">Plan Inicio</option>
                  <option value="center">Plan Centro</option>
                  <option value="network">Plan Red</option>
                </select>
              </div>
              <button type="submit" disabled={createCenterMutation.isPending} className="px-4 py-2 bg-brand-dark text-white rounded-lg text-[12px] font-medium disabled:opacity-50">
                {createCenterMutation.isPending ? "Creando..." : "Crear Centro"}
              </button>
              {createCenterMutation.isSuccess && (
                <span className="text-[12px] text-green-600 ml-3">Centro creado exitosamente</span>
              )}
            </form>
          )}
          <div className="divide-y divide-gray-50">
            {tenants?.map((tenant) => (
              <div key={tenant.id} className="px-5 py-3 flex items-center justify-between hover:bg-gray-50/50 transition">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-brand-muted rounded-lg flex items-center justify-center">
                    <span className="text-[11px] font-bold text-brand-dark">
                      {tenant.name.substring(0, 2).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="text-[13px] font-medium text-gray-800">{tenant.name}</p>
                    <p className="text-[11px] text-gray-400">
                      {tenant._count.users} usuarios · {tenant._count.students} pacientes · Desde {new Date(tenant.createdAt).toLocaleDateString("es-CL", { month: "short", year: "numeric" })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {/* Plan selector */}
                  <select
                    value={tenant.plan}
                    onChange={(e) => changePlanMutation.mutate({ tenantId: tenant.id, plan: e.target.value as any })}
                    className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg border-0 ${planColors[tenant.plan] || planColors.basic}`}
                  >
                    <option value="basic">Inicio</option>
                    <option value="center">Centro</option>
                    <option value="network">Red</option>
                  </select>

                  {/* Detail button */}
                  <button
                    onClick={() => setSelectedTenant(selectedTenant === tenant.id ? "" : tenant.id)}
                    className="px-2.5 py-1 text-[11px] text-gray-500 hover:text-brand-dark hover:bg-primary-50 rounded-lg transition"
                  >
                    Detalle
                  </button>

                  {/* Toggle active */}
                  <button
                    onClick={() => { if (confirm("¿Desactivar/activar todos los usuarios de este centro?")) toggleMutation.mutate({ tenantId: tenant.id, isActive: true }); }}
                    className="p-1.5 text-gray-300 hover:text-gray-500 transition"
                    title="Toggle activo"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
            {(!tenants || tenants.length === 0) && (
              <div className="px-5 py-8 text-center text-[13px] text-gray-400">No hay centros registrados</div>
            )}
          </div>
        </div>

        {/* Tenant Detail */}
        {selectedTenant && tenantDetail && (
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <h3 className="text-[14px] font-semibold text-gray-800 mb-3">{tenantDetail.name} — Usuarios</h3>
            <div className="space-y-1.5">
              {tenantDetail.users.map((user) => (
                <div key={user.id} className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg text-[12px]">
                  <div>
                    <span className="font-medium text-gray-800">{user.name}</span>
                    <span className="text-gray-400 ml-2">{user.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-gray-200 text-gray-600 rounded text-[10px] font-medium">{user.role}</span>
                    <span className={`w-2 h-2 rounded-full ${user.isActive ? "bg-green-500" : "bg-red-500"}`} />
                    <button
                      onClick={() => handleImpersonate(user.id)}
                      className="px-2 py-1 text-[10px] font-medium text-brand-medium bg-primary-50 rounded hover:bg-primary-100 transition"
                      title="Entrar como este usuario"
                    >
                      Entrar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-white rounded-xl p-3.5 border border-gray-100">
      <p className="text-[11px] text-gray-400 uppercase font-medium">{label}</p>
      <p className="text-xl font-bold text-gray-900 mt-0.5">{value.toLocaleString()}</p>
    </div>
  );
}

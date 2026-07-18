"use client";

import { useState } from "react";
import { trpc } from "@/lib/trpc";

const roleLabels: Record<string, string> = { ADMIN: "Admin", COORDINATOR: "Coordinador", TEACHER: "Docente", SPECIALIST: "Especialista", FAMILY: "Familia" };
const roleColors: Record<string, string> = { ADMIN: "bg-purple-100 text-purple-700", COORDINATOR: "bg-blue-100 text-blue-700", TEACHER: "bg-green-100 text-green-700", SPECIALIST: "bg-orange-100 text-orange-700", FAMILY: "bg-pink-100 text-pink-700" };

export function TabUsuarios() {
  const [showCreate, setShowCreate] = useState(false);
  const [resetId, setResetId] = useState("");
  const [resetPwd, setResetPwd] = useState("");

  const { data: users, isLoading, refetch } = trpc.users.list.useQuery();
  const createMutation = trpc.users.create.useMutation({ onSuccess: () => { setShowCreate(false); refetch(); } });
  const updateMutation = trpc.users.update.useMutation({ onSuccess: () => refetch() });
  const resetMutation = trpc.users.resetPassword.useMutation({ onSuccess: () => { setResetId(""); setResetPwd(""); refetch(); } });
  const deleteMutation = trpc.users.delete.useMutation({ onSuccess: () => refetch() });

  return (
    <div className="space-y-4 max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-gray-800">Usuarios del Centro</h3>
          <p className="text-[11px] text-gray-400 mt-0.5">Crea y gestiona los accesos de tu equipo</p>
        </div>
        <button onClick={() => setShowCreate(!showCreate)} className="px-4 py-2 bg-brand-dark text-white rounded-lg text-[12px] font-medium hover:bg-brand-medium transition">
          {showCreate ? "Cancelar" : "+ Nuevo Usuario"}
        </button>
      </div>

      {/* Create form */}
      {showCreate && (
        <form onSubmit={(e) => { e.preventDefault(); const f = new FormData(e.currentTarget); createMutation.mutate({ name: f.get("name") as string, email: f.get("email") as string, password: f.get("password") as string, role: f.get("role") as any, specialty: (f.get("specialty") as string) || undefined, phone: (f.get("phone") as string) || undefined }); }} className="bg-gray-50 rounded-xl p-4 space-y-3">
          <p className="text-[12px] font-semibold text-gray-700">Crear nuevo usuario</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <input name="name" required placeholder="Nombre completo *" className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-[12px]" />
            <input name="email" type="email" required placeholder="Email *" className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-[12px]" />
            <input name="password" required placeholder="Contraseña *" minLength={6} className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-[12px]" />
            <select name="role" required className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-[12px]">
              <option value="">Rol *</option>
              <option value="ADMIN">Admin</option>
              <option value="COORDINATOR">Coordinador</option>
              <option value="TEACHER">Docente</option>
              <option value="SPECIALIST">Especialista</option>
              <option value="FAMILY">Familia</option>
            </select>
            <input name="specialty" placeholder="Especialidad (opcional)" className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-[12px]" />
            <input name="phone" placeholder="Teléfono (opcional)" className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-[12px]" />
          </div>
          {createMutation.error && <p className="text-[11px] text-red-600">{createMutation.error.message}</p>}
          <button type="submit" disabled={createMutation.isPending} className="px-4 py-2 bg-brand-dark text-white rounded-lg text-[12px] font-medium disabled:opacity-50">
            {createMutation.isPending ? "Creando..." : "Crear Usuario"}
          </button>
        </form>
      )}

      {/* Users list */}
      {isLoading ? (
        <div className="space-y-2">{[1,2,3].map(i => <div key={i} className="h-14 bg-gray-100 rounded-xl animate-pulse" />)}</div>
      ) : (
        <div className="space-y-2">
          {users?.map((user) => {
            const roleColor = roleColors[user.role] || roleColors.TEACHER;
            return (
              <div key={user.id} className="bg-white rounded-xl border border-gray-100 p-3.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${user.isActive ? "bg-brand-muted" : "bg-gray-200"}`}>
                      <span className="text-[10px] font-bold text-brand-dark">{user.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)}</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-[13px] font-medium text-gray-800">{user.name}</p>
                        <span className={`px-1.5 py-0.5 rounded text-[9px] font-semibold ${roleColor}`}>{roleLabels[user.role]}</span>
                        {!user.isActive && <span className="px-1.5 py-0.5 bg-red-100 text-red-600 rounded text-[9px] font-medium">Inactivo</span>}
                      </div>
                      <p className="text-[11px] text-gray-400">{user.email}{user.specialty ? ` · ${user.specialty}` : ""}{user.phone ? ` · ${user.phone}` : ""}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {/* Toggle active */}
                    <button
                      onClick={() => updateMutation.mutate({ userId: user.id, isActive: !user.isActive })}
                      className={`px-2 py-1 text-[10px] rounded ${user.isActive ? "text-gray-500 hover:bg-gray-100" : "text-green-600 bg-green-50 hover:bg-green-100"}`}
                    >
                      {user.isActive ? "Desactivar" : "Activar"}
                    </button>
                    {/* Change role */}
                    <select
                      value={user.role}
                      onChange={(e) => updateMutation.mutate({ userId: user.id, role: e.target.value as any })}
                      className="text-[10px] border border-gray-200 rounded px-1.5 py-1 bg-white"
                    >
                      <option value="ADMIN">Admin</option>
                      <option value="COORDINATOR">Coordinador</option>
                      <option value="TEACHER">Docente</option>
                      <option value="SPECIALIST">Especialista</option>
                      <option value="FAMILY">Familia</option>
                    </select>
                    {/* Reset password */}
                    <button
                      onClick={() => setResetId(resetId === user.id ? "" : user.id)}
                      className="px-2 py-1 text-[10px] text-blue-600 hover:bg-blue-50 rounded"
                    >
                      Contraseña
                    </button>
                    {/* Delete */}
                    <button
                      onClick={() => { if (confirm(`¿Eliminar a ${user.name}? No se puede deshacer.`)) deleteMutation.mutate({ userId: user.id }); }}
                      className="px-2 py-1 text-[10px] text-red-500 hover:bg-red-50 rounded"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>

                {/* Reset password form */}
                {resetId === user.id && (
                  <div className="mt-2 pt-2 border-t border-gray-50 flex items-center gap-2">
                    <input
                      type="text"
                      value={resetPwd}
                      onChange={(e) => setResetPwd(e.target.value)}
                      placeholder="Nueva contraseña (min 6 caracteres)"
                      className="flex-1 px-2.5 py-1.5 bg-gray-50 border border-gray-200 rounded text-[11px]"
                    />
                    <button
                      onClick={() => { if (resetPwd.length >= 6) resetMutation.mutate({ userId: user.id, newPassword: resetPwd }); }}
                      disabled={resetPwd.length < 6}
                      className="px-3 py-1.5 bg-blue-600 text-white rounded text-[10px] font-medium disabled:opacity-40"
                    >
                      Cambiar
                    </button>
                    <button onClick={() => { setResetId(""); setResetPwd(""); }} className="px-2 py-1.5 text-[10px] text-gray-400">Cancelar</button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

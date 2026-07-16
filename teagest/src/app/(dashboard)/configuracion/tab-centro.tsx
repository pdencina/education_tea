"use client";

import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";

export function TabCentro() {
  const { data: tenant, isLoading, refetch } = trpc.admin.getTenant.useQuery();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [saved, setSaved] = useState(false);

  const updateMutation = trpc.admin.updateTenant.useMutation({
    onSuccess: () => {
      setSaved(true);
      refetch();
      setTimeout(() => setSaved(false), 3000);
    },
  });

  useEffect(() => {
    if (tenant) {
      setName(tenant.name || "");
      setEmail(tenant.email || "");
      setPhone(tenant.phone || "");
      setAddress(tenant.address || "");
    }
  }, [tenant]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate({ name, email, phone, address });
  };

  if (isLoading) {
    return <div className="bg-white rounded-2xl border border-gray-100 p-6 animate-pulse"><div className="h-40 bg-gray-100 rounded-xl" /></div>;
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm max-w-2xl">
      <h3 className="font-semibold text-gray-800 mb-5">Datos del Centro</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1.5">Nombre del centro *</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 focus:bg-white transition"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1.5">Email de contacto</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 focus:bg-white transition"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1.5">Teléfono</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 focus:bg-white transition"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1.5">Dirección</label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 focus:bg-white transition"
          />
        </div>
        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={updateMutation.isPending}
            className="px-5 py-2.5 bg-primary-500 text-white rounded-xl text-sm font-medium hover:bg-primary-600 transition disabled:opacity-50"
          >
            {updateMutation.isPending ? "Guardando..." : "Guardar Cambios"}
          </button>
          {saved && <span className="text-sm text-green-600 font-medium">Guardado correctamente</span>}
        </div>
      </form>
    </div>
  );
}

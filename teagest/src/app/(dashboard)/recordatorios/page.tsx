"use client";

import { useState } from "react";
import { Header } from "@/components/header";
import { trpc } from "@/lib/trpc";

const typeLabels: Record<string, { label: string; desc: string }> = {
  APPOINTMENT_24H: { label: "Cita - 24h antes", desc: "Se envía el día anterior a la cita" },
  APPOINTMENT_1H: { label: "Cita - 1h antes", desc: "Se envía una hora antes de la cita" },
  PAYMENT_DUE: { label: "Pago próximo a vencer", desc: "Se envía 3 días antes del vencimiento" },
  PAYMENT_OVERDUE: { label: "Pago vencido", desc: "Se envía cuando una boleta se vence" },
  WELCOME: { label: "Bienvenida", desc: "Se envía al inscribir un nuevo paciente" },
  CUSTOM: { label: "Personalizado", desc: "Envío manual" },
};

const defaultTemplates: Record<string, string> = {
  APPOINTMENT_24H: "Hola {{apoderado}}, le recordamos que {{paciente}} tiene cita mañana a las {{hora}} con {{terapeuta}}. Centro TEA.",
  APPOINTMENT_1H: "{{paciente}} tiene cita en 1 hora ({{hora}}) con {{terapeuta}}. Los esperamos.",
  PAYMENT_DUE: "Estimado/a {{apoderado}}, le recordamos que la boleta {{numero}} por ${{monto}} vence el {{fecha}}.",
  PAYMENT_OVERDUE: "Estimado/a {{apoderado}}, la boleta {{numero}} por ${{monto}} se encuentra vencida. Por favor regularice.",
  WELCOME: "Bienvenido/a {{apoderado}}, {{paciente}} ha sido inscrito en nuestro centro. Nos comunicaremos pronto para agendar.",
  CUSTOM: "{{mensaje}}",
};

export default function RecordatoriosPage() {
  const [editingType, setEditingType] = useState<string>("");
  const [testChannel, setTestChannel] = useState<"whatsapp" | "email">("whatsapp");
  const [testRecipient, setTestRecipient] = useState("");
  const [testMessage, setTestMessage] = useState("");

  const { data: configs, refetch: refetchConfigs } = trpc.reminders.getConfigs.useQuery();
  const { data: logs } = trpc.reminders.getLogs.useQuery({});
  const { data: stats } = trpc.reminders.stats.useQuery();

  const upsertMutation = trpc.reminders.upsertConfig.useMutation({ onSuccess: () => { setEditingType(""); refetchConfigs(); } });
  const testMutation = trpc.reminders.sendTest.useMutation();

  const handleSaveConfig = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    upsertMutation.mutate({
      type: editingType as any,
      channel: form.get("channel") as any,
      isActive: form.get("isActive") === "on",
      template: form.get("template") as string,
    });
  };

  const handleTest = () => {
    if (!testRecipient || !testMessage) return;
    testMutation.mutate({ channel: testChannel, recipient: testRecipient, message: testMessage });
    setTestRecipient("");
    setTestMessage("");
  };

  return (
    <>
      <Header title="Recordatorios" subtitle="Notificaciones automáticas por WhatsApp y email" />
      <div className="p-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-white rounded-xl p-3.5 border border-gray-100">
            <p className="text-[11px] text-gray-400 uppercase font-medium">Enviados este mes</p>
            <p className="text-xl font-bold text-brand-dark mt-0.5">{stats?.totalSent ?? 0}</p>
          </div>
          <div className="bg-white rounded-xl p-3.5 border border-gray-100">
            <p className="text-[11px] text-gray-400 uppercase font-medium">WhatsApp</p>
            <p className="text-xl font-bold text-green-600 mt-0.5">{stats?.whatsappSent ?? 0}</p>
          </div>
          <div className="bg-white rounded-xl p-3.5 border border-gray-100">
            <p className="text-[11px] text-gray-400 uppercase font-medium">Email</p>
            <p className="text-xl font-bold text-blue-600 mt-0.5">{stats?.emailSent ?? 0}</p>
          </div>
          <div className="bg-white rounded-xl p-3.5 border border-gray-100">
            <p className="text-[11px] text-gray-400 uppercase font-medium">Fallidos</p>
            <p className="text-xl font-bold text-red-600 mt-0.5">{stats?.totalFailed ?? 0}</p>
          </div>
        </div>

        {/* Configuration */}
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <h3 className="text-[14px] font-semibold text-gray-800 mb-4">Configuración de Recordatorios</h3>
          <div className="space-y-2">
            {Object.entries(typeLabels).map(([type, info]) => {
              const config = configs?.find((c) => c.type === type);
              const isEditing = editingType === type;

              return (
                <div key={type} className="border border-gray-100 rounded-xl overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-2.5 h-2.5 rounded-full ${config?.isActive ? "bg-green-500" : "bg-gray-300"}`} />
                      <div>
                        <p className="text-[13px] font-medium text-gray-800">{info.label}</p>
                        <p className="text-[11px] text-gray-400">{info.desc}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {config && (
                        <span className="text-[10px] px-2 py-0.5 bg-gray-100 text-gray-500 rounded font-medium">
                          {config.channel === "BOTH" ? "WhatsApp + Email" : config.channel === "WHATSAPP" ? "WhatsApp" : "Email"}
                        </span>
                      )}
                      <button
                        onClick={() => setEditingType(isEditing ? "" : type)}
                        className="px-3 py-1.5 text-[11px] font-medium text-brand-medium bg-primary-50 rounded-lg hover:bg-primary-100 transition"
                      >
                        {isEditing ? "Cerrar" : "Configurar"}
                      </button>
                    </div>
                  </div>

                  {isEditing && (
                    <form onSubmit={handleSaveConfig} className="px-4 py-3 bg-gray-50 border-t border-gray-100 space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-medium text-gray-600 mb-1">Canal</label>
                          <select name="channel" defaultValue={config?.channel || "BOTH"} className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-[12px]">
                            <option value="BOTH">WhatsApp + Email</option>
                            <option value="WHATSAPP">Solo WhatsApp</option>
                            <option value="EMAIL">Solo Email</option>
                          </select>
                        </div>
                        <div className="flex items-end pb-1">
                          <label className="flex items-center gap-2 text-[12px] text-gray-600">
                            <input name="isActive" type="checkbox" defaultChecked={config?.isActive ?? true} className="rounded border-gray-300" />
                            Activado
                          </label>
                        </div>
                      </div>
                      <div>
                        <label className="block text-[11px] font-medium text-gray-600 mb-1">Plantilla del mensaje</label>
                        <textarea
                          name="template"
                          rows={3}
                          defaultValue={config?.template || defaultTemplates[type]}
                          className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-[12px] resize-none"
                        />
                        <p className="text-[10px] text-gray-400 mt-1">
                          Variables: {"{{apoderado}}"}, {"{{paciente}}"}, {"{{hora}}"}, {"{{terapeuta}}"}, {"{{fecha}}"}, {"{{monto}}"}, {"{{numero}}"}
                        </p>
                      </div>
                      <button type="submit" disabled={upsertMutation.isPending} className="px-4 py-2 bg-brand-dark text-white rounded-lg text-[12px] font-medium disabled:opacity-50">
                        {upsertMutation.isPending ? "Guardando..." : "Guardar"}
                      </button>
                    </form>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Test sender */}
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <h3 className="text-[14px] font-semibold text-gray-800 mb-3">Envío de Prueba</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <select value={testChannel} onChange={(e) => setTestChannel(e.target.value as any)} className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-[12px]">
              <option value="whatsapp">WhatsApp</option>
              <option value="email">Email</option>
            </select>
            <input
              value={testRecipient}
              onChange={(e) => setTestRecipient(e.target.value)}
              placeholder={testChannel === "whatsapp" ? "+56 9 1234 5678" : "email@ejemplo.com"}
              className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-[12px]"
            />
            <input
              value={testMessage}
              onChange={(e) => setTestMessage(e.target.value)}
              placeholder="Mensaje de prueba..."
              className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-[12px]"
            />
            <button onClick={handleTest} disabled={!testRecipient || !testMessage} className="px-4 py-2 bg-brand-dark text-white rounded-lg text-[12px] font-medium disabled:opacity-50">
              Enviar prueba
            </button>
          </div>
          <p className="text-[10px] text-gray-400 mt-2">
            Nota: Para enviar por WhatsApp real, configura las variables WHATSAPP_API_TOKEN y WHATSAPP_PHONE_ID en Vercel.
          </p>
        </div>

        {/* Recent logs */}
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <h3 className="text-[14px] font-semibold text-gray-800 mb-3">Historial de Envíos</h3>
          {logs && logs.length > 0 ? (
            <div className="space-y-1.5 max-h-64 overflow-y-auto">
              {logs.map((log) => (
                <div key={log.id} className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg text-[12px]">
                  <div className="flex items-center gap-2">
                    <span>{log.channel === "whatsapp" ? "💬" : "✉️"}</span>
                    <span className="text-gray-700">{log.recipient}</span>
                    {log.studentName && <span className="text-gray-400">· {log.studentName}</span>}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${log.status === "sent" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                      {log.status === "sent" ? "Enviado" : "Error"}
                    </span>
                    <span className="text-[10px] text-gray-400">
                      {new Date(log.sentAt).toLocaleDateString("es-CL", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-[13px] text-gray-400 text-center py-4">No hay envíos registrados</p>
          )}
        </div>
      </div>
    </>
  );
}

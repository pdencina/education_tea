"use client";

import { useState } from "react";
import { Header } from "@/components/header";
import { trpc } from "@/lib/trpc";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { appointmentReminderMessage, paymentReminderMessage, noShowMessage } from "@/lib/whatsapp";

export default function RecordatoriosPage() {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split("T")[0];

  const [selectedDate, setSelectedDate] = useState(tomorrowStr);

  const { data: appointments } = trpc.appointments.getWithContacts.useQuery({ date: selectedDate });
  const { data: stats } = trpc.reminders.stats.useQuery();

  // Get pending invoices for payment reminders
  const { data: invoices } = trpc.billing.list.useQuery({ status: "PENDING" });

  const tomorrowLabel = tomorrow.toLocaleDateString("es-CL", { weekday: "long", day: "numeric", month: "long" });

  return (
    <>
      <Header title="Recordatorios WhatsApp" subtitle="Enviar recordatorios con un clic" />
      <div className="p-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-white rounded-xl p-3.5 border border-gray-100">
            <p className="text-[11px] text-gray-400 uppercase font-medium">Enviados este mes</p>
            <p className="text-xl font-bold text-green-600 mt-0.5">{stats?.totalSent ?? 0}</p>
          </div>
          <div className="bg-white rounded-xl p-3.5 border border-gray-100">
            <p className="text-[11px] text-gray-400 uppercase font-medium">Por WhatsApp</p>
            <p className="text-xl font-bold text-green-600 mt-0.5">{stats?.whatsappSent ?? 0}</p>
          </div>
          <div className="bg-white rounded-xl p-3.5 border border-gray-100">
            <p className="text-[11px] text-gray-400 uppercase font-medium">Citas mañana</p>
            <p className="text-xl font-bold text-brand-dark mt-0.5">{appointments?.length ?? 0}</p>
          </div>
          <div className="bg-white rounded-xl p-3.5 border border-gray-100">
            <p className="text-[11px] text-gray-400 uppercase font-medium">Cobros pendientes</p>
            <p className="text-xl font-bold text-yellow-600 mt-0.5">{invoices?.length ?? 0}</p>
          </div>
        </div>

        {/* Appointment Reminders */}
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-[14px] font-semibold text-gray-800">Recordatorios de Citas</h3>
              <p className="text-[12px] text-gray-400">Envía recordatorio por WhatsApp a cada familia</p>
            </div>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-3 py-1.5 border border-gray-200 rounded-lg text-[12px]"
            />
          </div>

          {appointments && appointments.length > 0 ? (
            <div className="space-y-2">
              {appointments.map((appt) => {
                const familyContact = appt.student.familyLinks[0]?.user;
                const dateLabel = new Date(selectedDate).toLocaleDateString("es-CL", { weekday: "long", day: "numeric", month: "short" });

                return (
                  <div key={appt.id} className="flex items-center justify-between py-2.5 px-3 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-brand-muted rounded-lg flex items-center justify-center">
                        <span className="text-[10px] font-bold text-brand-dark">{appt.student.firstName[0]}{appt.student.lastName[0]}</span>
                      </div>
                      <div>
                        <p className="text-[12px] font-medium text-gray-800">{appt.student.firstName} {appt.student.lastName}</p>
                        <p className="text-[10px] text-gray-400">{appt.startTime} - {appt.endTime} · {appt.therapist.name}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {familyContact?.phone ? (
                        <WhatsAppButton
                          phone={familyContact.phone}
                          message={appointmentReminderMessage({
                            parentName: familyContact.name,
                            childName: appt.student.firstName,
                            date: dateLabel,
                            time: appt.startTime,
                            therapist: appt.therapist.name,
                          })}
                          label="Recordar"
                        />
                      ) : (
                        <span className="text-[10px] text-gray-400">Sin teléfono</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-[13px] text-gray-400 text-center py-6">No hay citas para esta fecha</p>
          )}

          {appointments && appointments.length > 0 && (
            <div className="mt-4 pt-3 border-t border-gray-100">
              <p className="text-[11px] text-gray-400">
                Haz clic en el botón verde para abrir WhatsApp con el mensaje pre-escrito. Solo presiona Enviar.
              </p>
            </div>
          )}
        </div>

        {/* Payment Reminders */}
        {invoices && invoices.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <h3 className="text-[14px] font-semibold text-gray-800 mb-1">Cobros Pendientes</h3>
            <p className="text-[12px] text-gray-400 mb-4">Envía recordatorio de pago por WhatsApp</p>
            <div className="space-y-2">
              {invoices.slice(0, 10).map((inv) => (
                <div key={inv.id} className="flex items-center justify-between py-2.5 px-3 bg-gray-50 rounded-xl">
                  <div>
                    <p className="text-[12px] font-medium text-gray-800">{inv.student.firstName} {inv.student.lastName}</p>
                    <p className="text-[10px] text-gray-400">{inv.description} · ${inv.total.toLocaleString("es-CL")} · Vence {new Date(inv.dueDate).toLocaleDateString("es-CL")}</p>
                  </div>
                  <WhatsAppButton
                    phone=""
                    message={paymentReminderMessage({
                      parentName: "Apoderado",
                      amount: `$${inv.total.toLocaleString("es-CL")}`,
                      description: inv.description,
                      dueDate: new Date(inv.dueDate).toLocaleDateString("es-CL"),
                    })}
                    label="Cobrar"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* How it works */}
        <div className="bg-gray-50 rounded-xl p-5">
          <h3 className="text-[13px] font-semibold text-gray-700 mb-2">¿Cómo funciona?</h3>
          <ol className="space-y-1.5 text-[12px] text-gray-500">
            <li>1. Haz clic en el botón verde de WhatsApp</li>
            <li>2. Se abre WhatsApp Web (o la app) con el mensaje listo</li>
            <li>3. Solo presiona Enviar — el mensaje ya está escrito</li>
            <li>4. El apoderado recibe el recordatorio al instante</li>
          </ol>
          <p className="text-[11px] text-gray-400 mt-3">
            Para que funcione, los apoderados deben tener su número de teléfono registrado en el sistema (vinculado al paciente como familiar).
          </p>
        </div>
      </div>
    </>
  );
}

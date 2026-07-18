"use client";

import { useState } from "react";
import { trpc } from "@/lib/trpc";

export default function FamiliaMensajesPage() {
  const [message, setMessage] = useState("");
  const { data: children } = trpc.familyPortal.getMyChildren.useQuery();
  const studentId = children?.[0]?.id || "";

  const { data: messages, refetch } = trpc.familyPortal.getMessages.useQuery(
    { studentId },
    { enabled: !!studentId }
  );

  const sendMutation = trpc.familyPortal.sendMessage.useMutation({
    onSuccess: () => { setMessage(""); refetch(); },
  });

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !studentId) return;
    sendMutation.mutate({ studentId, content: message.trim() });
  };

  return (
    <div className="space-y-4">
      <h1 className="text-lg font-bold text-gray-900">Mensajes</h1>
      <p className="text-[13px] text-gray-400">Comunícate con el equipo de tu hijo/a</p>

      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden flex flex-col h-[500px]">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {(!messages || messages.length === 0) && (
            <p className="text-center text-[13px] text-gray-400 py-8">No hay mensajes aún</p>
          )}
          {messages?.map((msg) => {
            const isFamily = msg.sender.role === "FAMILY";
            return (
              <div key={msg.id} className={`flex ${isFamily ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[75%] rounded-xl px-3.5 py-2.5 ${isFamily ? "bg-brand-dark text-white" : "bg-gray-100 text-gray-800"}`}>
                  {!isFamily && (
                    <p className={`text-[10px] font-medium mb-0.5 ${isFamily ? "text-white/60" : "text-gray-500"}`}>
                      {msg.sender.name}
                    </p>
                  )}
                  <p className="text-[13px]">{msg.content}</p>
                  <p className={`text-[10px] mt-1 ${isFamily ? "text-white/40" : "text-gray-400"}`}>
                    {new Date(msg.createdAt).toLocaleTimeString("es", { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Input */}
        <form onSubmit={handleSend} className="p-3 border-t border-gray-100 flex gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Escribe un mensaje..."
            className="flex-1 px-3.5 py-2 bg-gray-50 border border-gray-100 rounded-lg text-[13px] focus:outline-none focus:ring-1 focus:ring-brand-light"
          />
          <button
            type="submit"
            disabled={!message.trim() || sendMutation.isPending}
            className="px-4 py-2 bg-brand-dark text-white rounded-lg text-[13px] font-medium disabled:opacity-50"
          >
            Enviar
          </button>
        </form>
      </div>
    </div>
  );
}

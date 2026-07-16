"use client";

import { useState, useEffect, useRef } from "react";
import { trpc } from "@/lib/trpc";

const roleColors: Record<string, string> = {
  ADMIN: "bg-purple-100 text-purple-700",
  COORDINATOR: "bg-blue-100 text-blue-700",
  TEACHER: "bg-green-100 text-green-700",
  SPECIALIST: "bg-orange-100 text-orange-700",
  FAMILY: "bg-pink-100 text-pink-700",
};

export function ChatView({ studentId }: { studentId: string }) {
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data: messages, isLoading, refetch } = trpc.communication.getMessages.useQuery({ studentId });
  const markAsRead = trpc.communication.markAsRead.useMutation();

  const sendMutation = trpc.communication.sendMessage.useMutation({
    onSuccess: () => {
      setMessage("");
      refetch();
    },
  });

  useEffect(() => {
    if (messages && messages.length > 0) {
      markAsRead.mutate({ studentId });
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, studentId]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    sendMutation.mutate({ studentId, content: message.trim() });
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="animate-pulse text-gray-300">Cargando mensajes...</div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {(!messages || messages.length === 0) && (
          <div className="flex items-center justify-center h-full">
            <p className="text-sm text-gray-400">No hay mensajes aún. Inicia la conversación.</p>
          </div>
        )}
        {messages?.map((msg) => {
          const roleColor = roleColors[msg.sender.role] || "bg-gray-100 text-gray-700";
          return (
            <div key={msg.id} className="flex gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-300 to-tea-pink rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-[10px] font-semibold text-white">
                  {msg.sender.name.split(" ").map((n) => n[0]).join("")}
                </span>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-xs font-medium text-gray-700">{msg.sender.name}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${roleColor}`}>
                    {msg.sender.role === "FAMILY" ? "Familia" :
                     msg.sender.role === "TEACHER" ? "Docente" :
                     msg.sender.role === "SPECIALIST" ? "Especialista" :
                     msg.sender.role === "COORDINATOR" ? "Coord." : "Admin"}
                  </span>
                  <span className="text-[10px] text-gray-300">
                    {new Date(msg.createdAt).toLocaleTimeString("es", { hour: "2-digit", minute: "2-digit" })}
                    {" · "}
                    {new Date(msg.createdAt).toLocaleDateString("es", { day: "numeric", month: "short" })}
                  </span>
                </div>
                <p className="text-sm text-gray-600 bg-gray-50 rounded-xl rounded-tl-sm px-3 py-2 inline-block max-w-[80%]">
                  {msg.content}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <form onSubmit={handleSend} className="p-3 border-t border-gray-100">
        <div className="flex gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Escribe un mensaje..."
            className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-transparent focus:bg-white transition-all"
          />
          <button
            type="submit"
            disabled={!message.trim() || sendMutation.isPending}
            className="px-4 py-2.5 bg-primary-500 text-white rounded-xl text-sm font-medium hover:bg-primary-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
        <p className="text-[10px] text-gray-300 mt-1.5 px-1">
          Los mensajes son visibles para todo el equipo del alumno y su familia vinculada.
        </p>
      </form>
    </div>
  );
}

"use client";

import { useState } from "react";
import { Header } from "@/components/header";
import { trpc } from "@/lib/trpc";
import { ChatView } from "./chat-view";
import { DailyReportDialog } from "./daily-report-dialog";

export default function ComunicacionPage() {
  const [selectedStudentId, setSelectedStudentId] = useState<string>("");
  const [showReport, setShowReport] = useState(false);
  const [activeTab, setActiveTab] = useState<"mensajes" | "reportes">("mensajes");

  const { data: conversations, isLoading } = trpc.communication.getConversations.useQuery();

  const selectedStudent = conversations?.find((c) => c.id === selectedStudentId);

  return (
    <>
      <Header title="Comunicación" subtitle="Mensajes y reportes a familias" />
      <div className="p-6">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden h-[calc(100vh-160px)]">
          <div className="flex h-full">
            {/* Conversation List */}
            <div className="w-80 border-r border-gray-100 flex flex-col">
              <div className="p-4 border-b border-gray-50">
                <h3 className="font-semibold text-gray-800 text-sm">Conversaciones</h3>
                <p className="text-xs text-gray-400 mt-0.5">{conversations?.length || 0} alumnos</p>
              </div>
              <div className="flex-1 overflow-y-auto">
                {isLoading && (
                  <div className="p-4 space-y-3">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="animate-pulse flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-200 rounded-full" />
                        <div className="flex-1 space-y-1">
                          <div className="h-3 bg-gray-200 rounded w-24" />
                          <div className="h-2 bg-gray-100 rounded w-32" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {conversations?.map((conv) => {
                  const lastMsg = conv.messages[0];
                  const unread = conv._count.messages;
                  const isSelected = conv.id === selectedStudentId;
                  return (
                    <button
                      key={conv.id}
                      onClick={() => setSelectedStudentId(conv.id)}
                      className={`w-full text-left px-4 py-3 border-b border-gray-50 transition-colors ${
                        isSelected ? "bg-primary-50/70" : "hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-tea-pink rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-xs font-semibold text-white">
                            {conv.firstName[0]}{conv.lastName[0]}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className={`text-sm truncate ${isSelected ? "font-semibold text-primary-700" : "font-medium text-gray-700"}`}>
                              {conv.firstName} {conv.lastName}
                            </p>
                            {unread > 0 && (
                              <span className="w-5 h-5 bg-tea-pink text-white text-[10px] font-bold rounded-full flex items-center justify-center flex-shrink-0">
                                {unread}
                              </span>
                            )}
                          </div>
                          {lastMsg ? (
                            <p className="text-xs text-gray-400 truncate mt-0.5">
                              {lastMsg.sender.name.split(" ")[0]}: {lastMsg.content}
                            </p>
                          ) : (
                            <p className="text-xs text-gray-300 mt-0.5">Sin mensajes</p>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Chat / Report Area */}
            <div className="flex-1 flex flex-col">
              {!selectedStudentId ? (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-pastel-purple rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    </div>
                    <h3 className="font-semibold text-gray-700 mb-1">Selecciona una conversación</h3>
                    <p className="text-sm text-gray-400">Elige un alumno para ver los mensajes con su familia</p>
                  </div>
                </div>
              ) : (
                <>
                  {/* Chat header with tabs */}
                  <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-gradient-to-br from-primary-400 to-tea-pink rounded-full flex items-center justify-center">
                        <span className="text-xs font-semibold text-white">
                          {selectedStudent?.firstName[0]}{selectedStudent?.lastName[0]}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-800">
                          {selectedStudent?.firstName} {selectedStudent?.lastName}
                        </p>
                        <p className="text-xs text-gray-400">{selectedStudent?.group?.name || "Sin grupo"}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-0.5">
                      <button
                        onClick={() => setActiveTab("mensajes")}
                        className={`px-3 py-1.5 rounded-md text-xs font-medium transition ${
                          activeTab === "mensajes" ? "bg-white text-primary-700 shadow-sm" : "text-gray-500"
                        }`}
                      >
                        Mensajes
                      </button>
                      <button
                        onClick={() => setActiveTab("reportes")}
                        className={`px-3 py-1.5 rounded-md text-xs font-medium transition ${
                          activeTab === "reportes" ? "bg-white text-primary-700 shadow-sm" : "text-gray-500"
                        }`}
                      >
                        Reportes
                      </button>
                    </div>
                    <button
                      onClick={() => setShowReport(true)}
                      className="px-3 py-1.5 bg-primary-500 text-white rounded-lg text-xs font-medium hover:bg-primary-600 transition"
                    >
                      + Reporte
                    </button>
                  </div>

                  {/* Content */}
                  {activeTab === "mensajes" && <ChatView studentId={selectedStudentId} />}
                  {activeTab === "reportes" && <ReportsView studentId={selectedStudentId} />}
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {showReport && selectedStudentId && (
        <DailyReportDialog
          studentId={selectedStudentId}
          studentName={`${selectedStudent?.firstName} ${selectedStudent?.lastName}`}
          onClose={() => setShowReport(false)}
          onCreated={() => setShowReport(false)}
        />
      )}
    </>
  );
}

// Reports tab view
function ReportsView({ studentId }: { studentId: string }) {
  const { data: reports, isLoading } = trpc.communication.getReports.useQuery({ studentId });

  const moodEmojis: Record<string, string> = {
    excelente: "😊", bien: "🙂", neutral: "😐", dificil: "😟", crisis: "😢",
  };

  if (isLoading) {
    return <div className="flex-1 p-4 animate-pulse"><div className="h-20 bg-gray-100 rounded-xl" /></div>;
  }

  if (!reports || reports.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-sm text-gray-400">No hay reportes diarios para este alumno</p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-3">
      {reports.map((r) => (
        <div key={r.id} className="bg-gray-50 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-gray-500">
              {new Date(r.date).toLocaleDateString("es", { weekday: "long", day: "numeric", month: "long" })}
            </span>
            <span className="text-xs text-gray-400">por {r.sentBy.name}</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
            {r.mood && (
              <div className="bg-white rounded-lg p-2 text-center">
                <span className="text-lg">{moodEmojis[r.mood] || "😐"}</span>
                <p className="text-gray-500 mt-0.5">Ánimo</p>
              </div>
            )}
            {r.feeding && (
              <div className="bg-white rounded-lg p-2 text-center">
                <span className="text-lg">🍽️</span>
                <p className="text-gray-500 mt-0.5">{r.feeding}</p>
              </div>
            )}
            {r.rest && (
              <div className="bg-white rounded-lg p-2 text-center">
                <span className="text-lg">😴</span>
                <p className="text-gray-500 mt-0.5">{r.rest}</p>
              </div>
            )}
            {r.participation && (
              <div className="bg-white rounded-lg p-2 text-center">
                <span className="text-lg">⭐</span>
                <p className="text-gray-500 mt-0.5">{r.participation}</p>
              </div>
            )}
          </div>
          {r.highlights && (
            <p className="text-sm text-gray-600 mt-3 bg-white rounded-lg p-2">{r.highlights}</p>
          )}
        </div>
      ))}
    </div>
  );
}

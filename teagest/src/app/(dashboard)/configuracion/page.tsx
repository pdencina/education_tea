"use client";

import { useState } from "react";
import { Header } from "@/components/header";
import { TabCentro } from "./tab-centro";
import { TabPeriodos } from "./tab-periodos";
import { TabGrupos } from "./tab-grupos";
import { TabAreas } from "./tab-areas";
import { TabUsuarios } from "./tab-usuarios";
import { Building2, CalendarDays, Users, Target, UserCog } from "lucide-react";

const tabs = [
  { id: "centro", label: "Centro", Icon: Building2 },
  { id: "usuarios", label: "Usuarios", Icon: UserCog },
  { id: "periodos", label: "Períodos", Icon: CalendarDays },
  { id: "grupos", label: "Grupos", Icon: Users },
  { id: "areas", label: "Áreas", Icon: Target },
];

export default function ConfiguracionPage() {
  const [activeTab, setActiveTab] = useState("centro");

  return (
    <>
      <Header title="Configuración" subtitle="Ajustes del centro" />
      <div className="p-6 space-y-6">
        {/* Tabs */}
        <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-4 py-2 text-[13px] font-medium rounded-lg transition-all ${
                activeTab === tab.id
                  ? "bg-white text-brand-dark shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <tab.Icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        {activeTab === "centro" && <TabCentro />}
        {activeTab === "usuarios" && <TabUsuarios />}
        {activeTab === "periodos" && <TabPeriodos />}
        {activeTab === "grupos" && <TabGrupos />}
        {activeTab === "areas" && <TabAreas />}
      </div>
    </>
  );
}

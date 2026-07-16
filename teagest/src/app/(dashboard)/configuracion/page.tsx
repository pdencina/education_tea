"use client";

import { useState } from "react";
import { Header } from "@/components/header";
import { TabCentro } from "./tab-centro";
import { TabPeriodos } from "./tab-periodos";
import { TabGrupos } from "./tab-grupos";
import { TabAreas } from "./tab-areas";

const tabs = [
  { id: "centro", label: "Centro", icon: "🏫" },
  { id: "periodos", label: "Períodos", icon: "📅" },
  { id: "grupos", label: "Grupos", icon: "👥" },
  { id: "areas", label: "Áreas de Desarrollo", icon: "🎯" },
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
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                activeTab === tab.id
                  ? "bg-white text-primary-700 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <span className="mr-1.5">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        {activeTab === "centro" && <TabCentro />}
        {activeTab === "periodos" && <TabPeriodos />}
        {activeTab === "grupos" && <TabGrupos />}
        {activeTab === "areas" && <TabAreas />}
      </div>
    </>
  );
}

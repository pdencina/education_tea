"use client";

import { Bell, Search } from "lucide-react";

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export function Header({ title, subtitle }: HeaderProps) {
  return (
    <header className="bg-white border-b border-gray-100 px-6 py-3.5 flex items-center justify-between sticky top-0 z-10">
      <div>
        <h2 className="text-[17px] font-semibold text-gray-900 tracking-tight">{title}</h2>
        {subtitle && <p className="text-[13px] text-gray-400 mt-0.5">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-2">
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar..."
            className="pl-8 pr-3 py-1.5 bg-gray-50 border border-gray-100 rounded-lg text-[13px] focus:outline-none focus:ring-1 focus:ring-primary-400 focus:border-primary-400 focus:bg-white w-48 transition-all placeholder:text-gray-300"
          />
          <Search className="w-3.5 h-3.5 text-gray-300 absolute left-2.5 top-[7px]" />
        </div>
        <button className="relative p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
          <Bell className="w-[18px] h-[18px]" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full" />
        </button>
      </div>
    </header>
  );
}

"use client";

import { Bell, Search } from "lucide-react";

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export function Header({ title, subtitle }: HeaderProps) {
  return (
    <header className="bg-white/80 backdrop-blur-sm border-b border-gray-100 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
      <div>
        <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
        {subtitle && <p className="text-sm text-gray-400">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-3">
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar alumno..."
            className="pl-9 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-transparent focus:bg-white w-56 transition-all"
          />
          <Search className="w-4 h-4 text-gray-300 absolute left-3 top-2.5" />
        </div>
        <button className="relative p-2.5 text-gray-400 hover:text-primary-500 hover:bg-primary-50 rounded-xl transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-tea-pink rounded-full ring-2 ring-white"></span>
        </button>
      </div>
    </header>
  );
}

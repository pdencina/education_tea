"use client";

import { Bell, Search } from "lucide-react";

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export function Header({ title, subtitle }: HeaderProps) {
  return (
    <header className="px-4 lg:px-6 py-3.5 flex items-center justify-between sticky top-0 z-10 bg-[#f8fffe]/80 backdrop-blur-sm">
      <div className="ml-10 lg:ml-0">
        <h2 className="text-base lg:text-lg font-semibold text-brand-dark">{title}</h2>
        {subtitle && <p className="text-[12px] lg:text-[13px] text-gray-400 mt-0.5">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-2">
        <div className="relative hidden sm:block">
          <input
            type="text"
            placeholder="Buscar..."
            className="pl-8 pr-3 py-1.5 bg-white border border-gray-200/60 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 w-44 transition-all placeholder:text-gray-300"
          />
          <Search className="w-3.5 h-3.5 text-gray-300 absolute left-2.5 top-[7px]" />
        </div>
        <button className="relative p-2 text-gray-400 hover:text-brand-medium hover:bg-primary-50 rounded-lg transition-colors">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-accent rounded-full" />
        </button>
      </div>
    </header>
  );
}

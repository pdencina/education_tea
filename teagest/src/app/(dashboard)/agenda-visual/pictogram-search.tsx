"use client";

import { useState, useCallback } from "react";

type Pictogram = {
  id: number;
  url: string;
  keywords: string[];
};

interface PictogramSearchProps {
  onSelect: (pictogram: { id: number; url: string; label: string }) => void;
}

export function PictogramSearch({ onSelect }: PictogramSearchProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Pictogram[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const search = useCallback(async () => {
    if (!query.trim()) return;

    setIsSearching(true);
    setHasSearched(true);

    try {
      const response = await fetch(`/api/pictograms?q=${encodeURIComponent(query.trim())}`);
      if (response.ok) {
        const data = await response.json();
        setResults(data);
      } else {
        setResults([]);
      }
    } catch {
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  }, [query]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      search();
    }
  };

  // Common quick-search words for TEA contexts
  const quickWords = ["comer", "beber", "baño", "jugar", "dormir", "escuela", "casa", "libro", "música", "pintar"];

  return (
    <div>
      <label className="block text-sm font-medium text-gray-600 mb-2">Buscar pictogramas (ARASAAC)</label>

      {/* Search input */}
      <div className="flex gap-2 mb-3">
        <div className="relative flex-1">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Busca un pictograma: comer, jugar, escuela..."
            className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 focus:bg-white transition"
          />
          <svg className="w-4 h-4 text-gray-300 absolute left-3 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <button
          onClick={search}
          disabled={!query.trim() || isSearching}
          className="px-4 py-2.5 bg-primary-500 text-white rounded-xl text-sm font-medium hover:bg-primary-600 transition disabled:opacity-50"
        >
          {isSearching ? "..." : "Buscar"}
        </button>
      </div>

      {/* Quick search buttons */}
      {!hasSearched && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {quickWords.map((word) => (
            <button
              key={word}
              onClick={() => { setQuery(word); }}
              className="px-2.5 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs hover:bg-primary-50 hover:text-primary-700 transition"
            >
              {word}
            </button>
          ))}
        </div>
      )}

      {/* Results */}
      {isSearching && (
        <div className="flex items-center justify-center py-6">
          <div className="animate-spin w-5 h-5 border-2 border-primary-500 border-t-transparent rounded-full" />
          <span className="ml-2 text-sm text-gray-400">Buscando en ARASAAC...</span>
        </div>
      )}

      {!isSearching && hasSearched && results.length === 0 && (
        <div className="text-center py-4">
          <p className="text-sm text-gray-400">No se encontraron pictogramas para &quot;{query}&quot;</p>
          <p className="text-xs text-gray-300 mt-1">Intenta con otra palabra en español</p>
        </div>
      )}

      {!isSearching && results.length > 0 && (
        <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 gap-2 max-h-48 overflow-y-auto p-2 bg-gray-50 rounded-xl border border-gray-100">
          {results.map((picto) => (
            <button
              key={picto.id}
              onClick={() => onSelect({ id: picto.id, url: picto.url, label: picto.keywords[0] || query })}
              className="flex flex-col items-center p-1.5 rounded-lg hover:bg-white hover:shadow-sm transition group/picto"
              title={picto.keywords.join(", ")}
            >
              <div className="w-12 h-12 flex items-center justify-center">
                <img
                  src={picto.url}
                  alt={picto.keywords[0] || "pictograma"}
                  className="w-11 h-11 object-contain group-hover/picto:scale-110 transition-transform"
                />
              </div>
              <span className="text-[9px] text-gray-500 mt-0.5 max-w-12 truncate">
                {picto.keywords[0] || ""}
              </span>
            </button>
          ))}
        </div>
      )}

      <p className="text-[10px] text-gray-300 mt-2">
        Pictogramas: ARASAAC (arasaac.org) · Licencia Creative Commons BY-NC-SA
      </p>
    </div>
  );
}

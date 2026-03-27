"use client";

import { Search, X } from "lucide-react";

export default function SearchBox({ searchTerm, setSearchTerm }) {
  return (
    <div className="bg-white px-4 py-2 border-b border-gray-200">
      <div className="relative group">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors"
          size={16}
        />

        <input
          type="text"
          placeholder="Tìm món ăn..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-10 py-2 bg-gray-100 border-none rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all"
        />

        {searchTerm && (
          <button
            onClick={() => setSearchTerm("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X size={14} />
          </button>
        )}
      </div>
    </div>
  );
}

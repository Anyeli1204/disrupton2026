"use client";

import { Search, type LucideIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function SearchBar({
  placeholder = "Buscar cualquier código: QR, cosecha, recepción, empaque, pallet, contenedor…",
  defaultValue = "",
  size = "md",
  onSearch,
  icon: Icon = Search,
}: {
  placeholder?: string;
  defaultValue?: string;
  size?: "sm" | "md" | "lg";
  onSearch?: (q: string) => void;
  icon?: LucideIcon;
}) {
  const [q, setQ] = useState(defaultValue);
  const router = useRouter();
  const pad = size === "lg" ? "px-5 py-4 text-base" : size === "sm" ? "px-3 py-1.5 text-sm" : "px-4 py-2.5 text-sm";

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const value = q.trim();
    if (onSearch) onSearch(value);
    else router.push(`/trazabilidad?q=${encodeURIComponent(value)}`);
  }

  return (
    <form onSubmit={submit} className="relative w-full">
      <Icon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder={placeholder}
        className={`w-full rounded-full border border-slate-200 bg-white ${pad} pl-10 text-slate-800 shadow-sm outline-none ring-zhenda/20 placeholder:text-slate-400 focus:border-zhenda focus:ring-2`}
      />
    </form>
  );
}

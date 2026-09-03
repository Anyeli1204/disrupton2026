"use client";

import { formatDateTime } from "@/lib/format";
import type { DataSource, Sourced } from "@/types";
import { Database } from "lucide-react";
import { useState } from "react";

export function DataSourceBadge({ source, compact = false }: { source: DataSource; compact?: boolean }) {
  const [open, setOpen] = useState(false);
  return (
    <span className="relative inline-flex">
      <button
        type="button"
        className="inline-flex items-center gap-1 rounded text-slate-400 hover:text-zhenda"
        aria-label="Fuente del dato"
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onClick={() => setOpen((v) => !v)}
      >
        <Database className="h-3.5 w-3.5" />
        {!compact && <span className="sr-only">Fuente</span>}
      </button>
      {open && (
        <span className="absolute left-0 top-5 z-30 w-64 rounded-lg border border-slate-200 bg-white p-3 text-left text-xs shadow-lg">
          <span className="block text-[10px] font-semibold uppercase tracking-wide text-slate-400">Fuente del dato</span>
          <span className="mt-1 block font-medium text-slate-800">{source.source}</span>
          <span className="mt-0.5 block text-slate-500">{source.system}</span>
          <span className="mt-2 block text-[10px] font-semibold uppercase tracking-wide text-slate-400">Última sincronización</span>
          <span className="mt-1 block text-slate-700">{formatDateTime(source.updatedAt)}</span>
        </span>
      )}
    </span>
  );
}

export function SourcedValue({
  data,
  render,
}: {
  data: Sourced<string | number>;
  render?: (value: string | number) => React.ReactNode;
}) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span>{render ? render(data.value) : String(data.value)}</span>
      <DataSourceBadge source={data.source} />
    </span>
  );
}

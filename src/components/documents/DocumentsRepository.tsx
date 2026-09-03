"use client";

import { DataTable } from "@/components/ui/DataTable";
import { DataSourceBadge } from "@/components/ui/DataSourceBadge";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { documents } from "@/data";
import { DOCUMENT_CATEGORY_LABEL } from "@/lib/constants";
import { formatDate } from "@/lib/format";
import type { Document, DocumentCategory } from "@/types";
import { useMemo, useState } from "react";

export function DocumentsRepository({ highlightId }: { highlightId?: string }) {
  const [cat, setCat] = useState<DocumentCategory | "all">("all");
  const rows = useMemo(
    () => documents.filter((d) => (cat === "all" ? true : d.category === cat)),
    [cat],
  );
  const cats: (DocumentCategory | "all")[] = ["all", "certificaciones", "calidad", "proveedores", "exportacion", "logistica", "reclamos", "auditorias"];

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold">Documentos</h1>
        <p className="text-sm text-slate-500">Repositorio documental de la campaña.</p>
      </div>
      <div className="flex flex-wrap gap-2">
        {cats.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setCat(c)}
            className={`rounded-full px-3 py-1.5 text-xs font-medium ${
              cat === c ? "bg-zhenda text-white" : "bg-white ring-1 ring-slate-200 text-slate-600"
            }`}
          >
            {c === "all" ? "Todos" : DOCUMENT_CATEGORY_LABEL[c]}
          </button>
        ))}
      </div>
      <DataTable<Document>
        rows={rows}
        rowKey={(r) => r.id}
        columns={[
          { key: "name", header: "Nombre", render: (r) => (
            <span className={highlightId === r.id ? "font-semibold text-zhenda" : ""}>{r.name}</span>
          ) },
          { key: "type", header: "Tipo", render: (r) => r.type },
          { key: "code", header: "Código", render: (r) => r.code },
          { key: "ent", header: "Entidad asociada", render: (r) => r.relatedEntityLabel },
          { key: "date", header: "Fecha", render: (r) => formatDate(r.date) },
          { key: "exp", header: "Vencimiento", render: (r) => (r.expiresAt ? formatDate(r.expiresAt) : "—") },
          { key: "src", header: "Fuente", render: (r) => (
            <span className="inline-flex items-center gap-1">
              {r.source.system}
              <DataSourceBadge source={r.source} />
            </span>
          ) },
          { key: "st", header: "Estado", render: (r) => <StatusBadge status={r.status} /> },
        ]}
      />
    </div>
  );
}

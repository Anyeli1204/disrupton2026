"use client";

import { DataTable } from "@/components/ui/DataTable";
import { EntityLink } from "@/components/ui/EntityLink";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { packingLots } from "@/data";
import { LOT_STATUS_LABEL } from "@/lib/constants";
import { formatDate } from "@/lib/format";
import { useZhendaStore } from "@/lib/store";
import type { LotStatus, PackingLot } from "@/types";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";

export function LotsList() {
  const router = useRouter();
  const params = useSearchParams();
  const estado = params.get("estado") as LotStatus | null;
  const store = useZhendaStore();

  const rows = useMemo(() => {
    return packingLots
      .map((l) => ({ ...l, status: store.getLotStatus(l.id, l.status) }))
      .filter((l) => (estado ? l.status === estado : true));
  }, [estado, store]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Lotes de empaque</h1>
          <p className="text-sm text-slate-500">Identificador maestro asociado al QR del clamshell.</p>
        </div>
        <select
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"
          value={estado ?? ""}
          onChange={(e) => router.push(e.target.value ? `/lotes?estado=${e.target.value}` : "/lotes")}
        >
          <option value="">Todos los estados</option>
          {Object.entries(LOT_STATUS_LABEL).map(([k, v]) => (
            <option key={k} value={k}>
              {v}
            </option>
          ))}
        </select>
      </div>
      <DataTable<PackingLot>
        rows={rows}
        rowKey={(r) => r.id}
        onRowClick={(r) => router.push(`/lotes/${r.id}`)}
        columns={[
          { key: "id", header: "Lote", render: (r) => <EntityLink type="packingLot" id={r.id} /> },
          { key: "var", header: "Variedad", render: (r) => r.variety },
          { key: "date", header: "Empaque", render: (r) => formatDate(r.packingDate.value) },
          { key: "dest", header: "Destino", render: (r) => r.destinationCountry },
          { key: "boxes", header: "Cajas", render: (r) => String(r.boxCount) },
          { key: "st", header: "Estado", render: (r) => <StatusBadge status={r.status} /> },
        ]}
      />
    </div>
  );
}

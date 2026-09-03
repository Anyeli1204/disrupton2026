"use client";

import { DataTable } from "@/components/ui/DataTable";
import { EntityLink } from "@/components/ui/EntityLink";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { destinations, importers, packingLots, supermarkets, distributionCenters } from "@/data";
import { getImporter, getPackingLot, getSupermarket, relatedDestinationsSummary } from "@/lib/queries";
import type { Destination } from "@/types";
import { Button } from "@/components/ui/Button";
import { PageHeader } from "@/components/ui/PageHeader";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

export function DestinationsList() {
  const [lot, setLot] = useState("");
  const [country, setCountry] = useState("");
  const [importer, setImporter] = useState("");
  const [cd, setCd] = useState("");
  const [sm, setSm] = useState("");
  const [status, setStatus] = useState("");
  const router = useRouter();

  const rows = useMemo(
    () =>
      destinations.filter((d) => {
        if (lot && d.packingLotId !== lot) return false;
        if (country && d.country !== country) return false;
        if (importer && d.importerId !== importer) return false;
        if (cd && d.distributionCenterId !== cd) return false;
        if (sm && d.supermarketId !== sm) return false;
        if (status && d.status !== status) return false;
        return true;
      }),
    [lot, country, importer, cd, sm, status],
  );

  return (
    <div className="space-y-4">
      <PageHeader title="Destinos" description="Consulte a dónde fue enviado cada lote." />
      <div className="zhenda-card grid gap-2 p-4 sm:grid-cols-2 lg:grid-cols-4">
        <Select label="Lote" value={lot} onChange={setLot} options={packingLots.slice(0, 12).map((l) => [l.id, l.id])} />
        <Select label="País" value={country} onChange={setCountry} options={[...new Set(destinations.map((d) => d.country))].map((c) => [c, c])} />
        <Select label="Importador" value={importer} onChange={setImporter} options={importers.map((i) => [i.id, i.name])} />
        <Select label="Centro de distribución" value={cd} onChange={setCd} options={distributionCenters.map((c) => [c.id, c.code])} />
        <Select label="Supermercado" value={sm} onChange={setSm} options={supermarkets.map((s) => [s.id, s.name])} />
        <Select
          label="Estado"
          value={status}
          onChange={setStatus}
          options={[
            ["en_transito", "En tránsito"],
            ["en_cd", "En CD"],
            ["en_tienda", "En tienda"],
            ["retirado", "Retirado"],
            ["vendido", "Vendido"],
          ]}
        />
      </div>
      <DataTable<Destination>
        rows={rows}
        rowKey={(r) => r.id}
        onRowClick={(r) => router.push(`/destinos/${r.packingLotId}`)}
        columns={[
          { key: "lot", header: "Lote", render: (r) => <EntityLink type="packingLot" id={r.packingLotId} /> },
          { key: "imp", header: "Importador", render: (r) => getImporter(r.importerId)?.name ?? r.importerId },
          { key: "cd", header: "Centro distribución", render: (r) => r.distributionCenterId },
          { key: "sm", header: "Supermercado", render: (r) => getSupermarket(r.supermarketId)?.name ?? r.supermarketId },
          { key: "country", header: "País", render: (r) => r.country },
          { key: "qty", header: "Cantidad", render: (r) => `${r.boxCount} cajas` },
          { key: "st", header: "Estado", render: (r) => <StatusBadge status={r.status} /> },
        ]}
      />
    </div>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: (readonly [string, string])[] | [string, string][];
}) {
  return (
    <label className="text-xs text-slate-500">
      {label}
      <select
        className="zhenda-input mt-1"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">Todos</option>
        {options.map(([v, l]) => (
          <option key={v} value={v}>
            {l}
          </option>
        ))}
      </select>
    </label>
  );
}

export function LotDestinations({ loteId }: { loteId: string }) {
  const lot = getPackingLot(loteId);
  const dests = relatedDestinationsSummary(loteId);
  return (
    <div className="space-y-4">
      <PageHeader
        eyebrow="Destinos"
        title={`Destinos de ${loteId}`}
        description={`${lot?.variety} · ${lot?.destinationCountry}`}
        actions={<Button href={`/trazabilidad?q=${loteId}`}>Ver trazabilidad</Button>}
      />
      <div className="zhenda-card overflow-hidden">
        {dests.map(({ destination, supermarket, importer, cd }) => (
          <div key={destination.id} className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-4 py-3 last:border-0">
            <div>
              <p className="font-medium">{supermarket?.name}</p>
              <p className="text-xs text-slate-500">
                {importer?.name} · {cd?.name} ({cd?.code}) · {destination.country}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm">{destination.boxCount} cajas {destination.boxFrom && `(${destination.boxFrom}–${destination.boxTo})`}</span>
              <StatusBadge status={destination.status} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

"use client";

import { ExplorerModeToggle, ExplorerTree } from "@/components/traceability/ExplorerTree";
import { SearchBar } from "@/components/ui/SearchBar";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { EXPLORER_PHOTOS, NODE_ICON } from "@/lib/explorerVisuals";
import { entityTypeLabel } from "@/lib/format";
import { buildExplorerView, resolveIdentifier } from "@/lib/graph";
import type { ExplorerMode } from "@/types";
import { Globe, Package, QrCode, Ship, Truck } from "lucide-react";
import Image from "next/image";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

export function TraceabilityView({ initialQuery }: { initialQuery: string }) {
  const [q, setQ] = useState(initialQuery || "EMP-2026-0841");
  const [mode, setMode] = useState<ExplorerMode>("origen");
  const record = useMemo(() => resolveIdentifier(q), [q]);
  const view = useMemo(() => (record ? buildExplorerView(record.id, mode) : null), [record, mode]);
  const router = useRouter();
  const TypeIcon = record ? NODE_ICON[record.type] ?? Package : Package;

  const tree = view
    ? mode === "origen"
      ? view.originTree
      : mode === "destino"
        ? view.destinationTree
        : view.relationTree
    : null;

  function go(id: string) {
    setQ(id);
    router.replace(`/trazabilidad?q=${encodeURIComponent(id)}`);
  }

  return (
    <div className="space-y-4">
      <section className="overflow-hidden rounded-2xl border border-emerald-900/10 bg-[#122018] text-white">
        <div className="grid lg:grid-cols-[1.4fr_0.6fr]">
          <div className="p-4 sm:p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-emerald-200/75">
                  Capa de interoperabilidad
                </p>
                <h1 className="mt-1 text-xl font-semibold tracking-tight">Explorador de trazabilidad</h1>
              </div>
              <div className="hidden items-center gap-2 text-emerald-100/80 sm:flex">
                <ChainStep icon={Package} label="Empaque" />
                <span className="h-px w-4 bg-emerald-100/25" />
                <ChainStep icon={Truck} label="Tránsito" />
                <span className="h-px w-4 bg-emerald-100/25" />
                <ChainStep icon={Ship} label="Exportación" />
                <span className="h-px w-4 bg-emerald-100/25" />
                <ChainStep icon={Globe} label="Destino" />
              </div>
            </div>
            <div className="mt-3">
              <SearchBar
                key={q}
                defaultValue={q}
                size="md"
                icon={QrCode}
                placeholder="Buscar QR, lote, jaba, caja, pallet, contenedor…"
                onSearch={go}
              />
            </div>
          </div>
          <div className="relative hidden min-h-full lg:block">
            <Image
              src={EXPLORER_PHOTOS.blueberries}
              alt="Arándano fresco Ventura"
              fill
              className="object-cover"
              sizes="28vw"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-l from-transparent to-[#122018]" />
          </div>
        </div>
      </section>

      {record && (
        <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-zhenda">
            <TypeIcon className="h-4 w-4" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
              {entityTypeLabel(record.type)} · {record.sourceSystem}
            </p>
            <h2 className="truncate text-base font-semibold leading-tight">{record.label}</h2>
          </div>
          {record.status && <StatusBadge status={record.status} />}
          <ExplorerModeToggle mode={mode} onChange={setMode} />
        </div>
      )}

      {view && tree ? (
        <ExplorerTree root={tree} mode={mode} inputs={view.inputs} quality={view.quality} />
      ) : (
        <p className="text-sm text-slate-500">No se encontró un identificador relacionado en los sistemas conectados.</p>
      )}
    </div>
  );
}

function ChainStep({ icon: Icon, label }: { icon: typeof Package; label: string }) {
  return (
    <span className="inline-flex items-center gap-1 text-[10px] font-medium">
      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/10">
        <Icon className="h-3 w-3" />
      </span>
      {label}
    </span>
  );
}


"use client";

import { TraceNodePreview } from "@/components/traceability/TraceNodePreview";
import { Modal } from "@/components/ui/Modal";
import { EXPLORER_PHOTOS, NODE_ICON, nodePhoto } from "@/lib/explorerVisuals";
import { buildTimeline, defaultFocusType, journeySummary, type TimelineRow } from "@/lib/explorerTimeline";
import { entityTypeLabel } from "@/lib/format";
import { entityHref } from "@/lib/queries";
import type { ExplorerMode, ExplorerRefGroup, GraphNode, TraceInputGroup, TraceNode } from "@/types";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Container,
  GitBranch,
  Leaf,
  MapPin,
  Package,
  QrCode,
  ShieldCheck,
  Trees,
  Warehouse,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

type SideTab = "recorrido" | "certificaciones" | "insumos";

export function ExplorerTree({
  root,
  mode,
  inputs,
  quality = [],
}: {
  root: GraphNode;
  mode: ExplorerMode;
  inputs: TraceInputGroup[];
  quality?: ExplorerRefGroup[];
}) {
  const [selected, setSelected] = useState<TraceNode | null>(null);
  const [focusId, setFocusId] = useState<string | null>(null);
  const [tab, setTab] = useState<SideTab>("recorrido");
  const router = useRouter();
  const rows = useMemo(() => buildTimeline(root), [root]);
  const summary = useMemo(() => journeySummary(root), [root]);
  const showInputs = inputs.length > 0;
  const showQuality = quality.length > 0;
  const focusType = defaultFocusType(mode);
  const highlightedId = focusId ?? rows.find((row) => row.node.type === focusType)?.node.id ?? rows[0]?.node.id;

  useEffect(() => {
    setTab("recorrido");
  }, [root.id, mode]);

  function openRow(row: TimelineRow, isOrigin: boolean) {
    setFocusId(row.node.id);
    setSelected({
      type: row.node.type,
      id: row.node.id,
      label: row.node.label,
      subtitle: row.node.subtitle,
      isOrigin,
      relation: row.node.relation,
      branch: row.node.branch,
    });
  }

  function toggleTab(next: SideTab) {
    setTab((current) => (current === next ? "recorrido" : next));
  }

  const title =
    mode === "origen" ? "¿De dónde viene?" : mode === "destino" ? "¿A dónde fue?" : "¿Con qué se relaciona?";

  return (
    <>
      <div className="space-y-4">
        <section className="zhenda-card overflow-hidden">
          <div className="px-5 pt-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="flex items-center gap-2 text-lg font-semibold text-zhenda">
                <Leaf className="h-5 w-5" />
                {title}
              </h2>
              <div className="flex flex-wrap gap-1.5">
                {showQuality && (
                  <SidePill
                    active={tab === "certificaciones"}
                    icon={ShieldCheck}
                    label="Certificaciones"
                    onClick={() => toggleTab("certificaciones")}
                  />
                )}
                {showInputs && (
                  <SidePill
                    active={tab === "insumos"}
                    icon={Package}
                    label="Insumos"
                    onClick={() => toggleTab("insumos")}
                  />
                )}
              </div>
            </div>
            <SummaryBar summary={summary} mode={mode} />
          </div>
          {tab === "certificaciones" ? (
            <div className="grid gap-2 px-4 pb-4 sm:grid-cols-2 sm:px-5">
              {quality.map((group) => (
                <CompactItem
                  key={group.node.id}
                  title={group.title}
                  node={group.node}
                  onSelect={() => setSelected(group.node)}
                />
              ))}
            </div>
          ) : tab === "insumos" ? (
            <div className="grid gap-2 px-4 pb-4 sm:grid-cols-2 lg:grid-cols-3 sm:px-5">
              {inputs.map((group) => (
                <CompactItem
                  key={group.batch.id}
                  title={group.title}
                  node={group.batch}
                  extra={group.supplier ? `Proveedor: ${group.supplier.label}` : undefined}
                  onSelect={() => setSelected(group.batch)}
                />
              ))}
            </div>
          ) : (
            <ol className="px-4 py-4 sm:px-5">
              {rows.map((row, i) => (
                <TimelineItem
                  key={`${row.node.type}-${row.node.id}-${row.node.relation ?? i}`}
                  row={row}
                  last={i === rows.length - 1}
                  highlighted={row.node.id === highlightedId}
                  onSelect={() => openRow(row, i === 0)}
                />
              ))}
            </ol>
          )}
        </section>
      </div>
      {selected && (
        <Modal
          open
          title={selected.label}
          onClose={() => setSelected(null)}
          wide
          footer={
            <button
              type="button"
              onClick={() => router.push(entityHref(selected.type, selected.id.split(",")[0]))}
              className="inline-flex items-center justify-center rounded-full bg-zhenda px-4 py-2 text-sm font-medium text-white"
            >
              Ver ficha completa
            </button>
          }
        >
          <TraceNodePreview node={selected} />
        </Modal>
      )}
    </>
  );
}

function SummaryBar({ summary, mode }: { summary: ReturnType<typeof journeySummary>; mode: ExplorerMode }) {
  return (
    <div className="mt-4 flex flex-wrap items-center gap-4 rounded-xl bg-emerald-50/70 px-3 py-3">
      <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl ring-1 ring-emerald-100">
        <Image src={EXPLORER_PHOTOS.blueberries} alt="" fill className="object-cover" sizes="56px" />
      </span>
      <SummaryStat icon={CalendarDays} label="Campaña" value={summary.campaign} />
      {mode !== "destino" && summary.origin && (
        <SummaryStat icon={MapPin} label="Parcela" value={summary.origin} />
      )}
      {mode !== "destino" && summary.harvestDate && (
        <SummaryStat icon={Leaf} label="Cosecha" value={summary.harvestDate} hint={summary.harvestRelative} />
      )}
      {mode !== "destino" && summary.crates && <SummaryStat icon={Trees} label="Jabas" value={summary.crates} />}
      {mode !== "origen" && summary.qr && <SummaryStat icon={QrCode} label="QR clamshells" value={summary.qr} />}
      {mode !== "origen" && summary.pallet && <SummaryStat icon={Warehouse} label="Pallet" value={summary.pallet} />}
      {mode !== "origen" && summary.container && <SummaryStat icon={Container} label="Contenedor" value={summary.container} />}
    </div>
  );
}

function SummaryStat({
  icon: Icon,
  label,
  value,
  hint,
}: {
  icon: typeof Leaf;
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <div className="min-w-[7.5rem]">
      <p className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide text-slate-400">
        <Icon className="h-3 w-3 text-zhenda" />
        {label}
      </p>
      <p className="text-sm font-medium text-slate-800">{value}</p>
      {hint && <p className="text-[11px] text-slate-400">{hint}</p>}
    </div>
  );
}

function TimelineItem({
  row,
  last,
  highlighted,
  onSelect,
}: {
  row: TimelineRow;
  last: boolean;
  highlighted: boolean;
  onSelect: () => void;
}) {
  const Icon = NODE_ICON[row.node.type] ?? Package;
  const photo = nodePhoto(row.node.type);

  return (
    <li className="flex gap-3">
      <div className="flex w-4 shrink-0 flex-col items-center">
        <span className={`mt-4 h-2.5 w-2.5 rounded-full ${highlighted ? "bg-zhenda ring-4 ring-emerald-100" : "bg-emerald-400"}`} />
        {!last && <span className="w-px flex-1 bg-emerald-200" />}
      </div>
      <button
        type="button"
        onClick={onSelect}
        className={`mb-2 flex min-w-0 flex-1 items-center gap-3 rounded-xl border px-3 py-2.5 text-left transition ${
          highlighted
            ? "border-emerald-200 bg-emerald-50/80"
            : "border-slate-100 bg-white hover:border-emerald-200 hover:bg-emerald-50/40"
        }`}
      >
        <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl ring-1 ring-black/5">
          <Image src={photo} alt="" fill className="object-cover" sizes="56px" />
          <span className="absolute bottom-1 right-1 flex h-5 w-5 items-center justify-center rounded-md bg-white/90 text-zhenda shadow-sm">
            <Icon className="h-3 w-3" />
          </span>
        </span>
        <span className="min-w-0 flex-1">
          <span className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide text-slate-400">
            <Icon className="h-3 w-3 text-zhenda" />
            {entityTypeLabel(row.node.type)}
          </span>
          <span className="block truncate text-sm font-semibold text-slate-900">{row.node.label}</span>
          {row.node.subtitle && <span className="block truncate text-xs text-slate-500">{row.node.subtitle}</span>}
        </span>
        {row.metric && (
          <span className="hidden min-w-[9rem] max-w-[14rem] text-xs text-slate-600 lg:block">
            {row.metric}
          </span>
        )}
        <span className="hidden shrink-0 text-right sm:block">
          {row.when && (
            <>
              {row.whenLabel && (
                <span className="block text-[10px] font-semibold uppercase tracking-wide text-slate-400">{row.whenLabel}</span>
              )}
              <span className="block text-xs text-slate-600">{row.when}</span>
            </>
          )}
        </span>
        {row.node.sourceSystem && (
          <span className="shrink-0 rounded-full border border-emerald-300 px-2 py-0.5 text-[10px] font-medium text-zhenda">
            {row.node.sourceSystem}
          </span>
        )}
      </button>
    </li>
  );
}

function SidePill({
  active,
  icon: Icon,
  label,
  onClick,
}: {
  active: boolean;
  icon: typeof Package;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium ${
        active ? "bg-zhenda text-white" : "border border-zhenda/35 bg-white text-zhenda hover:bg-emerald-50"
      }`}
    >
      <Icon className="h-3.5 w-3.5" />
      {label}
    </button>
  );
}

function CompactItem({
  title,
  node,
  extra,
  onSelect,
}: {
  title: string;
  node: TraceNode;
  extra?: string;
  onSelect: () => void;
}) {
  const Icon = NODE_ICON[node.type] ?? Package;
  const photo = nodePhoto(node.type);
  return (
    <button
      type="button"
      onClick={onSelect}
      className="flex items-center gap-3 rounded-xl border border-emerald-100 bg-white px-3 py-2 text-left hover:border-emerald-200 hover:bg-emerald-50/40"
    >
      <span className="relative h-11 w-11 shrink-0 overflow-hidden rounded-lg">
        <Image src={photo} alt="" fill className="object-cover" sizes="44px" />
        <span className="absolute bottom-0.5 right-0.5 flex h-4 w-4 items-center justify-center rounded bg-white/90 text-zhenda">
          <Icon className="h-2.5 w-2.5" />
        </span>
      </span>
      <span className="min-w-0">
        <span className="block text-[10px] font-semibold uppercase tracking-wide text-slate-400">{title}</span>
        <span className="block truncate text-sm font-medium text-zhenda">{node.label}</span>
        {(extra || node.subtitle) && (
          <span className="block truncate text-[11px] text-slate-500">{extra ?? node.subtitle}</span>
        )}
      </span>
    </button>
  );
}

export function ExplorerModeToggle({
  mode,
  onChange,
}: {
  mode: ExplorerMode;
  onChange: (m: ExplorerMode) => void;
}) {
  const items: { id: ExplorerMode; label: string; icon: typeof ArrowLeft }[] = [
    { id: "origen", label: "Ver origen", icon: ArrowLeft },
    { id: "destino", label: "Ver destino", icon: ArrowRight },
    { id: "relaciones", label: "Ver relaciones", icon: GitBranch },
  ];
  return (
    <div className="inline-flex flex-wrap gap-2">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onChange(item.id)}
            className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-medium ${
              mode === item.id
                ? "bg-zhenda text-white shadow-sm"
                : "border border-zhenda/35 bg-white text-zhenda hover:bg-emerald-50"
            }`}
          >
            <Icon className="h-3.5 w-3.5" />
            {item.label}
          </button>
        );
      })}
    </div>
  );
}

export function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">{label}</p>
      <div className="mt-1 text-sm text-slate-900">{children}</div>
    </div>
  );
}

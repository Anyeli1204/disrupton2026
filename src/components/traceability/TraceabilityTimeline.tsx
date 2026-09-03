"use client";

import { TraceNodePreview } from "@/components/traceability/TraceNodePreview";
import { Modal } from "@/components/ui/Modal";
import { entityHref } from "@/lib/queries";
import { entityTypeLabel } from "@/lib/format";
import type { TraceInputGroup, TraceMode, TraceNode, TraceViewModel } from "@/types";
import { ArrowDown, ArrowUp, Leaf, Package } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function TraceModeToggle({
  mode,
  onChange,
}: {
  mode: TraceMode;
  onChange: (m: TraceMode) => void;
}) {
  return (
    <div className="inline-flex rounded-lg border border-slate-200 bg-white p-1 text-sm">
      <button
        type="button"
        onClick={() => onChange("inversa")}
        className={`rounded-md px-3 py-1.5 ${mode === "inversa" ? "bg-zhenda text-white" : "text-slate-600"}`}
      >
        ← Trazabilidad inversa
      </button>
      <button
        type="button"
        onClick={() => onChange("adelante")}
        className={`rounded-md px-3 py-1.5 ${mode === "adelante" ? "bg-zhenda text-white" : "text-slate-600"}`}
      >
        Trazabilidad hacia adelante →
      </button>
    </div>
  );
}

export function TraceabilityTimeline({
  view,
}: {
  view: TraceViewModel;
  mode?: TraceMode;
  nodes?: TraceNode[];
}) {
  const [selected, setSelected] = useState<TraceNode | null>(null);
  const router = useRouter();

  return (
    <>
      {view.layout === "product-inverse" ? (
        <div className="grid gap-4 lg:grid-cols-5">
          <section className={`rounded-xl border border-slate-200 bg-white p-5 ${view.inputs.length ? "lg:col-span-3" : "lg:col-span-5"}`}>
            <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-900">
              <Leaf className="h-4 w-4 text-zhenda" />
              Origen del producto
            </h2>
            <Chain nodes={view.productChain} direction="up" onSelect={setSelected} />
          </section>
          {view.inputs.length > 0 && (
            <section className="rounded-xl border border-slate-200 bg-white p-5 lg:col-span-2">
              <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-900">
                <Package className="h-4 w-4 text-zhenda" />
                Insumos utilizados
              </h2>
              <p className="mb-3 text-xs text-slate-500">Materiales del empaque. No forman parte del origen del arándano.</p>
              <div className="space-y-3">
                {view.inputs.map((group) => (
                  <InputCard key={group.batch.id} group={group} onSelect={setSelected} />
                ))}
              </div>
            </section>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {view.layout === "input-forward" && (
            <p className="text-sm text-slate-600">
              Trazabilidad hacia adelante del insumo: lotes de empaque que lo utilizaron y sus destinos.
            </p>
          )}
          <section className="rounded-xl border border-slate-200 bg-white p-5">
            <Chain
              nodes={
                view.layout === "input-forward" || view.layout === "product-forward"
                  ? [...view.productChain, ...view.destinationChain]
                  : view.productChain
              }
              direction="down"
              onSelect={setSelected}
            />
          </section>
        </div>
      )}
      <TraceNodeModal
        node={selected}
        onClose={() => setSelected(null)}
        onOpen={() => {
          if (!selected) return;
          router.push(entityHref(selected.type, selected.id.split(",")[0]));
        }}
      />
    </>
  );
}

function Chain({
  nodes,
  direction,
  onSelect,
}: {
  nodes: TraceNode[];
  direction: "up" | "down";
  onSelect: (node: TraceNode) => void;
}) {
  return (
    <ol>
      {nodes.map((node, i) => (
        <li key={`${node.type}-${node.id}-${i}`} className="relative flex gap-4">
          <div className="flex w-6 flex-col items-center">
            <span className={`mt-2 h-3 w-3 rounded-full ${node.isOrigin ? "bg-zhenda ring-4 ring-emerald-100" : "bg-zhenda"}`} />
            {i < nodes.length - 1 && <span className="w-px flex-1 bg-emerald-200" />}
          </div>
          <div className="min-w-0 flex-1 pb-3">
            {i > 0 && node.relation && (
              <p className="mb-1 flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                {direction === "up" ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                {node.relation}
              </p>
            )}
            <NodeButton node={node} onSelect={onSelect} />
          </div>
        </li>
      ))}
    </ol>
  );
}

function InputCard({ group, onSelect }: { group: TraceInputGroup; onSelect: (node: TraceNode) => void }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-3">
      <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">{group.title}</p>
      <button type="button" onClick={() => onSelect(group.batch)} className="mt-1 block text-left">
        <p className="font-medium text-zhenda hover:underline">{group.batch.label}</p>
        {group.batch.subtitle && <p className="text-xs text-slate-500">{group.batch.subtitle}</p>}
      </button>
      {group.supplier && (
        <button type="button" onClick={() => onSelect(group.supplier!)} className="mt-2 block text-left text-sm text-slate-700">
          <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">Suministrado por</span>
          <span className="mt-0.5 block font-medium text-zhenda hover:underline">{group.supplier.label}</span>
          {group.supplier.subtitle && <span className="block text-xs text-slate-500">{group.supplier.subtitle}</span>}
        </button>
      )}
    </div>
  );
}

function NodeButton({ node, onSelect }: { node: TraceNode; onSelect: (node: TraceNode) => void }) {
  return (
    <button
      type="button"
      onClick={() => onSelect(node)}
      className={`w-full rounded-lg border px-4 py-3 text-left ${
        node.isOrigin ? "border-zhenda bg-emerald-50" : "border-slate-200 bg-slate-50/70 hover:border-zhenda/40 hover:bg-emerald-50/50"
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">{entityTypeLabel(node.type)}</p>
        {node.isOrigin && (
          <span className="rounded-full bg-zhenda px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
            Punto de partida
          </span>
        )}
      </div>
      <p className="font-medium text-slate-900">{node.label}</p>
      {node.subtitle && <p className="text-xs text-slate-500">{node.subtitle}</p>}
    </button>
  );
}

function TraceNodeModal({
  node,
  onClose,
  onOpen,
}: {
  node: TraceNode | null;
  onClose: () => void;
  onOpen: () => void;
}) {
  if (!node) return null;
  return (
    <Modal
      open={!!node}
      title={node.label}
      onClose={onClose}
      wide
      footer={
        <button type="button" onClick={onOpen} className="rounded-lg bg-zhenda px-4 py-2 text-sm font-medium text-white">
          Ver ficha completa
        </button>
      }
    >
      <TraceNodePreview node={node} />
    </Modal>
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

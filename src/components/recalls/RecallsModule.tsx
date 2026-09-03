"use client";

import { DataTable } from "@/components/ui/DataTable";
import { EntityLink } from "@/components/ui/EntityLink";
import { Modal } from "@/components/ui/Modal";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Field } from "@/components/traceability/TraceabilityTimeline";
import { RECALL_STATUS_LABEL } from "@/lib/constants";
import { formatDateTime } from "@/lib/format";
import { relatedDestinationsSummary } from "@/lib/queries";
import { useZhendaStore } from "@/lib/store";
import type { Recall, RecallStatus } from "@/types";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function RecallsList() {
  const store = useZhendaStore();
  const rows = store.allRecalls();
  const router = useRouter();
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold">Retiros</h1>
        <p className="text-sm text-slate-500">Retiros específicos de cajas o pallets, no necesariamente de todo el envío.</p>
      </div>
      <DataTable<Recall>
        rows={rows}
        rowKey={(r) => r.id}
        onRowClick={(r) => router.push(`/retiros/${r.id}`)}
        columns={[
          { key: "id", header: "ID", render: (r) => <EntityLink type="recall" id={r.id} /> },
          { key: "lot", header: "Lote", render: (r) => <EntityLink type="packingLot" id={r.packingLotId} /> },
          { key: "motive", header: "Motivo", render: (r) => r.motive },
          { key: "boxes", header: "Cajas", render: (r) => `${r.boxFrom} a ${r.boxTo}` },
          { key: "prog", header: "Progreso", render: (r) => `${r.locatedBoxes} / ${r.totalBoxes}` },
          { key: "st", header: "Estado", render: (r) => <StatusBadge status={r.status} /> },
        ]}
      />
    </div>
  );
}

export function RecallDetail({ recallId }: { recallId: string }) {
  const store = useZhendaStore();
  const recall = store.getRecall(recallId);
  const [statusOpen, setStatusOpen] = useState(false);
  const [updateOpen, setUpdateOpen] = useState(false);
  const [text, setText] = useState("");
  if (!recall) return <p>Retiro no encontrado.</p>;
  const pct = (recall.locatedBoxes / recall.totalBoxes) * 100;
  const dests = relatedDestinationsSummary(recall.packingLotId);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-400">Retiro</p>
          <h1 className="text-2xl font-semibold">{recall.id}</h1>
          <div className="mt-2">
            <StatusBadge status={recall.status} />
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href={`/destinos/${recall.packingLotId}`} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm">
            Identificar destinos
          </Link>
          <Link href={`/lotes/${recall.packingLotId}`} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm">
            Ver productos afectados
          </Link>
          <Link href={`/trazabilidad?q=${recall.packingLotId}`} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm">
            Ver trazabilidad
          </Link>
          <button type="button" onClick={() => setUpdateOpen(true)} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm">
            Agregar actualización
          </button>
          <button type="button" onClick={() => setStatusOpen(true)} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm">
            Cambiar estado
          </button>
          <button type="button" onClick={() => store.setRecallStatus(recall.id, "cerrado")} className="rounded-lg bg-slate-800 px-3 py-2 text-sm text-white">
            Cerrar retiro
          </button>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <section className="rounded-xl border border-slate-200 bg-white p-5 lg:col-span-2">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Motivo">{recall.motive}</Field>
            <Field label="Lote">
              <EntityLink type="packingLot" id={recall.packingLotId} />
            </Field>
            <Field label="Pallet">
              <EntityLink type="pallet" id={recall.palletId} />
            </Field>
            <Field label="Cajas">
              {recall.boxFrom} a {recall.boxTo}
            </Field>
            <Field label="Total">{recall.totalBoxes} cajas</Field>
          </div>
          <div className="mt-6">
            <h2 className="text-sm font-semibold">Distribución</h2>
            <ul className="mt-3 space-y-2">
              {recall.distribution.map((d) => (
                <li key={d.supermarketId} className="flex justify-between rounded-lg border border-slate-100 px-3 py-2 text-sm">
                  <span>{d.supermarketName}</span>
                  <span>
                    {d.located}/{d.boxes} cajas localizadas
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-6">
            <h2 className="text-sm font-semibold">Actualizaciones</h2>
            <ul className="mt-3 space-y-2">
              {recall.updates.map((u) => (
                <li key={u.id} className="rounded-lg bg-slate-50 p-3 text-sm">
                  <p className="text-xs text-slate-500">
                    {u.author} · {formatDateTime(u.at)}
                  </p>
                  <p className="mt-1">{u.text}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>
        <aside className="space-y-4">
          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <h2 className="text-sm font-semibold">Progreso</h2>
            <p className="mt-2 text-2xl font-semibold">
              {recall.locatedBoxes} / {recall.totalBoxes} cajas localizadas
            </p>
            <div className="mt-3">
              <ProgressBar value={pct} />
            </div>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <h2 className="text-sm font-semibold">Supermercados con producto relacionado</h2>
            <ul className="mt-2 space-y-1 text-sm">
              {dests.map(({ supermarket, destination }) => (
                <li key={destination.id} className="flex justify-between">
                  <span>{supermarket?.name}</span>
                  <span className="text-slate-500">{destination.boxCount} cajas</span>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>

      <Modal open={statusOpen} title="Estado del retiro" onClose={() => setStatusOpen(false)}>
        <div className="grid gap-2">
          {(Object.keys(RECALL_STATUS_LABEL) as RecallStatus[]).map((s) => (
            <button key={s} type="button" className="rounded-lg border border-slate-200 px-3 py-2 text-left" onClick={() => { store.setRecallStatus(recall.id, s); setStatusOpen(false); }}>
              <StatusBadge status={s} />
            </button>
          ))}
        </div>
      </Modal>
      <Modal
        open={updateOpen}
        title="Agregar actualización"
        onClose={() => setUpdateOpen(false)}
        footer={
          <button
            type="button"
            className="rounded-lg bg-zhenda px-4 py-2 text-sm text-white"
            onClick={() => {
              if (text.trim()) store.addRecallUpdate(recall.id, text.trim());
              setText("");
              setUpdateOpen(false);
            }}
          >
            Guardar
          </button>
        }
      >
        <textarea value={text} onChange={(e) => setText(e.target.value)} className="h-28 w-full rounded-lg border border-slate-200 p-3 text-sm" />
      </Modal>
    </div>
  );
}

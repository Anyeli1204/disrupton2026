"use client";

import { DataTable } from "@/components/ui/DataTable";
import { EntityLink } from "@/components/ui/EntityLink";
import { Modal } from "@/components/ui/Modal";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Field } from "@/components/traceability/TraceabilityTimeline";
import { CLAIM_STATUS_LABEL, CLAIM_TYPE_LABEL, LOT_STATUS_LABEL } from "@/lib/constants";
import { formatDate, formatDateTime } from "@/lib/format";
import { investigationForLot } from "@/lib/queries";
import { useZhendaStore } from "@/lib/store";
import type { Claim, ClaimStatus, LotStatus } from "@/types";
import { Camera, FileText } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

export function ClaimsInbox() {
  const store = useZhendaStore();
  const rows = store.allClaims();
  const router = useRouter();

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold">Reclamos e incidencias</h1>
        <p className="text-sm text-slate-500">Bandeja de reclamos reportados por supermercados e importadores.</p>
      </div>
      <DataTable<Claim>
        rows={rows}
        rowKey={(r) => r.id}
        onRowClick={(r) => router.push(`/reclamos/${r.id}`)}
        columns={[
          { key: "id", header: "ID", render: (r) => <EntityLink type="claim" id={r.id} /> },
          { key: "date", header: "Fecha", render: (r) => formatDate(r.date) },
          { key: "client", header: "Cliente", render: (r) => r.client },
          { key: "country", header: "País", render: (r) => r.country },
          { key: "lot", header: "Lote", render: (r) => <EntityLink type="packingLot" id={r.packingLotId} /> },
          { key: "type", header: "Tipo", render: (r) => CLAIM_TYPE_LABEL[r.type] },
          { key: "sev", header: "Severidad", render: (r) => <StatusBadge status={r.severity} /> },
          { key: "st", header: "Estado", render: (r) => <StatusBadge status={r.status} /> },
          { key: "resp", header: "Responsable", render: (r) => r.responsible },
        ]}
      />
    </div>
  );
}

export function ClaimDetail({ claim }: { claim: Claim }) {
  const store = useZhendaStore();
  const router = useRouter();
  const live = store.allClaims().find((c) => c.id === claim.id) ?? claim;
  const inv = useMemo(() => investigationForLot(claim.packingLotId), [claim.packingLotId]);
  const [replyOpen, setReplyOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);
  const [lotOpen, setLotOpen] = useState(false);
  const [text, setText] = useState("");
  const lotStatus = store.getLotStatus(claim.packingLotId, inv?.lot.status ?? "autorizado");

  function startRecall() {
    if (!inv) return;
    const recall = store.startRecall({
      packingLotId: claim.packingLotId,
      claimId: claim.id,
      palletId: inv.pallet?.id ?? "",
      boxFrom: "C-4001",
      boxTo: "C-4024",
      totalBoxes: claim.affectedBoxes,
    });
    router.push(`/retiros/${recall.id}`);
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-400">Reclamo</p>
          <h1 className="text-2xl font-semibold">{live.id}</h1>
          <div className="mt-2 flex flex-wrap gap-2">
            <StatusBadge status={live.severity} />
            <StatusBadge status={live.status} />
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href={`/trazabilidad?q=${live.packingLotId}`} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm">
            Ver trazabilidad
          </Link>
          {inv?.agricultural && (
            <Link href={`/proveedores/${inv.agricultural.id}`} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm">
              Ver proveedor
            </Link>
          )}
          {inv?.lot.qualityControlIds[0] && (
            <Link href={`/calidad/${inv.lot.qualityControlIds[0]}`} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm">
              Ver calidad
            </Link>
          )}
          <Link href={`/destinos/${live.packingLotId}`} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm">
            Ver otros destinos
          </Link>
          <button type="button" onClick={() => setLotOpen(true)} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm">
            Cambiar estado del lote
          </button>
          <button type="button" onClick={startRecall} className="rounded-lg bg-red-700 px-3 py-2 text-sm font-medium text-white">
            Iniciar retiro
          </button>
          <button type="button" onClick={() => setReplyOpen(true)} className="rounded-lg bg-zhenda px-3 py-2 text-sm font-medium text-white">
            Responder reclamo
          </button>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <section className="space-y-4 rounded-xl border border-slate-200 bg-white p-5 lg:col-span-2">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Cliente">{live.client}</Field>
            <Field label="País">{live.country}</Field>
            <Field label="Lote">
              <EntityLink type="packingLot" id={live.packingLotId} />
            </Field>
            <Field label="Fecha">{formatDate(live.date)}</Field>
            <Field label="Problema">{live.problem}</Field>
            <Field label="Cantidad afectada">{live.affectedBoxes} cajas</Field>
            <Field label="Tipo">{CLAIM_TYPE_LABEL[live.type]}</Field>
            <Field label="Responsable">{live.responsible}</Field>
          </div>
          <Field label="Descripción">
            <p className="text-sm leading-6 text-slate-700">{live.description}</p>
          </Field>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Fotografías / evidencias</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {live.photos.map((p) => (
                <div key={p.id} className="flex h-28 w-40 flex-col items-center justify-center rounded-lg bg-slate-100 text-slate-400">
                  <Camera className="h-5 w-5" />
                  <span className="mt-1 text-[11px]">{p.label}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Archivos adjuntos</p>
            <ul className="mt-2 space-y-1">
              {live.attachments.map((a) => (
                <li key={a.id} className="flex items-center gap-2 text-sm text-slate-700">
                  <FileText className="h-4 w-4 text-zhenda" /> {a.name}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Comentarios</p>
              <button type="button" onClick={() => setStatusOpen(true)} className="text-xs text-zhenda">
                Cambiar estado del reclamo
              </button>
            </div>
            <ul className="mt-3 space-y-3">
              {live.comments.map((c) => (
                <li key={c.id} className="rounded-lg bg-slate-50 p-3">
                  <p className="text-xs text-slate-500">
                    {c.author} · {formatDateTime(c.at)}
                  </p>
                  <p className="mt-1 text-sm">{c.text}</p>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Historial de cambios</p>
            <ul className="mt-2 space-y-1 text-sm text-slate-600">
              {live.history.map((h) => (
                <li key={h.id}>
                  {formatDateTime(h.at)} — {h.action} ({h.author})
                </li>
              ))}
            </ul>
          </div>
        </section>

        <aside className="space-y-4">
          <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-5">
            <h2 className="text-sm font-semibold">Investigación automática</h2>
            {inv && (
              <dl className="mt-3 space-y-2 text-sm">
                <Row k="Lote afectado" v={<EntityLink type="packingLot" id={inv.lot.id} />} extra={<StatusBadge status={lotStatus} />} />
                <Row k="Proveedor agrícola" v={inv.agricultural ? <EntityLink type="supplier" id={inv.agricultural.id}>{inv.agricultural.name}</EntityLink> : "—"} />
                <Row k="Parcela" v={inv.plot ? <EntityLink type="plot" id={inv.plot.id}>{inv.plot.code}</EntityLink> : "—"} />
                <Row k="Cosecha" v={inv.harvest ? <EntityLink type="harvest" id={inv.harvest.id} /> : "—"} />
                <Row k="Lote de procesamiento" v={inv.processing ? <EntityLink type="processingLot" id={inv.processing.id} /> : "—"} />
                <Row k="Lote de empaque" v={<EntityLink type="packingLot" id={inv.lot.id} />} />
                <Row k="Proveedor de clamshell" v={inv.clamshellSupplier ? <EntityLink type="supplier" id={inv.clamshellSupplier.id}>{inv.clamshellSupplier.name}</EntityLink> : "—"} />
                <Row k="Pallet" v={inv.pallet ? <EntityLink type="pallet" id={inv.pallet.id} /> : "—"} />
                <Row k="Contenedor" v={inv.container ? <EntityLink type="container" id={inv.container.id} /> : "—"} />
                <Row k="Booking" v={inv.booking ? <EntityLink type="booking" id={inv.booking.id} /> : "—"} />
              </dl>
            )}
          </div>
          {inv?.impact && (
            <div className="rounded-xl border border-red-200 bg-red-50/60 p-5">
              <h2 className="text-sm font-semibold text-red-900">Alcance del insumo de empaque</h2>
              <p className="mt-1 text-xs text-red-800/80">
                El lote de clamshell {inv.clamshell?.id} se relaciona con todos los destinos que lo utilizaron.
              </p>
              <dl className="mt-3 space-y-2 text-sm">
                <Row k="Insumo" v={inv.clamshell ? <EntityLink type="clamshellBatch" id={inv.clamshell.id} /> : "—"} />
                <Row k="Lotes de empaque" v={`${inv.impact.lots.length} lotes`} />
                <Row k="Pallets" v={`${inv.impact.palletIds.length} pallets`} />
                <Row k="Contenedores" v={`${inv.impact.containerIds.length} contenedores`} />
                <Row k="Supermercados" v={`${inv.impact.supermarketIds.length} potencialmente afectados`} />
              </dl>
              <ul className="mt-3 space-y-1 text-sm">
                {inv.impact.lots.map((l) => (
                  <li key={l.id}>
                    <EntityLink type="packingLot" id={l.id} />
                  </li>
                ))}
              </ul>
              {inv.clamshell && (
                <Link href={`/trazabilidad?q=${inv.clamshell.id}`} className="mt-3 inline-block text-xs font-medium text-zhenda">
                  Explorar el lote de clamshell →
                </Link>
              )}
            </div>
          )}
          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <h2 className="text-sm font-semibold">Otros productos relacionados</h2>
            <ul className="mt-2 space-y-1 text-sm">
              {inv?.relatedLots.map((l) => (
                <li key={l.id}>
                  <EntityLink type="packingLot" id={l.id} /> <span className="text-xs text-slate-500">{l.variety}</span>
                </li>
              ))}
              {inv?.relatedLots.length === 0 && <li className="text-slate-500">Sin otros lotes del mismo insumo.</li>}
            </ul>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <h2 className="text-sm font-semibold">Otros destinos potencialmente afectados</h2>
            <p className="mt-1 text-xs text-slate-500">Este lote también fue distribuido a:</p>
            <ul className="mt-2 space-y-2 text-sm">
              {inv?.dests.map(({ destination, supermarket }) => (
                <li key={destination.id} className="flex justify-between">
                  <span>{supermarket?.name}</span>
                  <span className="text-slate-500">{destination.boxCount} cajas</span>
                </li>
              ))}
            </ul>
            <Link href={`/destinos/${live.packingLotId}`} className="mt-3 inline-block text-xs font-medium text-zhenda">
              Identificar todos los destinos →
            </Link>
          </div>
        </aside>
      </div>

      <Modal open={replyOpen} title="Responder reclamo" onClose={() => setReplyOpen(false)}
        footer={
          <button
            type="button"
            className="rounded-lg bg-zhenda px-4 py-2 text-sm text-white"
            onClick={() => {
              if (text.trim()) store.addClaimComment(live.id, text.trim());
              setText("");
              setReplyOpen(false);
            }}
          >
            Enviar respuesta
          </button>
        }
      >
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="h-32 w-full rounded-lg border border-slate-200 p-3 text-sm"
          placeholder="Escriba la respuesta para el importador o supermercado…"
        />
      </Modal>

      <Modal open={statusOpen} title="Estado del reclamo" onClose={() => setStatusOpen(false)}>
        <div className="grid gap-2">
          {(Object.keys(CLAIM_STATUS_LABEL) as ClaimStatus[]).map((s) => (
            <button key={s} type="button" className="rounded-lg border border-slate-200 px-3 py-2 text-left" onClick={() => { store.setClaimStatus(live.id, s); setStatusOpen(false); }}>
              <StatusBadge status={s} />
            </button>
          ))}
        </div>
      </Modal>

      <Modal open={lotOpen} title="Cambiar estado del lote" onClose={() => setLotOpen(false)}>
        <div className="grid gap-2">
          {(Object.keys(LOT_STATUS_LABEL) as LotStatus[]).map((s) => (
            <button key={s} type="button" className="rounded-lg border border-slate-200 px-3 py-2 text-left" onClick={() => { store.setLotStatus(live.packingLotId, s); setLotOpen(false); }}>
              <StatusBadge status={s} />
            </button>
          ))}
        </div>
      </Modal>
    </div>
  );
}

function Row({ k, v, extra }: { k: string; v: React.ReactNode; extra?: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-2">
      <dt className="text-slate-500">{k}</dt>
      <dd className="flex items-center gap-2 text-right font-medium">{v}{extra}</dd>
    </div>
  );
}

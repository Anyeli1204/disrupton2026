"use client";

import { DataSourceBadge, SourcedValue } from "@/components/ui/DataSourceBadge";
import { DocumentCard } from "@/components/ui/DocumentCard";
import { EntityLink } from "@/components/ui/EntityLink";
import { Modal } from "@/components/ui/Modal";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Tabs } from "@/components/ui/Tabs";
import { Field } from "@/components/traceability/TraceabilityTimeline";
import { LOT_STATUS_LABEL } from "@/lib/constants";
import { formatDate, formatNumber } from "@/lib/format";
import { lotContext } from "@/lib/queries";
import { useZhendaStore } from "@/lib/store";
import type { LotStatus, PackingLot } from "@/types";
import { Camera } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

const TABS = [
  { id: "resumen", label: "Resumen" },
  { id: "origen", label: "Origen" },
  { id: "procesamiento", label: "Procesamiento" },
  { id: "empaque", label: "Empaque" },
  { id: "calidad", label: "Calidad" },
  { id: "logistica", label: "Logística" },
  { id: "destinos", label: "Destinos" },
  { id: "incidencias", label: "Incidencias" },
  { id: "documentos", label: "Documentos" },
];

export function LotDetail({ lot }: { lot: PackingLot }) {
  const [tab, setTab] = useState("resumen");
  const [statusOpen, setStatusOpen] = useState(false);
  const store = useZhendaStore();
  const router = useRouter();
  const ctx = useMemo(() => lotContext(lot), [lot]);
  const status = store.getLotStatus(lot.id, lot.status);

  function startRecall() {
    const recall = store.startRecall({
      packingLotId: lot.id,
      palletId: lot.palletIds[0] ?? "",
      boxFrom: lot.boxFrom,
      boxTo: lot.boxTo,
      totalBoxes: lot.boxCount,
      claimId: lot.claimIds[0],
    });
    router.push(`/retiros/${recall.id}`);
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-400">Lote de empaque</p>
          <h1 className="text-2xl font-semibold">{lot.id}</h1>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <StatusBadge status={status} />
            <span className="text-sm text-slate-500">
              {ctx.product?.name} · {lot.variety} · {ctx.farm?.name} · {lot.destinationCountry}
            </span>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href={`/trazabilidad?q=${lot.id}`} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm">
            Ver trazabilidad
          </Link>
          <Link href={`/destinos/${lot.id}`} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm">
            Identificar destinos
          </Link>
          <button type="button" onClick={() => setStatusOpen(true)} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm">
            Cambiar estado
          </button>
          {(status === "observado" || status === "sujeto_a_retiro" || status === "bloqueado") && (
            <button type="button" onClick={startRecall} className="rounded-lg bg-red-700 px-3 py-2 text-sm font-medium text-white">
              Iniciar retiro
            </button>
          )}
        </div>
      </div>

      <Tabs tabs={TABS} value={tab} onChange={setTab} />

      <div className="rounded-xl border border-slate-200 bg-white p-5">
        {tab === "resumen" && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Field label="Producto">{ctx.product?.name}</Field>
            <Field label="Variedad">{lot.variety}</Field>
            <Field label="Peso">
              <SourcedValue data={lot.weightKg} render={(v) => `${v} kg`} />
            </Field>
            <Field label="Fecha cosecha">
              <SourcedValue data={lot.harvestDate} render={(v) => formatDate(String(v))} />
            </Field>
            <Field label="Fecha procesamiento">
              <SourcedValue data={lot.processingDate} render={(v) => formatDate(String(v))} />
            </Field>
            <Field label="Fecha empaque">
              <SourcedValue data={lot.packingDate} render={(v) => formatDate(String(v))} />
            </Field>
            <Field label="Empresa">Agroexportadora Valle Azul S.A.C.</Field>
            <Field label="Estado">
              <StatusBadge status={status} />
            </Field>
            <Field label="Destino principal">{lot.destinationCountry}</Field>
          </div>
        )}

        {tab === "origen" && (
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Fundo">
              {ctx.farm ? (
                <span>
                  <EntityLink type="farm" id={ctx.farm.id}>{ctx.farm.name}</EntityLink>
                  <span className="block text-xs text-slate-500">{ctx.farm.region}</span>
                </span>
              ) : "—"}
            </Field>
            <Field label="Parcela">
              {ctx.plot ? <EntityLink type="plot" id={ctx.plot.id}>{ctx.plot.code}</EntityLink> : "—"}
            </Field>
            <Field label="Código de parcela">{ctx.plot?.code}</Field>
            <Field label="Proveedor agrícola">
              {ctx.agricultural ? <EntityLink type="supplier" id={ctx.agricultural.id}>{ctx.agricultural.name}</EntityLink> : "—"}
            </Field>
            <Field label="Código de cosecha">
              {ctx.harvest ? <EntityLink type="harvest" id={ctx.harvest.id} /> : "—"}
            </Field>
            <Field label="Fecha de cosecha">
              {ctx.harvest ? <SourcedValue data={ctx.harvest.date} render={(v) => formatDate(String(v))} /> : "—"}
            </Field>
            <Field label="Supervisor">{ctx.harvest?.supervisor}</Field>
            <Field label="Cuadrilla">
              {ctx.harvest?.crewId ? <EntityLink type="harvestCrew" id={ctx.harvest.crewId} /> : "—"}
            </Field>
            <Field label="Jabas relacionadas">
              {ctx.harvest ? (
                <EntityLink type="crate" id={ctx.harvest.crateFrom}>
                  {ctx.harvest.crateFrom} a {ctx.harvest.crateTo} ({ctx.harvest.crateCount})
                </EntityLink>
              ) : "—"}
            </Field>
          </div>
        )}

        {tab === "procesamiento" && ctx.processing && (
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Lote de procesamiento">
              <EntityLink type="processingLot" id={ctx.processing.id} />
            </Field>
            <Field label="Planta">{ctx.processing.plant}</Field>
            <Field label="Línea">{ctx.processing.line}</Field>
            <Field label="Fecha">
              <SourcedValue data={ctx.processing.date} render={(v) => formatDate(String(v))} />
            </Field>
            <Field label="Hora">{ctx.processing.time}</Field>
            <Field label="Cantidad recibida">{formatNumber(ctx.processing.kgReceived)} kg</Field>
          </div>
        )}

        {tab === "empaque" && (
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Lote de empaque">
              <EntityLink type="packingLot" id={lot.id} />
            </Field>
            <Field label="Línea de empaque">{lot.packingLine}</Field>
            <Field label="Fecha">
              <SourcedValue data={lot.packingDate} render={(v) => formatDate(String(v))} />
            </Field>
            <Field label="Clamshell utilizado">{ctx.material?.name ?? "Clamshell PET 125 g"}</Field>
            <Field label="Proveedor del clamshell">
              {ctx.clamshellSupplier ? (
                <EntityLink type="supplier" id={ctx.clamshellSupplier.id}>{ctx.clamshellSupplier.name}</EntityLink>
              ) : "—"}
            </Field>
            <Field label="Lote del clamshell">
              {ctx.clamshell ? <EntityLink type="clamshellBatch" id={ctx.clamshell.id} /> : "—"}
            </Field>
            <Field label="Cantidad de clamshells">{formatNumber(lot.clamshellCount)}</Field>
            <Field label="Lote de etiqueta">
              {ctx.labelLot ? <EntityLink type="inputLot" id={ctx.labelLot.id} /> : "—"}
            </Field>
            <Field label="Proveedor de etiquetas">
              {ctx.labelSupplier ? (
                <EntityLink type="supplier" id={ctx.labelSupplier.id}>{ctx.labelSupplier.name}</EntityLink>
              ) : "—"}
            </Field>
            <Field label="Lote de caja">
              {ctx.cartonLot ? <EntityLink type="inputLot" id={ctx.cartonLot.id} /> : "—"}
            </Field>
            <Field label="Proveedor de cajas">
              {ctx.cartonSupplier ? (
                <EntityLink type="supplier" id={ctx.cartonSupplier.id}>{ctx.cartonSupplier.name}</EntityLink>
              ) : "—"}
            </Field>
          </div>
        )}

        {tab === "calidad" && (
          <div className="space-y-4">
            {ctx.qcs.map((qc) => (
              <div key={qc.id} className="rounded-lg border border-slate-100 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <EntityLink type="qualityControl" id={qc.id} />
                  <StatusBadge status={qc.result.value} />
                </div>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <Field label="Tipo">{qc.type}</Field>
                  <Field label="Responsable">{qc.responsible}</Field>
                  <Field label="Fecha">
                    <SourcedValue data={qc.date} render={(v) => formatDate(String(v))} />
                  </Field>
                  <Field label="Resultado">
                    <span className="inline-flex items-center gap-1">
                      <StatusBadge status={qc.result.value} />
                      <DataSourceBadge source={qc.result.source} />
                    </span>
                  </Field>
                  <Field label="Firmeza">{qc.firmness}</Field>
                  <Field label="Apariencia">{qc.appearance}</Field>
                  <Field label="Condición">{qc.condition}</Field>
                  <Field label="Temperatura">{qc.temperature}</Field>
                </div>
                <p className="mt-3 text-sm text-slate-600">{qc.observations}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {qc.photos.map((p) => (
                    <div key={p.id} className="flex h-24 w-36 flex-col items-center justify-center rounded-lg bg-slate-100 text-slate-400">
                      <Camera className="h-5 w-5" />
                      <span className="mt-1 text-[11px]">{p.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            {ctx.qcs.length === 0 && <p className="text-sm text-slate-500">Sin controles registrados en el detalle.</p>}
          </div>
        )}

        {tab === "logistica" && (
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Cajas">
              <EntityLink type="box" id={lot.boxFrom}>
                {lot.boxFrom} a {lot.boxTo} ({lot.boxCount})
              </EntityLink>
            </Field>
            <Field label="Pallets">
              {lot.palletIds.map((id) => (
                <span key={id} className="mr-2">
                  <EntityLink type="pallet" id={id} />
                </span>
              ))}
            </Field>
            <Field label="Contenedor">
              {ctx.container ? (
                <span className="inline-flex items-center gap-1">
                  <EntityLink type="container" id={ctx.container.id} />
                  <DataSourceBadge source={ctx.container.departureDate.source} />
                </span>
              ) : "—"}
            </Field>
            <Field label="Booking">{ctx.booking ? <EntityLink type="booking" id={ctx.booking.id} /> : "—"}</Field>
            <Field label="Fecha despacho">
              {ctx.container ? <SourcedValue data={ctx.container.departureDate} render={(v) => formatDate(String(v))} /> : "—"}
            </Field>
            <Field label="Puerto salida">{ctx.container ? <SourcedValue data={ctx.container.departurePort} /> : "—"}</Field>
            <Field label="Puerto destino">{ctx.container ? <SourcedValue data={ctx.container.destinationPort} /> : "—"}</Field>
            <Field label="País">{ctx.container?.country}</Field>
          </div>
        )}

        {tab === "destinos" && (
          <div className="space-y-3">
            {ctx.dests.map(({ destination, supermarket, importer, cd }) => (
              <div key={destination.id} className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-slate-100 p-3">
                <div>
                  <p className="font-medium">{supermarket?.name}</p>
                  <p className="text-xs text-slate-500">
                    {importer?.name} · {cd?.code} · {destination.country}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm">{destination.boxCount} cajas</span>
                  <StatusBadge status={destination.status} />
                </div>
              </div>
            ))}
            <Link href={`/destinos/${lot.id}`} className="inline-block text-sm font-medium text-zhenda">
              Identificar todos los destinos →
            </Link>
          </div>
        )}

        {tab === "incidencias" && (
          <div className="space-y-3">
            {ctx.claims.map((c) => (
              <div key={c.id} className="flex items-center justify-between rounded-lg border border-slate-100 p-3">
                <div>
                  <EntityLink type="claim" id={c.id} />
                  <p className="text-sm text-slate-600">{c.problem}</p>
                </div>
                <StatusBadge status={c.status} />
              </div>
            ))}
            {ctx.claims.length === 0 && <p className="text-sm text-slate-500">Sin incidencias.</p>}
          </div>
        )}

        {tab === "documentos" && (
          <div className="grid gap-3 sm:grid-cols-2">
            {ctx.docs.map((d) => (
              <DocumentCard key={d.id} doc={d} />
            ))}
            {ctx.docs.length === 0 && <p className="text-sm text-slate-500">Sin documentos asociados.</p>}
          </div>
        )}
      </div>

      <Modal
        open={statusOpen}
        title="Cambiar estado del lote"
        onClose={() => setStatusOpen(false)}
        footer={
          <p className="text-xs text-slate-500">El cambio se guarda en este prototipo (localStorage) para el flujo de demostración.</p>
        }
      >
        <div className="grid gap-2">
          {(Object.keys(LOT_STATUS_LABEL) as LotStatus[]).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => {
                store.setLotStatus(lot.id, s);
                setStatusOpen(false);
              }}
              className="flex items-center justify-between rounded-lg border border-slate-200 px-3 py-2 text-left hover:bg-slate-50"
            >
              <StatusBadge status={s} />
              {status === s && <span className="text-xs text-zhenda">Actual</span>}
            </button>
          ))}
        </div>
      </Modal>
    </div>
  );
}

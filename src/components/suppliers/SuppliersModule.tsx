"use client";

import { DataTable } from "@/components/ui/DataTable";
import { EntityLink } from "@/components/ui/EntityLink";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Field } from "@/components/traceability/TraceabilityTimeline";
import { certifications } from "@/data";
import { SUPPLIER_TYPE_LABEL } from "@/lib/constants";
import { formatDate, formatNumber } from "@/lib/format";
import { getLotsBySupplier } from "@/lib/queries";
import { documents } from "@/data";
import type { Supplier, SupplierType } from "@/types";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { clamshellBatches, inputLots, suppliers } from "@/data";
import { Button } from "@/components/ui/Button";
import { PageHeader } from "@/components/ui/PageHeader";
import { SourcedValue } from "@/components/ui/DataSourceBadge";
import { Tabs } from "@/components/ui/Tabs";

export function SuppliersList() {
  const [type, setType] = useState<SupplierType | "all">("all");
  const router = useRouter();
  const rows = suppliers.filter((s) => (type === "all" ? true : s.type === type));
  const types: (SupplierType | "all")[] = ["all", "agricola", "clamshells", "etiquetas", "cajas", "pallets", "logistica", "otros"];

  return (
    <div className="space-y-4">
      <PageHeader
        title="Proveedores e insumos"
        description="Agrícolas, empaque, logística y otros insumos de la cadena."
      />
      <div className="flex flex-wrap gap-2">
        {types.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setType(t)}
            className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
              type === t ? "bg-zhenda text-white shadow-sm" : "bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-emerald-50"
            }`}
          >
            {t === "all" ? "Todos" : SUPPLIER_TYPE_LABEL[t]}
          </button>
        ))}
      </div>
      <DataTable<Supplier>
        rows={rows}
        rowKey={(r) => r.id}
        onRowClick={(r) => router.push(`/proveedores/${r.id}`)}
        columns={[
          { key: "name", header: "Proveedor", render: (r) => <EntityLink type="supplier" id={r.id}>{r.name}</EntityLink> },
          { key: "type", header: "Tipo", render: (r) => SUPPLIER_TYPE_LABEL[r.type] },
          { key: "prod", header: "Productos/servicios", render: (r) => r.productsServices },
          { key: "st", header: "Estado", render: (r) => <StatusBadge status={r.status} /> },
          { key: "last", header: "Última entrega", render: (r) => formatDate(r.lastDelivery) },
          { key: "lots", header: "Lotes relacionados", render: (r) => String(r.relatedLotIds.length) },
          { key: "inc", header: "Incidencias", render: (r) => String(r.incidentCount) },
        ]}
      />
    </div>
  );
}

export function SupplierDetail({ supplier }: { supplier: Supplier }) {
  const [tab, setTab] = useState("general");
  const lots = getLotsBySupplier(supplier.id);
  const batches = clamshellBatches.filter((b) => b.supplierId === supplier.id);
  const suppliedInputs = inputLots.filter((b) => b.supplierId === supplier.id);
  const certs = certifications.filter((c) => supplier.certificationIds.includes(c.id) || c.relatedEntityId === supplier.id);
  const docs = documents.filter((d) => d.relatedEntityId === supplier.id);
  const batch = batches[0];
  const inputLot = suppliedInputs[0];
  const inputView = Boolean(batch || inputLot);

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow={SUPPLIER_TYPE_LABEL[supplier.type]}
        title={supplier.name}
        description={supplier.code}
        meta={<StatusBadge status={supplier.status} />}
        actions={
          inputView ? (
            <Button variant="primary" href={`/trazabilidad?q=${batch?.id ?? inputLot?.id}`}>
              Explorar este insumo
            </Button>
          ) : undefined
        }
      />

      <Tabs
        tabs={[
          { id: "general", label: "Información general" },
          { id: "productos", label: "Productos suministrados" },
          { id: "lotes-insumo", label: "Lotes suministrados" },
          { id: "certs", label: "Certificaciones/documentos" },
          { id: "lotes", label: "Lotes de producto relacionados" },
          { id: "incidencias", label: "Incidencias" },
          { id: "historial", label: "Historial" },
        ]}
        value={tab}
        onChange={setTab}
      />

      <div className="zhenda-card p-5">
        {tab === "general" && (
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Código">{supplier.code}</Field>
            <Field label="Tipo">{SUPPLIER_TYPE_LABEL[supplier.type]}</Field>
            <Field label="Contacto">{supplier.contact}</Field>
            <Field label="Correo">{supplier.email}</Field>
            <Field label="Teléfono">{supplier.phone}</Field>
            <Field label="País">{supplier.country}</Field>
            <Field label="Productos/servicios">{supplier.productsServices}</Field>
            {supplier.type === "agricola" && supplier.id === "PROV-AGR-001" && <Field label="Parcelas">6</Field>}
            {supplier.type === "agricola" && (
              <Field label="Certificaciones">{certs.map((c) => c.name).join(", ") || "—"}</Field>
            )}
          </div>
        )}
        {tab === "productos" && (
          <p className="text-sm text-slate-700">{supplier.productsServices}</p>
        )}
        {tab === "lotes-insumo" && (
          <div className="space-y-3">
            {batches.map((b) => (
              <div key={b.id} className="rounded-2xl border border-emerald-100 bg-emerald-50/30 p-4">
                <p className="font-medium">
                  Lote <EntityLink type="clamshellBatch" id={b.id} />
                </p>
                <div className="mt-2 grid gap-2 sm:grid-cols-3 text-sm">
                  <span>Recepción: <SourcedValue data={b.receivedAt} render={(v) => formatDate(String(v))} /></span>
                  <span>Cantidad: {formatNumber(b.quantity)} unidades</span>
                  <StatusBadge status={b.status} />
                </div>
              </div>
            ))}
            {suppliedInputs.map((b) => (
              <div key={b.id} className="rounded-2xl border border-emerald-100 bg-emerald-50/30 p-4">
                <p className="font-medium">
                  Lote <EntityLink type="inputLot" id={b.id} /> · {b.name}
                </p>
                <div className="mt-2 grid gap-2 sm:grid-cols-3 text-sm">
                  <span>Recepción: <SourcedValue data={b.receivedAt} render={(v) => formatDate(String(v))} /></span>
                  <span>Cantidad: {formatNumber(b.quantity)} {b.unit}</span>
                  <StatusBadge status={b.status} />
                </div>
              </div>
            ))}
            {batches.length === 0 && suppliedInputs.length === 0 && (
              <p className="text-sm text-slate-500">Sin lotes de insumo registrados.</p>
            )}
          </div>
        )}
        {tab === "certs" && (
          <div className="space-y-2">
            {certs.map((c) => (
              <div key={c.id} className="flex justify-between rounded-2xl border border-emerald-100 bg-emerald-50/30 p-3 text-sm">
                <span>{c.name} · {c.code}</span>
                <StatusBadge status={c.status} />
              </div>
            ))}
            {docs.map((d) => (
              <p key={d.id} className="text-sm text-slate-600">{d.name}</p>
            ))}
          </div>
        )}
        {tab === "lotes" && (
          <ul className="space-y-2">
            {lots.map((l) => (
              <li key={l.id}>
                <EntityLink type="packingLot" id={l.id} /> <span className="text-xs text-slate-500">{l.variety}</span>
              </li>
            ))}
          </ul>
        )}
        {tab === "incidencias" && (
          <p className="text-sm text-slate-600">{supplier.incidentCount} incidencia(s) asociada(s) en la campaña.</p>
        )}
        {tab === "historial" && (
          <p className="text-sm text-slate-600">Última entrega: {formatDate(supplier.lastDelivery)}</p>
        )}
      </div>

    </div>
  );
}

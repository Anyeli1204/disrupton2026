"use client";

import { DataTable } from "@/components/ui/DataTable";
import { DataSourceBadge, SourcedValue } from "@/components/ui/DataSourceBadge";
import { EntityLink } from "@/components/ui/EntityLink";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Field } from "@/components/traceability/TraceabilityTimeline";
import { certifications, qualityControls } from "@/data";
import { formatDate } from "@/lib/format";
import { getQualityControl } from "@/lib/queries";
import type { Certification, QualityControl } from "@/types";
import { Camera } from "lucide-react";
import { useRouter } from "next/navigation";

export function QualityList() {
  const router = useRouter();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Calidad y certificaciones</h1>
        <p className="text-sm text-slate-500">Controles de calidad de lote y certificados de fundos, planta y proveedores.</p>
      </div>
      <section>
        <h2 className="mb-3 text-sm font-semibold">Controles de calidad</h2>
        <DataTable<QualityControl>
          rows={qualityControls}
          rowKey={(r) => r.id}
          onRowClick={(r) => router.push(`/calidad/${r.id}`)}
          columns={[
            { key: "id", header: "Código", render: (r) => <EntityLink type="qualityControl" id={r.id} /> },
            { key: "lot", header: "Lote", render: (r) => <EntityLink type="packingLot" id={r.packingLotId} /> },
            { key: "date", header: "Fecha", render: (r) => formatDate(r.date.value) },
            { key: "type", header: "Tipo de control", render: (r) => r.type },
            { key: "res", header: "Resultado", render: (r) => (
              <span className="inline-flex items-center gap-1">
                <StatusBadge status={r.result.value} />
                <DataSourceBadge source={r.result.source} />
              </span>
            ) },
            { key: "resp", header: "Responsable", render: (r) => r.responsible },
            { key: "st", header: "Estado", render: (r) => <StatusBadge status={r.status} /> },
          ]}
        />
      </section>
      <CertificationsSection />
    </div>
  );
}

export function CertificationsSection() {
  return (
    <section>
      <h2 className="mb-3 text-sm font-semibold">Certificaciones</h2>
      <DataTable<Certification>
        rows={certifications}
        rowKey={(r) => r.id}
        columns={[
          { key: "name", header: "Certificación", render: (r) => r.name },
          { key: "rel", header: "Proveedor / fundo / planta", render: (r) => r.relatedEntityLabel },
          { key: "code", header: "Código", render: (r) => r.code },
          { key: "iss", header: "Emisión", render: (r) => formatDate(r.issuedAt) },
          { key: "exp", header: "Vencimiento", render: (r) => formatDate(r.expiresAt) },
          { key: "st", header: "Estado", render: (r) => <StatusBadge status={r.status} /> },
          { key: "doc", header: "Documento", render: (r) => r.documentId },
        ]}
      />
    </section>
  );
}

export function QualityDetail({ id }: { id: string }) {
  const qc = getQualityControl(id);
  if (!qc) return <p>Control no encontrado.</p>;
  return (
    <div className="space-y-5">
      <div>
        <p className="text-xs uppercase tracking-wide text-slate-400">Control de calidad</p>
        <h1 className="text-2xl font-semibold">{qc.id}</h1>
      </div>
      <div className="grid gap-4 rounded-xl border border-slate-200 bg-white p-5 sm:grid-cols-2">
        <Field label="Lote">
          <EntityLink type="packingLot" id={qc.packingLotId} />
        </Field>
        <Field label="Fecha">
          <SourcedValue data={qc.date} render={(v) => formatDate(String(v))} />
        </Field>
        <Field label="Tipo">{qc.type}</Field>
        <Field label="Resultado">
          <span className="inline-flex items-center gap-1">
            <StatusBadge status={qc.result.value} />
            <DataSourceBadge source={qc.result.source} />
          </span>
        </Field>
        <Field label="Responsable">{qc.responsible}</Field>
        <Field label="Estado">
          <StatusBadge status={qc.status} />
        </Field>
        <Field label="Firmeza">{qc.firmness}</Field>
        <Field label="Apariencia">{qc.appearance}</Field>
        <Field label="Condición">{qc.condition}</Field>
        <Field label="Temperatura">{qc.temperature}</Field>
        <div className="sm:col-span-2">
          <Field label="Observaciones">{qc.observations}</Field>
        </div>
      </div>
      <div>
        <h2 className="mb-2 text-sm font-semibold">Fotografías</h2>
        <div className="flex flex-wrap gap-2">
          {qc.photos.map((p) => (
            <div key={p.id} className="flex h-32 w-44 flex-col items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-400">
              <Camera className="h-5 w-5" />
              <span className="mt-1 text-xs">{p.label}</span>
              <span className="px-2 text-center text-[11px]">{p.caption}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

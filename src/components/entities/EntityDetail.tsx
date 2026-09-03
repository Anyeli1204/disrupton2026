"use client";

import { DataSourceBadge } from "@/components/ui/DataSourceBadge";
import { EntityLink } from "@/components/ui/EntityLink";
import { Button } from "@/components/ui/Button";
import { PageHeader } from "@/components/ui/PageHeader";
import { Field } from "@/components/traceability/TraceabilityTimeline";
import { entityTypeLabel } from "@/lib/format";
import { loadEntity } from "@/lib/queries";
import type { EntityType } from "@/types";

export function EntityDetail({ type, id }: { type: string; id: string }) {
  const entity = loadEntity(type, id);
  if (!entity) {
    return (
      <div>
        <PageHeader eyebrow="Entidad" title={id} description="No hay una ficha detallada para este identificador." />
      </div>
    );
  }

  const records = Object.entries(entity as unknown as Record<string, unknown>).filter(
    ([k]) => !["photos", "comments", "history", "updates", "attachments"].includes(k),
  );

  const packingLotHint =
    "packingLotId" in entity
      ? String((entity as { packingLotId?: string }).packingLotId ?? "")
      : "relatedPackingLotIds" in entity
        ? String((entity as { relatedPackingLotIds?: string[] }).relatedPackingLotIds?.[0] ?? "")
        : type === "packingLot"
          ? id
          : "";

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow={entityTypeLabel(type)}
        title={("name" in entity && entity.name) ? String(entity.name) : id}
        actions={
          packingLotHint ? (
            <>
              <Button variant="primary" href={`/lotes/${packingLotHint}`}>
                Ver lote {packingLotHint}
              </Button>
              <Button href={`/trazabilidad?q=${id}`}>Ver trazabilidad</Button>
            </>
          ) : undefined
        }
      />
      <div className="zhenda-card grid gap-4 p-5 sm:grid-cols-2">
        {records.map(([k, v]) => (
          <Field key={k} label={k}>
            <Value k={k} v={v} />
          </Field>
        ))}
      </div>
    </div>
  );
}

function Value({ k, v }: { k: string; v: unknown }) {
  if (v && typeof v === "object" && "value" in v && "source" in v) {
    const s = v as { value: unknown; source: { system: string; source: string; updatedAt: string } };
    return (
      <span className="inline-flex items-center gap-1">
        {String(s.value)}
        <DataSourceBadge source={s.source} />
      </span>
    );
  }
  if (Array.isArray(v)) {
    return (
      <span className="flex flex-wrap gap-1">
        {v.slice(0, 12).map((item) => (
          <span key={String(item)} className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs text-zhenda">
            {linkable(k, String(item))}
          </span>
        ))}
        {v.length > 12 && <span className="text-xs text-slate-400">+{v.length - 12}</span>}
      </span>
    );
  }
  if (typeof v === "string" && looksLikeId(v)) return linkable(k, v);
  if (typeof v === "boolean") return v ? "Sí" : "No";
  if (v === null || v === undefined) return "—";
  if (typeof v === "object") return JSON.stringify(v);
  return String(v);
}

function looksLikeId(v: string) {
  return /^(EMP-|PAL-|PROC-|COS-|CUA-|P-|PAR-|C-|J-|CL-|BK-|MSKU|TCLU|PROV-|QC-|CERT-|INC-|RET-|FARM-|IMP-|CD-|SM-|REC-|TRP-|VIV-|QR-)/.test(v);
}

function linkable(field: string, id: string) {
  const type = inferType(field, id);
  if (!type) return id;
  return <EntityLink type={type} id={id} />;
}

function inferType(field: string, id: string): EntityType | null {
  if (id.startsWith("EMP-")) return "packingLot";
  if (id.startsWith("PAL-")) return "pallet";
  if (id.startsWith("PROC-")) return "processingLot";
  if (id.startsWith("COS-")) return "harvest";
  if (id.startsWith("CUA-")) return "harvestCrew";
  if (id.startsWith("CERT-") || id.startsWith("GGN")) return "certification";
  if (id.startsWith("REC-")) return "reception";
  if (id.startsWith("TRP-")) return "transport";
  if (id.startsWith("VIV-")) return "nursery";
  if (id.startsWith("QR-")) return "qrCode";
  if (id.startsWith("PAR-") || /^P-\d+$/.test(id)) return "plot";
  if (id.startsWith("CL-")) return "clamshellBatch";
  if (id.startsWith("ETQ-") || id.startsWith("CX-")) return "inputLot";
  if (id.startsWith("BK-")) return "booking";
  if (id.startsWith("PROV-")) return "supplier";
  if (id.startsWith("QC-")) return "qualityControl";
  if (id.startsWith("INC-")) return "claim";
  if (id.startsWith("RET-")) return "recall";
  if (id.startsWith("FARM-")) return "farm";
  if (id.startsWith("P-")) return "plot";
  if (id.startsWith("C-") && /C-\d+/.test(id)) return "box";
  if (id.startsWith("J-")) return "crate";
  if (id.startsWith("MSKU") || id.startsWith("TCLU")) return "container";
  if (field.toLowerCase().includes("importer")) return "importer";
  if (field.toLowerCase().includes("supermarket")) return "supermarket";
  return null;
}


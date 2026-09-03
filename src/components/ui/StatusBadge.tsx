"use client";

import { LOT_STATUS_LABEL, LOT_STATUS_TONE } from "@/lib/constants";
import type { ClaimStatus, LotStatus, RecallStatus, Severity, SupplierStatus } from "@/types";

type Tone = "green" | "amber" | "red" | "gray" | "blue";

const TONE: Record<Tone, string> = {
  green: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  amber: "bg-amber-50 text-amber-800 ring-amber-200",
  red: "bg-red-50 text-red-800 ring-red-200",
  gray: "bg-slate-100 text-slate-600 ring-slate-200",
  blue: "bg-sky-50 text-sky-800 ring-sky-200",
};

function Badge({ children, tone }: { children: React.ReactNode; tone: Tone }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide ring-1 ${TONE[tone]}`}>
      {children}
    </span>
  );
}

export function StatusBadge({
  status,
}: {
  status: LotStatus | ClaimStatus | RecallStatus | SupplierStatus | Severity | string;
}) {
  if (status in LOT_STATUS_LABEL) {
    const s = status as LotStatus;
    return <Badge tone={LOT_STATUS_TONE[s]}>{LOT_STATUS_LABEL[s]}</Badge>;
  }

  const map: Record<string, { label: string; tone: Tone }> = {
    aprobado: { label: "Aprobado", tone: "green" },
    observado: { label: "Observado", tone: "amber" },
    suspendido: { label: "Suspendido", tone: "red" },
    vencido: { label: "Vencido", tone: "gray" },
    nuevo: { label: "Nuevo", tone: "blue" },
    en_investigacion: { label: "En investigación", tone: "amber" },
    esperando_informacion: { label: "Esperando información", tone: "blue" },
    resuelto: { label: "Resuelto", tone: "green" },
    cerrado: { label: "Cerrado", tone: "gray" },
    borrador: { label: "Borrador", tone: "gray" },
    iniciado: { label: "Iniciado", tone: "blue" },
    en_proceso: { label: "En proceso", tone: "amber" },
    parcialmente_recuperado: { label: "Parcialmente recuperado", tone: "amber" },
    finalizado: { label: "Finalizado", tone: "green" },
    baja: { label: "Baja", tone: "gray" },
    media: { label: "Media", tone: "amber" },
    alta: { label: "Alta", tone: "red" },
    critica: { label: "Crítica", tone: "red" },
    conforme: { label: "Conforme", tone: "green" },
    no_conforme: { label: "No conforme", tone: "red" },
    vigente: { label: "Vigente", tone: "green" },
    por_vencer: { label: "Por vencer", tone: "amber" },
    archivado: { label: "Archivado", tone: "gray" },
    en_transito: { label: "En tránsito", tone: "blue" },
    en_cd: { label: "En CD", tone: "blue" },
    en_tienda: { label: "En tienda", tone: "green" },
    retirado: { label: "Retirado", tone: "red" },
    vendido: { label: "Vendido", tone: "gray" },
    abierto: { label: "Abierto", tone: "amber" },
  };

  const item = map[status] ?? { label: String(status), tone: "gray" as Tone };
  return <Badge tone={item.tone}>{item.label}</Badge>;
}

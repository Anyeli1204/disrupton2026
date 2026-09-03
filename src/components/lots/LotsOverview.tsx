"use client";

import { CountryFlag } from "@/components/ui/CountryFlag";
import { EXPLORER_PHOTOS } from "@/lib/explorerVisuals";
import { formatNumber } from "@/lib/format";
import type { LotStatus, PackingLot } from "@/types";
import { AlertTriangle, CheckCircle2, ChevronLeft, ChevronRight, Globe, Lock } from "lucide-react";
import Image from "next/image";
import { useMemo, useState } from "react";

const JOURNEY = [
  { src: EXPLORER_PHOTOS.harvest, label: "Cosecha", kicker: "Origen en campo", metric: "lotes" as const },
  { src: EXPLORER_PHOTOS.packing, label: "Empaque", kicker: "Línea de planta", metric: "autorizados" as const },
  { src: EXPLORER_PHOTOS.qr, label: "QR", kicker: "Identificador del clamshell", metric: "lotes" as const },
  { src: EXPLORER_PHOTOS.boxes, label: "Cajas", kicker: "Unidad de despacho", metric: "cajas" as const },
  { src: EXPLORER_PHOTOS.pallet, label: "Pallet", kicker: "Agrupación de cajas", metric: "cajas" as const },
  { src: EXPLORER_PHOTOS.container, label: "Contenedor", kicker: "Exportación marítima", metric: "destinos" as const },
  { src: EXPLORER_PHOTOS.market, label: "Destino", kicker: "Retail en destino", metric: "destinos" as const },
] as const;

export function LotsOverview({
  lots,
  onFilterStatus,
}: {
  lots: PackingLot[];
  onFilterStatus: (status: LotStatus | "") => void;
}) {
  const [slide, setSlide] = useState(0);
  const total = lots.length;
  const authorized = lots.filter((l) => l.status === "autorizado").length;
  const observed = lots.filter((l) => l.status === "observado").length;
  const closed = lots.filter((l) => l.status === "cerrado").length;
  const boxes = lots.reduce((sum, l) => sum + l.boxCount, 0);
  const destinos = useMemo(() => {
    const counts = new Map<string, number>();
    for (const lot of lots) {
      counts.set(lot.destinationCountry, (counts.get(lot.destinationCountry) ?? 0) + 1);
    }
    return [...counts.entries()]
      .map(([name, count]) => ({ name, count, pct: total ? Math.round((count / total) * 100) : 0 }))
      .sort((a, b) => b.count - a.count);
  }, [lots, total]);

  const current = JOURNEY[slide] ?? JOURNEY[0];
  const metricValue =
    current.metric === "cajas"
      ? boxes
      : current.metric === "destinos"
        ? destinos.length
        : current.metric === "autorizados"
          ? authorized
          : total;
  const metricLabel =
    current.metric === "cajas"
      ? "cajas empacadas"
      : current.metric === "destinos"
        ? "destinos activos"
        : current.metric === "autorizados"
          ? "lotes autorizados"
          : "lotes totales";

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1.75fr)_minmax(0,0.7fr)_minmax(0,1.15fr)]">
      <article className="relative isolate min-h-52 overflow-hidden rounded-3xl shadow-sm lg:min-h-56">
        <div className="pointer-events-none absolute inset-0">
          <Image
            src={current.src}
            alt={current.label}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
            priority
          />
        </div>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#0e1a14]/88 via-[#0e1a14]/45 to-transparent" />
        <div className="pointer-events-none relative z-10 flex h-full min-h-52 flex-col justify-end px-12 py-5 text-white lg:min-h-56">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-emerald-100/80">{current.label}</p>
          <p className="mt-2 text-4xl font-semibold tracking-tight">{formatNumber(metricValue)}</p>
          <p className="mt-1 text-sm text-emerald-50/80">{metricLabel}</p>
          <span className="mt-3 inline-flex w-fit items-center rounded-full bg-emerald-400/20 px-2.5 py-1 text-[11px] font-semibold text-emerald-100">
            {current.kicker}
          </span>
          <div className="pointer-events-auto mt-3 flex gap-1.5">
            {JOURNEY.map((step, i) => (
              <button
                key={step.label}
                type="button"
                aria-label={step.label}
                onClick={() => setSlide(i)}
                className={`h-1.5 rounded-full transition ${i === slide ? "w-5 bg-white" : "w-1.5 bg-white/40"}`}
              />
            ))}
          </div>
        </div>
        <button
          type="button"
          aria-label="Etapa anterior"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setSlide((s) => (s + JOURNEY.length - 1) % JOURNEY.length);
          }}
          className="absolute left-2 top-1/2 z-20 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full bg-white text-slate-800 shadow-sm hover:bg-emerald-50"
        >
          <ChevronLeft className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          aria-label="Etapa siguiente"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setSlide((s) => (s + 1) % JOURNEY.length);
          }}
          className="absolute right-2 top-1/2 z-20 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full bg-white text-slate-800 shadow-sm hover:bg-emerald-50"
        >
          <ChevronRight className="h-3.5 w-3.5" />
        </button>
      </article>

      <article className="zhenda-card grid min-h-52 overflow-hidden rounded-3xl lg:min-h-56 lg:grid-cols-[4.5rem_minmax(0,1fr)]">
        <div className="relative min-h-28">
          <Image
            src={EXPLORER_PHOTOS.packing}
            alt="Empaque de arándano en planta"
            fill
            className="object-cover"
            sizes="80px"
          />
        </div>
        <button
          type="button"
          onClick={() => onFilterStatus("autorizado")}
          className="flex flex-col justify-between p-3 text-left hover:bg-emerald-50/60 sm:p-4"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50 text-zhenda">
            <CheckCircle2 className="h-4 w-4" />
          </span>
          <span>
            <span className="block text-xs font-medium text-slate-500">Autorizados</span>
            <span className="mt-1 block text-3xl font-semibold tracking-tight text-slate-900">
              {formatNumber(authorized)}
            </span>
            <span className="mt-1 block text-xs text-slate-500">{pct(authorized, total)} del total</span>
          </span>
          <Sparkline />
        </button>
      </article>

      <article className="zhenda-card grid min-h-52 overflow-hidden rounded-3xl sm:grid-cols-2 lg:min-h-56">
        <div className="relative min-h-36">
          <Image
            src={EXPLORER_PHOTOS.container}
            alt="Contenedor de exportación"
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 50vw, 16vw"
          />
        </div>
        <div className="flex flex-col justify-between gap-3 p-4">
          <button type="button" onClick={() => onFilterStatus("observado")} className="text-left hover:opacity-80">
            <span className="flex items-center gap-2 text-xs font-medium text-slate-500">
              <AlertTriangle className="h-3.5 w-3.5 text-amber-600" />
              Observados
            </span>
            <span className="mt-0.5 block text-xl font-semibold">
              {formatNumber(observed)}{" "}
              <span className="text-xs font-normal text-slate-500">({pct(observed, total)})</span>
            </span>
          </button>
          <button type="button" onClick={() => onFilterStatus("cerrado")} className="text-left hover:opacity-80">
            <span className="flex items-center gap-2 text-xs font-medium text-slate-500">
              <Lock className="h-3.5 w-3.5 text-slate-500" />
              Cerrados
            </span>
            <span className="mt-0.5 block text-xl font-semibold">
              {formatNumber(closed)}{" "}
              <span className="text-xs font-normal text-slate-500">({pct(closed, total)})</span>
            </span>
          </button>
          <div>
            <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
              <Globe className="h-3 w-3 text-zhenda" />
              Destinos principales
            </p>
            <ul className="mt-2 space-y-1.5">
              {destinos.slice(0, 2).map((d) => (
                <li key={d.name}>
                  <div className="flex items-center justify-between gap-2 text-[11px] text-slate-600">
                    <span className="inline-flex items-center gap-1.5">
                      <CountryFlag country={d.name} className="h-4 w-4" />
                      {d.name}
                    </span>
                    <span className="font-medium">{d.pct}%</span>
                  </div>
                  <div className="mt-0.5 h-1.5 overflow-hidden rounded-full bg-emerald-100">
                    <div className="h-full rounded-full bg-zhenda" style={{ width: `${d.pct}%` }} />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </article>
    </div>
  );
}

function pct(part: number, total: number) {
  if (!total) return "0%";
  return `${((part / total) * 100).toFixed(1)}%`;
}

function Sparkline() {
  return (
    <svg viewBox="0 0 120 28" className="h-7 w-full text-zhenda" aria-hidden>
      <polyline
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
        points="0,22 16,18 32,20 48,12 64,14 80,8 96,10 120,4"
      />
    </svg>
  );
}

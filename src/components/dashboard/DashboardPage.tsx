"use client";

import { AlertCard } from "@/components/ui/AlertCard";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatCard } from "@/components/ui/StatCard";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { alerts, dashboardKpis, lotStatusSummary, recentActivity } from "@/data";
import { EXPLORER_PHOTOS } from "@/lib/explorerVisuals";
import { LOT_STATUS_LABEL } from "@/lib/constants";
import { formatDateTime } from "@/lib/format";
import { AlertTriangle, ArrowRight, Package, ShieldAlert, Truck, Undo2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function DashboardPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Dashboard" description="Vista ejecutiva de la campaña 2026–2027 · arándano fresco" />

      <section className="overflow-hidden rounded-2xl border border-emerald-900/10 bg-[#0e1a14] text-white shadow-sm">
        <div className="grid lg:grid-cols-[1.45fr_0.55fr]">
          <div className="p-6 sm:p-7">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-emerald-200/75">
              Capa de interoperabilidad
            </p>
            <h2 className="mt-2 max-w-xl text-xl font-semibold leading-snug tracking-tight sm:text-2xl">
              Zhenda no reemplaza los sistemas existentes: conecta sus identificadores.
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-emerald-50/70">
              Cada área sigue en AgroSoft, PlantOS, PackLine o el ERP. El explorador relaciona esos códigos para reconstruir
              de dónde proviene un lote y a qué supermercados llegó.
            </p>
            <Link
              href="/trazabilidad?q=EMP-2026-0841"
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-zhenda hover:bg-emerald-50"
            >
              Abrir explorador
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="relative min-h-36 lg:min-h-full">
            <Image src={EXPLORER_PHOTOS.blueberries} alt="Arándano fresco Ventura" fill className="object-cover" sizes="32vw" />
            <div className="absolute inset-0 bg-gradient-to-l from-transparent to-[#0e1a14]" />
          </div>
        </div>
      </section>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
        <StatCard label="Lotes activos" value={dashboardKpis.activeLots} icon={Package} tone="green" hint="En campaña" />
        <StatCard label="Lotes observados" value={dashboardKpis.observedLots} icon={ShieldAlert} tone="amber" />
        <StatCard label="Reclamos abiertos" value={dashboardKpis.openClaims} icon={AlertTriangle} tone="amber" />
        <StatCard label="Incidencias críticas" value={dashboardKpis.criticalIncidents} icon={AlertTriangle} tone="red" />
        <StatCard label="Retiros activos" value={dashboardKpis.activeRecalls} icon={Undo2} tone="red" />
        <StatCard label="Proveedores activos" value={dashboardKpis.activeSuppliers} icon={Truck} />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <section className="zhenda-card p-5 lg:col-span-2">
          <h2 className="text-sm font-semibold text-slate-900">Actividad reciente</h2>
          <ul className="mt-4 space-y-1">
            {recentActivity.map((a) => (
              <li key={a.id}>
                <Link
                  href={a.href ?? "/"}
                  className="flex items-start justify-between gap-3 rounded-xl px-2 py-2.5 hover:bg-emerald-50/70"
                >
                  <span className="text-sm text-slate-800">{a.text}</span>
                  <span className="shrink-0 text-[11px] text-slate-400">{formatDateTime(a.at)}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
        <section className="space-y-3">
          <h2 className="px-1 text-sm font-semibold text-slate-900">Alertas</h2>
          {alerts.map((a) => (
            <AlertCard key={a.id} level={a.level} text={a.text} href={a.href} />
          ))}
        </section>
      </div>

      <section className="zhenda-card p-5">
        <h2 className="text-sm font-semibold text-slate-900">Resumen de estados de lotes</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
          {lotStatusSummary.map((s) => (
            <Link
              key={s.status}
              href={`/lotes?estado=${s.status}`}
              className="rounded-xl border border-slate-100 bg-slate-50/80 p-3 transition hover:border-zhenda/30 hover:bg-emerald-50/60"
            >
              <StatusBadge status={s.status} />
              <p className="mt-2 text-2xl font-semibold">{s.count}</p>
              <p className="text-xs text-slate-500">{LOT_STATUS_LABEL[s.status]}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

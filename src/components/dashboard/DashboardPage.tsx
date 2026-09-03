"use client";

import { AlertCard } from "@/components/ui/AlertCard";
import { StatCard } from "@/components/ui/StatCard";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { alerts, dashboardKpis, lotStatusSummary, recentActivity } from "@/data";
import { LOT_STATUS_LABEL } from "@/lib/constants";
import { formatDateTime } from "@/lib/format";
import { AlertTriangle, Package, ShieldAlert, Truck, Undo2 } from "lucide-react";
import Link from "next/link";

export function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Dashboard</h1>
        <p className="mt-1 text-sm text-slate-500">Vista ejecutiva de la campaña 2026–2027 · arándano fresco</p>
      </div>

      <section className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-zhenda">Capa de interoperabilidad</p>
        <h2 className="mt-1 text-lg font-semibold text-slate-900">Zhenda no reemplaza los sistemas existentes: conecta sus identificadores.</h2>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
          Cada área sigue trabajando en AgroSoft, PlantOS, PackLine o el ERP. El explorador relaciona esos códigos para
          reconstruir de dónde proviene un lote, qué procesos atravesó y a qué supermercados llegó.
        </p>
        <Link
          href="/trazabilidad?q=EMP-2026-0841"
          className="mt-4 inline-flex rounded-lg bg-zhenda px-4 py-2 text-sm font-medium text-white"
        >
          Abrir explorador de trazabilidad
        </Link>
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
        <section className="rounded-xl border border-slate-200 bg-white p-5 lg:col-span-2">
          <h2 className="text-sm font-semibold text-slate-900">Actividad reciente</h2>
          <ul className="mt-4 space-y-3">
            {recentActivity.map((a) => (
              <li key={a.id} className="flex items-start justify-between gap-3 border-b border-slate-100 pb-3 last:border-0">
                <Link href={a.href ?? "/"} className="text-sm text-slate-800 hover:text-zhenda">
                  {a.text}
                </Link>
                <span className="shrink-0 text-[11px] text-slate-400">{formatDateTime(a.at)}</span>
              </li>
            ))}
          </ul>
        </section>
        <section className="space-y-3">
          <h2 className="text-sm font-semibold text-slate-900">Alertas</h2>
          {alerts.map((a) => (
            <AlertCard key={a.id} level={a.level} text={a.text} href={a.href} />
          ))}
        </section>
      </div>

      <section className="rounded-xl border border-slate-200 bg-white p-5">
        <h2 className="text-sm font-semibold text-slate-900">Resumen de estados de lotes</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
          {lotStatusSummary.map((s) => (
            <Link key={s.status} href={`/lotes?estado=${s.status}`} className="rounded-lg border border-slate-100 p-3 hover:border-zhenda/30">
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

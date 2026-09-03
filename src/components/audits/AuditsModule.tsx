"use client";

import { DataSourceBadge, SourcedValue } from "@/components/ui/DataSourceBadge";
import { EntityLink } from "@/components/ui/EntityLink";
import { Modal } from "@/components/ui/Modal";
import { packingLots } from "@/data";
import { formatDate, formatDateTime } from "@/lib/format";
import { getDocumentsForEntity, lotContext } from "@/lib/queries";
import { useZhendaStore } from "@/lib/store";
import { Button } from "@/components/ui/Button";
import { PageHeader } from "@/components/ui/PageHeader";
import { FileDown } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

export function AuditsList() {
  const store = useZhendaStore();
  const [lot, setLot] = useState("EMP-2026-0841");
  const router = useRouter();

  return (
    <div className="space-y-5">
      <PageHeader
        title="Auditorías"
        description="Genere expedientes de trazabilidad para auditorías y clientes."
      />
      <div className="zhenda-card p-5">
        <h2 className="text-sm font-semibold">Generar expediente de trazabilidad</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          <select className="zhenda-select" value={lot} onChange={(e) => setLot(e.target.value)}>
            {packingLots.slice(0, 12).map((l) => (
              <option key={l.id} value={l.id}>
                {l.id}
              </option>
            ))}
          </select>
          <Button
            variant="primary"
            onClick={() => {
              const item = store.addDossier(lot);
              router.push(`/auditorias/${item.id}`);
            }}
          >
            Generar expediente de trazabilidad
          </Button>
        </div>
      </div>
      <section>
        <h2 className="mb-3 text-sm font-semibold">Historial de expedientes</h2>
        <ul className="zhenda-card divide-y divide-slate-100 overflow-hidden">
          {store.generatedDossiers.map((d) => (
            <li key={d.id}>
              <Link href={`/auditorias/${d.id}`} className="flex justify-between px-4 py-3 text-sm hover:bg-emerald-50/60">
                <span className="font-medium">{d.id}</span>
                <span className="text-slate-500">
                  {d.lotId} · {formatDateTime(d.createdAt)}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

export function AuditDossier({ id }: { id: string }) {
  const store = useZhendaStore();
  const item = store.generatedDossiers.find((d) => d.id === id);
  const lotId = item?.lotId ?? "EMP-2026-0841";
  const lot = packingLots.find((l) => l.id === lotId) ?? packingLots[0];
  const ctx = useMemo(() => lotContext(lot), [lot]);
  const [pdfOpen, setPdfOpen] = useState(false);
  const docs = getDocumentsForEntity("packingLot", lot.id);

  const sections: { n: number; title: string; body: React.ReactNode }[] = [
    { n: 1, title: "Datos generales", body: <p>Empresa: Agroexportadora Valle Azul S.A.C. · Campaña 2026–2027 · Planta Chao</p> },
    { n: 2, title: "Producto", body: <p>{ctx.product?.name} · variedad {lot.variety} · {lot.weightKg.value} kg</p> },
    { n: 3, title: "Proveedor agrícola", body: ctx.agricultural ? <EntityLink type="supplier" id={ctx.agricultural.id}>{ctx.agricultural.name}</EntityLink> : "—" },
    { n: 4, title: "Fundo", body: ctx.farm ? <EntityLink type="farm" id={ctx.farm.id}>{ctx.farm.name}</EntityLink> : "—" },
    { n: 5, title: "Parcela", body: ctx.plot ? <EntityLink type="plot" id={ctx.plot.id}>{ctx.plot.code}</EntityLink> : "—" },
    { n: 6, title: "Cosecha", body: ctx.harvest ? <span className="inline-flex items-center gap-1"><EntityLink type="harvest" id={ctx.harvest.id} /> <SourcedValue data={ctx.harvest.date} render={(v) => formatDate(String(v))} /></span> : "—" },
    { n: 7, title: "Procesamiento", body: ctx.processing ? <EntityLink type="processingLot" id={ctx.processing.id} /> : "—" },
    { n: 8, title: "Empaque", body: <span className="inline-flex items-center gap-1"><EntityLink type="packingLot" id={lot.id} /> <SourcedValue data={lot.packingDate} render={(v) => formatDate(String(v))} /></span> },
    { n: 9, title: "Proveedores de insumos", body: ctx.clamshellSupplier ? <span>{ctx.clamshellSupplier.name} · lote <EntityLink type="clamshellBatch" id={ctx.clamshell?.id ?? ""} /></span> : "—" },
    { n: 10, title: "Controles de calidad", body: ctx.qcs.map((q) => <p key={q.id}>{q.id} · {q.result.value.toUpperCase()} · {q.responsible}</p>) },
    { n: 11, title: "Certificaciones", body: <p>GLOBALG.A.P. Fundo Santa Rosa · SMETA Planta Chao</p> },
    { n: 12, title: "Cajas", body: <p>{lot.boxFrom} a {lot.boxTo} ({lot.boxCount})</p> },
    { n: 13, title: "Pallets", body: lot.palletIds.map((id) => <EntityLink key={id} type="pallet" id={id} />) },
    { n: 14, title: "Contenedor", body: ctx.container ? <span className="inline-flex items-center gap-1"><EntityLink type="container" id={ctx.container.id} /><DataSourceBadge source={ctx.container.departureDate.source} /></span> : "—" },
    { n: 15, title: "Booking", body: ctx.booking ? <EntityLink type="booking" id={ctx.booking.id} /> : "—" },
    { n: 16, title: "Destinos", body: ctx.dests.map((d) => <p key={d.destination.id}>{d.supermarket?.name} · {d.destination.boxCount} cajas</p>) },
    { n: 17, title: "Incidencias", body: ctx.claims.length ? ctx.claims.map((c) => <p key={c.id}><EntityLink type="claim" id={c.id} /> · {c.problem}</p>) : <p>Sin incidencias en origen.</p> },
    { n: 18, title: "Fuente de cada dato", body: <p>AgroSoft, PlantOS, PackLine, QMS, ERP Valle Azul, TradeDoc y portal Zhenda. Cada campo clave incluye icono de fuente.</p> },
    { n: 19, title: "Fecha de actualización", body: <p>Expediente generado {item ? formatDateTime(item.createdAt) : "hoy"}.</p> },
  ];

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="Expediente"
        title={id}
        description={`Lote ${lot.id}`}
        actions={
          <Button variant="primary" onClick={() => setPdfOpen(true)}>
            <FileDown className="h-4 w-4" /> Exportar PDF
          </Button>
        }
      />
      <div className="space-y-3">
        {sections.map((s) => (
          <section key={s.n} className="zhenda-card p-4">
            <h2 className="text-sm font-semibold text-slate-900">
              {s.n}. {s.title}
            </h2>
            <div className="mt-2 text-sm text-slate-700">{s.body}</div>
          </section>
        ))}
      </div>
      <div className="grid gap-2 sm:grid-cols-2">
        {docs.map((d) => (
          <p key={d.id} className="text-xs text-slate-500">{d.name}</p>
        ))}
      </div>
      <Modal open={pdfOpen} title="Exportar PDF" onClose={() => setPdfOpen(false)}>
        <p className="text-sm text-slate-700">
          La exportación a PDF quedará conectada al generador documental. En este prototipo el expediente ya está estructurado en 19 secciones listas para imprimir.
        </p>
      </Modal>
    </div>
  );
}


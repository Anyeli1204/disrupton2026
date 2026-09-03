"use client";

import { DataSourceBadge, SourcedValue } from "@/components/ui/DataSourceBadge";
import { EntityLink } from "@/components/ui/EntityLink";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { inputLots, packagingMaterials, qrCodes } from "@/data";
import { entityTypeLabel, formatDate, formatNumber } from "@/lib/format";
import {
  getBooking,
  getBox,
  getClamshellBatch,
  getContainer,
  getCrate,
  getDistributionCenter,
  getFarm,
  getHarvest,
  getImporter,
  getPackingLot,
  getPallet,
  getPlot,
  getProcessingLot,
  getSupplier,
  getSupermarket,
} from "@/lib/queries";
import type { EntityType, Sourced, TraceNode } from "@/types";
import {
  Box,
  Building2,
  Factory,
  Leaf,
  Package,
  Ship,
  ShoppingBag,
  Sprout,
  StickyNote,
  Truck,
  Warehouse,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

const ICONS: Partial<Record<EntityType, LucideIcon>> = {
  farm: Sprout,
  plot: Leaf,
  harvest: Leaf,
  harvestCrew: Leaf,
  crate: Box,
  nursery: Sprout,
  transport: Truck,
  reception: Factory,
  qrCode: StickyNote,
  processingLot: Factory,
  packingLot: Package,
  clamshellBatch: Package,
  inputLot: Package,
  box: Box,
  pallet: Warehouse,
  container: Ship,
  booking: StickyNote,
  importer: Building2,
  distributionCenter: Warehouse,
  supermarket: ShoppingBag,
  supplier: Truck,
};

function Chip({ type, id, children }: { type: EntityType; id: string; children?: React.ReactNode }) {
  return (
    <EntityLink
      type={type}
      id={id}
      className="inline-flex rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-zhenda hover:bg-emerald-100"
    >
      {children ?? id}
    </EntityLink>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  if (children === null || children === undefined || children === "") return null;
  return (
    <div className="rounded-lg bg-slate-50 px-3 py-2.5">
      <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">{label}</p>
      <div className="mt-1 text-sm font-medium text-slate-900">{children}</div>
    </div>
  );
}

function sourcedDate(data: Sourced<string>) {
  return <SourcedValue data={data} render={(v) => formatDate(String(v))} />;
}

export function TraceNodePreview({ node }: { node: TraceNode }) {
  const id = node.id.split(",")[0];
  const Icon = ICONS[node.type] ?? Package;

  return (
    <div className="space-y-4">
      <div className="flex items-start gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-zhenda">
          <Icon className="h-5 w-5" />
        </span>
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">{entityTypeLabel(node.type)}</p>
          <p className="text-lg font-semibold text-slate-900">{node.label}</p>
          {node.subtitle && <p className="text-sm text-slate-500">{node.subtitle}</p>}
        </div>
      </div>
      <div className="grid gap-2 sm:grid-cols-2">{previewFields(node.type, id)}</div>
    </div>
  );
}

function previewFields(type: EntityType, id: string): React.ReactNode {
  switch (type) {
    case "clamshellBatch": {
      const batch = getClamshellBatch(id);
      if (!batch) return <Fallback id={id} />;
      const supplier = getSupplier(batch.supplierId);
      const material = packagingMaterials.find((m) => m.id === batch.materialId);
      return (
        <>
          <Row label="Código">{batch.id}</Row>
          <Row label="Estado">
            <StatusBadge status={batch.status} />
          </Row>
          <Row label="Proveedor">
            {supplier ? <Chip type="supplier" id={supplier.id}>{supplier.name}</Chip> : batch.supplierId}
          </Row>
          <Row label="Material">{material ? `${material.name} · ${material.spec}` : batch.materialId}</Row>
          <Row label="Fecha de recepción">{sourcedDate(batch.receivedAt)}</Row>
          <Row label="Cantidad">{formatNumber(batch.quantity)} unidades</Row>
          <div className="sm:col-span-2">
            <Row label="Lotes de empaque relacionados">
              <div className="flex flex-wrap gap-1.5">
                {batch.relatedPackingLotIds.map((lotId) => (
                  <Chip key={lotId} type="packingLot" id={lotId} />
                ))}
              </div>
            </Row>
          </div>
        </>
      );
    }
    case "inputLot": {
      const lot = inputLots.find((l) => l.id === id);
      if (!lot) return <Fallback id={id} />;
      const supplier = getSupplier(lot.supplierId);
      return (
        <>
          <Row label="Lote de insumo">{lot.id}</Row>
          <Row label="Tipo">{lot.kind}</Row>
          <Row label="Material">{lot.name}</Row>
          <Row label="Proveedor">
            {supplier ? <Chip type="supplier" id={supplier.id}>{supplier.name}</Chip> : lot.supplierId}
          </Row>
          <Row label="Cantidad">{formatNumber(lot.quantity)} {lot.unit}</Row>
          <Row label="Estado">
            <StatusBadge status={lot.status} />
          </Row>
          <div className="sm:col-span-2">
            <Row label="Lotes de empaque relacionados">
              <div className="flex flex-wrap gap-1.5">
                {lot.relatedPackingLotIds.map((lotId) => (
                  <Chip key={lotId} type="packingLot" id={lotId} />
                ))}
              </div>
            </Row>
          </div>
        </>
      );
    }
    case "packingLot": {
      const lot = getPackingLot(id);
      if (!lot) return <Fallback id={id} />;
      return (
        <>
          <Row label="Lote">{lot.id}</Row>
          <Row label="Estado">
            <StatusBadge status={lot.status} />
          </Row>
          <Row label="Producto">Arándano fresco</Row>
          <Row label="Variedad">{lot.variety}</Row>
          <Row label="Fecha de empaque">{sourcedDate(lot.packingDate)}</Row>
          <Row label="Peso">
            <SourcedValue data={lot.weightKg} render={(v) => `${v} kg`} />
          </Row>
          <Row label="Cajas">
            <Chip type="box" id={lot.boxFrom}>
              {lot.boxFrom} a {lot.boxTo} ({lot.boxCount})
            </Chip>
          </Row>
          <Row label="Destino">{lot.destinationCountry}</Row>
          <Row label="Clamshell">
            <Chip type="clamshellBatch" id={lot.clamshellBatchId} />
          </Row>
          <Row label="Contenedor">
            <Chip type="container" id={lot.containerId} />
          </Row>
        </>
      );
    }
    case "farm": {
      const farm = getFarm(id);
      if (!farm) return <Fallback id={id} />;
      return (
        <>
          <Row label="Fundo">{farm.name}</Row>
          <Row label="Código">{farm.code}</Row>
          <Row label="Región">{farm.region} · {farm.district}</Row>
          <Row label="Superficie">{farm.hectares} ha</Row>
          <Row label="Proveedor">
            <Chip type="supplier" id={farm.supplierId}>{getSupplier(farm.supplierId)?.name ?? farm.supplierId}</Chip>
          </Row>
          <Row label="Estado">
            <StatusBadge status={farm.status} />
          </Row>
          <div className="sm:col-span-2">
            <Row label="Parcelas">
              <div className="flex flex-wrap gap-1.5">
                {farm.plotIds.map((p) => (
                  <Chip key={p} type="plot" id={p} />
                ))}
              </div>
            </Row>
          </div>
        </>
      );
    }
    case "plot": {
      const plot = getPlot(id);
      if (!plot) return <Fallback id={id} />;
      const farm = getFarm(plot.farmId);
      return (
        <>
          <Row label="Parcela">{plot.code}</Row>
          <Row label="Variedad">{plot.variety}</Row>
          <Row label="Fundo">{farm ? <Chip type="farm" id={farm.id}>{farm.name}</Chip> : plot.farmId}</Row>
          <Row label="Superficie">{plot.hectares} ha</Row>
          <Row label="Año de siembra">{plot.plantingYear}</Row>
          <Row label="Supervisor">{plot.supervisor}</Row>
        </>
      );
    }
    case "harvest": {
      const harvest = getHarvest(id);
      if (!harvest) return <Fallback id={id} />;
      return (
        <>
          <Row label="Cosecha">{harvest.id}</Row>
          <Row label="Fecha">{sourcedDate(harvest.date)}</Row>
          <Row label="Parcela">
            <Chip type="plot" id={harvest.plotId} />
          </Row>
          <Row label="Fundo">
            <Chip type="farm" id={harvest.farmId}>{getFarm(harvest.farmId)?.name ?? harvest.farmId}</Chip>
          </Row>
          <Row label="Supervisor">{harvest.supervisor}</Row>
          <Row label="Turno">{harvest.shift}</Row>
          <Row label="Jabas">
            {harvest.crateFrom} a {harvest.crateTo} ({harvest.crateCount})
          </Row>
          <Row label="Kilos cosechados">{formatNumber(harvest.kgHarvested)} kg</Row>
        </>
      );
    }
    case "crate": {
      const crate = getCrate(id);
      const harvest = crate ? getHarvest(crate.harvestId) : getHarvest(id);
      return (
        <>
          <Row label="Jaba">{id}</Row>
          {crate && <Row label="Peso">{crate.weightKg} kg</Row>}
          <Row label="Cosecha">
            <Chip type="harvest" id={crate?.harvestId ?? harvest?.id ?? id} />
          </Row>
          {harvest && (
            <Row label="Rango">
              {harvest.crateFrom} a {harvest.crateTo}
            </Row>
          )}
        </>
      );
    }
    case "processingLot": {
      const proc = getProcessingLot(id);
      if (!proc) return <Fallback id={id} />;
      return (
        <>
          <Row label="Procesamiento">{proc.id}</Row>
          <Row label="Planta">{proc.plant}</Row>
          <Row label="Línea">{proc.line}</Row>
          <Row label="Fecha">{sourcedDate(proc.date)}</Row>
          <Row label="Hora">{proc.time}</Row>
          <Row label="Operador">{proc.operator}</Row>
          <Row label="Recibido">{formatNumber(proc.kgReceived)} kg</Row>
          <Row label="Salida">{formatNumber(proc.kgOutput)} kg</Row>
        </>
      );
    }
    case "box": {
      const box = getBox(id);
      const lot = box ? getPackingLot(box.packingLotId) : undefined;
      return (
        <>
          <Row label="Caja">{id}</Row>
          {box && <Row label="Peso">{box.weightKg} kg</Row>}
          {box && <Row label="Clamshells">{box.clamshellCount}</Row>}
          <Row label="Lote">
            <Chip type="packingLot" id={box?.packingLotId ?? lot?.id ?? id} />
          </Row>
          {box && (
            <Row label="Pallet">
              <Chip type="pallet" id={box.palletId} />
            </Row>
          )}
        </>
      );
    }
    case "pallet": {
      const pallet = getPallet(id);
      if (!pallet) return <Fallback id={id} />;
      return (
        <>
          <Row label="Pallet">{pallet.id}</Row>
          <Row label="SSCC">{pallet.sscc}</Row>
          <Row label="Cajas">
            {pallet.boxFrom} a {pallet.boxTo} ({pallet.boxCount})
          </Row>
          <Row label="Lote">
            <Chip type="packingLot" id={pallet.packingLotId} />
          </Row>
          <Row label="Contenedor">
            <Chip type="container" id={pallet.containerId} />
          </Row>
        </>
      );
    }
    case "container": {
      const container = getContainer(id);
      if (!container) return <Fallback id={id} />;
      return (
        <>
          <Row label="Contenedor">{container.id}</Row>
          <Row label="Nave">{container.vessel}</Row>
          <Row label="Precinto">{container.seal}</Row>
          <Row label="Booking">
            <Chip type="booking" id={container.bookingId} />
          </Row>
          <Row label="Puerto de salida">
            <SourcedValue data={container.departurePort} />
          </Row>
          <Row label="Puerto de destino">
            <SourcedValue data={container.destinationPort} />
          </Row>
          <Row label="Zarpe">{sourcedDate(container.departureDate)}</Row>
          <Row label="ETA">{formatDate(container.eta)}</Row>
          <div className="sm:col-span-2">
            <Row label="Pallets">
              <div className="flex flex-wrap gap-1.5">
                {container.palletIds.map((p) => (
                  <Chip key={p} type="pallet" id={p} />
                ))}
              </div>
            </Row>
          </div>
        </>
      );
    }
    case "booking": {
      const booking = getBooking(id);
      if (!booking) return <Fallback id={id} />;
      return (
        <>
          <Row label="Booking">{booking.id}</Row>
          <Row label="Naviera">{booking.carrier}</Row>
          <Row label="Origen">{booking.origin}</Row>
          <Row label="Destino">{booking.destination}</Row>
          <Row label="ETD">{formatDate(booking.etd)}</Row>
          <Row label="ETA">{formatDate(booking.eta)}</Row>
          <Row label="Importador">
            <Chip type="importer" id={booking.importerId}>{getImporter(booking.importerId)?.name ?? booking.importerId}</Chip>
          </Row>
          <Row label="Contenedor">
            <Chip type="container" id={booking.containerIds[0] ?? ""} />
          </Row>
        </>
      );
    }
    case "importer": {
      const importer = getImporter(id);
      if (!importer) return <Fallback id={id} />;
      return (
        <>
          <Row label="Importador">{importer.name}</Row>
          <Row label="Código">{importer.code}</Row>
          <Row label="País">{importer.country}</Row>
          <Row label="Contacto">{importer.contact}</Row>
        </>
      );
    }
    case "distributionCenter": {
      const cd = getDistributionCenter(id);
      if (!cd) return <Fallback id={id} />;
      return (
        <>
          <Row label="Centro">{cd.name}</Row>
          <Row label="Código">{cd.code}</Row>
          <Row label="Ciudad">{cd.city}</Row>
          <Row label="País">{cd.country}</Row>
        </>
      );
    }
    case "supermarket": {
      const sm = getSupermarket(id);
      if (!sm) return <Fallback id={id} />;
      return (
        <>
          <Row label="Punto de venta">{sm.name}</Row>
          <Row label="Cadena">{sm.chain}</Row>
          <Row label="Ciudad">{sm.city}</Row>
          <Row label="País">{sm.country}</Row>
        </>
      );
    }
    case "qrCode": {
      const qr = qrCodes.find((item) => item.id === id);
      const lot = qr ? getPackingLot(qr.packingLotId) : undefined;
      if (!qr) return <Fallback id={id} />;
      return (
        <>
          <Row label="Código QR">{qr.id}</Row>
          <Row label="Aplicación">Después del empaque, en cada clamshell del lote</Row>
          <Row label="Unicidad">Mismo QR de lote. No hay código por unidad</Row>
          <Row label="Lote de empaque">
            <Chip type="packingLot" id={qr.packingLotId} />
          </Row>
          <Row label="Clamshells etiquetados">{lot ? formatNumber(lot.clamshellCount) : "—"}</Row>
          <Row label="Impreso">{sourcedDate(qr.printedAt)}</Row>
          <Row label="Estado">{qr.status}</Row>
        </>
      );
    }
    case "supplier": {
      const supplier = getSupplier(id);
      if (!supplier) return <Fallback id={id} />;
      return (
        <>
          <Row label="Proveedor">{supplier.name}</Row>
          <Row label="Código">{supplier.code}</Row>
          <Row label="Estado">
            <StatusBadge status={supplier.status} />
          </Row>
          <Row label="Contacto">{supplier.contact}</Row>
          <Row label="Productos">{supplier.productsServices}</Row>
          <Row label="Última entrega">{formatDate(supplier.lastDelivery)}</Row>
          <div className="sm:col-span-2">
            <Row label="Lotes relacionados">
              <div className="flex flex-wrap gap-1.5">
                {supplier.relatedLotIds.map((lotId) => (
                  <Chip key={lotId} type="packingLot" id={lotId} />
                ))}
              </div>
            </Row>
          </div>
        </>
      );
    }
    default:
      return <Fallback id={id} />;
  }
}

function Fallback({ id }: { id: string }) {
  return (
    <Row label="Identificador">
      <span className="inline-flex items-center gap-1">
        {id}
        <DataSourceBadge source={{ system: "Zhenda", source: "Capa de interoperabilidad Zhenda", updatedAt: "2026-08-22T10:00:00-05:00" }} />
      </span>
    </Row>
  );
}


import { company, harvestCrews, nurseries, qrCodes, receptions, transports } from "@/data";
import { formatDate, formatDateTime } from "@/lib/format";
import {
  getBooking,
  getContainer,
  getDistributionCenter,
  getFarm,
  getHarvest,
  getImporter,
  getPackingLot,
  getPallet,
  getPlot,
  getProcessingLot,
  getSupermarket,
} from "@/lib/queries";
import type { EntityType, GraphNode } from "@/types";

export interface TimelineRow {
  node: GraphNode;
  metric?: string;
  when?: string;
  whenLabel?: string;
}

export interface JourneySummary {
  campaign: string;
  origin?: string;
  harvestDate?: string;
  harvestRelative?: string;
  crates?: string;
  qr?: string;
  pallet?: string;
  container?: string;
}

export function flattenTree(node: GraphNode): GraphNode[] {
  return [node, ...node.children.flatMap(flattenTree)];
}

export function buildTimeline(root: GraphNode): TimelineRow[] {
  return flattenTree(root).map((node) => ({ node, ...rowFacts(node) }));
}

export function journeySummary(root: GraphNode): JourneySummary {
  const nodes = flattenTree(root);
  const harvestNode = nodes.find((n) => n.type === "harvest");
  const plotNode = nodes.find((n) => n.type === "plot");
  const harvest = harvestNode ? getHarvest(harvestNode.id) : undefined;
  const plot = plotNode ? getPlot(plotNode.id) : undefined;
  const harvestIso = harvest?.date.source.updatedAt ?? harvest?.date.value;

  const qr = nodes.find((n) => n.type === "qrCode");
  const pallet = nodes.find((n) => n.type === "pallet");
  const container = nodes.find((n) => n.type === "container");

  return {
    campaign: company.campaign,
    origin: plot ? `${plot.code} · ${plot.variety}` : undefined,
    harvestDate: harvestIso ? formatDate(harvestIso) : undefined,
    harvestRelative: harvestIso ? relativeDays(harvestIso) : undefined,
    crates: harvest ? `${harvest.crateCount} jabas` : undefined,
    qr: qr?.label,
    pallet: pallet?.label,
    container: container?.label,
  };
}

function rowFacts(node: GraphNode): Pick<TimelineRow, "metric" | "when" | "whenLabel"> {
  const id = node.id.split(",")[0];
  switch (node.type) {
    case "packingLot": {
      const lot = getPackingLot(id);
      if (!lot) return fallback(node, "Creado");
      return {
        metric: `${lot.boxCount} cajas · ${lot.clamshellCount} clamshells`,
        when: formatDateTime(lot.packingDate.source.updatedAt),
        whenLabel: "Creado",
      };
    }
    case "processingLot": {
      const proc = getProcessingLot(id);
      if (!proc) return fallback(node, "Procesado");
      return {
        metric: `${proc.plant} · ${proc.kgOutput} kg salida`,
        when: formatDateTime(proc.date.source.updatedAt),
        whenLabel: "Procesado",
      };
    }
    case "reception": {
      const recp = receptions.find((r) => r.id === id);
      if (!recp) return fallback(node, "Recepcionado");
      return {
        metric: `${recp.kgReceived} kg · ${recp.plant}`,
        when: formatDateTime(recp.date.source.updatedAt),
        whenLabel: "Recepcionado",
      };
    }
    case "transport": {
      const trip = transports.find((t) => t.id === id);
      if (!trip) return fallback(node, "Salida");
      return {
        metric: `${trip.fromLabel} → ${trip.toLabel}`,
        when: formatDateTime(trip.date.source.updatedAt),
        whenLabel: "Salida",
      };
    }
    case "crate": {
      const harvest = id.startsWith("JABAS-") ? getHarvest(id.replace("JABAS-", "")) : getHarvest(node.subtitle ?? "");
      return {
        metric: harvest ? `${harvest.crateCount} jabas` : node.subtitle,
        when: harvest ? formatDateTime(harvest.date.source.updatedAt) : undefined,
        whenLabel: "En recorrido",
      };
    }
    case "harvest": {
      const harvest = getHarvest(id);
      if (!harvest) return fallback(node, "Cosecha");
      return {
        metric: `${harvest.crateCount} jabas · ${harvest.kgHarvested} kg`,
        when: formatDateTime(harvest.date.source.updatedAt),
        whenLabel: "Cosecha",
      };
    }
    case "plot": {
      const plot = getPlot(id);
      if (!plot) return fallback(node);
      return {
        metric: `Área ${plot.hectares} ha · ${plot.variety}`,
        when: `Siembra ${plot.plantingYear}`,
        whenLabel: "Parcela",
      };
    }
    case "farm": {
      const farm = getFarm(id);
      if (!farm) return fallback(node);
      return {
        metric: `${farm.region} · ${farm.hectares} ha`,
        when: farm.district,
        whenLabel: "Fundo",
      };
    }
    case "nursery": {
      const nursery = nurseries.find((n) => n.id === id);
      if (!nursery) return fallback(node, "Recibido");
      return {
        metric: `${nursery.variety} · ${nursery.area}`,
        when: formatDate(nursery.receivedAt.source.updatedAt),
        whenLabel: "Recibido",
      };
    }
    case "harvestCrew": {
      const crew = harvestCrews.find((c) => c.id === id);
      if (!crew) return fallback(node);
      return {
        metric: `${crew.workerCount} trabajadores · ${crew.shift}`,
        when: formatDate(crew.date),
        whenLabel: "Turno",
      };
    }
    case "qrCode": {
      const qr = qrCodes.find((item) => item.id === id);
      const lot = qr ? getPackingLot(qr.packingLotId) : getPackingLot(node.subtitle ?? "");
      return {
        metric: lot ? `${lot.clamshellCount} clamshells · mismo QR de lote` : "Aplicado después del empaque",
        when: qr ? formatDateTime(qr.printedAt.source.updatedAt) : undefined,
        whenLabel: "Aplicado",
      };
    }
    case "box":
      return { metric: "Caja de exportación", when: node.subtitle, whenLabel: "Empaque" };
    case "pallet": {
      const pallet = getPallet(id);
      return {
        metric: pallet ? `${pallet.boxCount} cajas` : node.subtitle,
        when: pallet?.sscc,
        whenLabel: "Pallet",
      };
    }
    case "container": {
      const container = getContainer(id);
      return {
        metric: container?.vessel,
        when: container ? formatDate(container.departureDate.value) : undefined,
        whenLabel: "ETD",
      };
    }
    case "booking": {
      const booking = getBooking(id);
      return { metric: booking?.carrier, when: booking?.etd ? formatDate(booking.etd) : undefined, whenLabel: "ETD" };
    }
    case "importer": {
      const importer = getImporter(id);
      return { metric: importer?.country, when: importer?.name, whenLabel: "Destino" };
    }
    case "distributionCenter": {
      const cd = getDistributionCenter(id);
      return { metric: cd ? `${cd.city}` : node.subtitle, when: cd?.country, whenLabel: "CD" };
    }
    case "supermarket": {
      const sm = getSupermarket(id);
      return { metric: sm ? `${sm.city}, ${sm.country}` : node.subtitle, when: sm?.chain, whenLabel: "Retail" };
    }
    default:
      return fallback(node);
  }
}

function fallback(node: GraphNode, whenLabel?: string) {
  return { metric: node.subtitle, when: undefined, whenLabel };
}

function relativeDays(iso: string): string {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return "";
  const days = Math.max(0, Math.round((Date.now() - then) / 86_400_000));
  if (days === 0) return "Hoy";
  if (days === 1) return "Hace 1 día";
  return `Hace ${days} días`;
}

export function defaultFocusType(mode: "origen" | "destino" | "relaciones"): EntityType | undefined {
  if (mode === "origen") return "plot";
  if (mode === "destino") return "supermarket";
  return undefined;
}

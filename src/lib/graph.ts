import {
  bookings,
  boxes,
  certifications,
  clamshellBatches,
  containers,
  crates,
  destinations,
  distributionCenters,
  farms,
  harvestCrews,
  harvests,
  importers,
  inputLots,
  nurseries,
  packingLots,
  pallets,
  plots,
  processingLots,
  qrCodes,
  qualityControls,
  receptions,
  supermarkets,
  suppliers,
  transports,
} from "@/data";
import type {
  EntityType,
  ExplorerMode,
  ExplorerRefGroup,
  ExplorerViewModel,
  GraphNode,
  IdentifierLink,
  IdentifierRecord,
  TraceInputGroup,
  TraceNode,
} from "@/types";
import { entityTypeLabel } from "@/lib/format";

const records = new Map<string, IdentifierRecord>();
const aliases = new Map<string, string>();
const links: IdentifierLink[] = [];

function rec(partial: Omit<IdentifierRecord, "aliases"> & { aliases?: string[] }): IdentifierRecord {
  const item: IdentifierRecord = { aliases: [], ...partial };
  records.set(item.id, item);
  aliases.set(item.id.toUpperCase(), item.id);
  for (const a of item.aliases) aliases.set(a.toUpperCase(), item.id);
  return item;
}

function flow(fromId: string, toId: string, relation: string, scopeLotIds?: string[]) {
  links.push({ fromId, toId, kind: "flow", relation, scopeLotIds });
}

function uses(fromId: string, toId: string, relation = "Utiliza insumo") {
  links.push({ fromId, toId, kind: "uses", relation });
}

function supplied(fromId: string, toId: string, relation = "Suministrado por") {
  links.push({ fromId, toId, kind: "supplied_by", relation });
}

function attests(fromId: string, toId: string, relation: string) {
  links.push({ fromId, toId, kind: "attests", relation });
}

function nodeFrom(id: string, extra?: Partial<GraphNode>): GraphNode {
  const r = records.get(id);
  return {
    id,
    type: r?.type ?? "packingLot",
    label: r?.label ?? id,
    subtitle: r?.subtitle,
    sourceSystem: r?.sourceSystem,
    children: [],
    ...extra,
  };
}

function seed() {
  if (records.size) return;

  for (const n of nurseries) {
    rec({
      id: n.id,
      type: "nursery",
      label: n.id,
      subtitle: n.name,
      product: `Arándano · ${n.variety}`,
      status: n.status,
      sourceSystem: n.sourceSystem,
      area: n.area,
      updatedAt: n.receivedAt.source.updatedAt,
      originalId: n.id,
      sourceName: n.receivedAt.source.source,
    });
  }

  for (const farm of farms) {
    rec({
      id: farm.id,
      aliases: [farm.code, farm.name],
      type: "farm",
      label: farm.name,
      subtitle: `${farm.region} · ${farm.district}`,
      product: "Arándano fresco",
      status: farm.status,
      sourceSystem: "AgroSoft",
      area: farm.name,
      updatedAt: "2026-07-18T16:42:00-05:00",
      originalId: farm.id,
      sourceName: "Sistema agrícola AgroSoft",
    });
  }

  for (const plot of plots) {
    rec({
      id: plot.id,
      aliases: [plot.code, `PAR-${plot.id}`, plot.id.replace("P-", "PAR-P")],
      type: "plot",
      label: plot.code,
      subtitle: `Parcela · ${plot.variety}`,
      product: `Arándano · ${plot.variety}`,
      status: "activa",
      sourceSystem: "AgroSoft",
      area: farms.find((f) => f.id === plot.farmId)?.name ?? "Campo",
      updatedAt: "2026-07-18T16:42:00-05:00",
      originalId: plot.id,
      sourceName: "Sistema agrícola AgroSoft",
    });
    if (plot.nurseryId) flow(plot.nurseryId, plot.id, "Plantado en");
    flow(plot.farmId, plot.id, "Incluye");
  }

  for (const harvest of harvests) {
    rec({
      id: harvest.id,
      type: "harvest",
      label: harvest.id,
      subtitle: harvest.date.value,
      product: `Arándano · ${harvest.variety}`,
      status: "cerrada",
      sourceSystem: "AgroSoft",
      area: farms.find((f) => f.id === harvest.farmId)?.name ?? "Campo",
      updatedAt: harvest.date.source.updatedAt,
      originalId: harvest.id,
      sourceName: harvest.date.source.source,
    });
    flow(harvest.plotId, harvest.id, "Cosechado en");
    if (harvest.crewId) flow(harvest.crewId, harvest.id, "Cosechó");

    const groupId = `JABAS-${harvest.id}`;
    rec({
      id: groupId,
      aliases: [`${harvest.crateFrom}:${harvest.crateTo}`],
      type: "crate",
      label: `Jabas ${harvest.crateFrom} a ${harvest.crateTo}`,
      subtitle: `${harvest.crateCount} jabas`,
      product: `Arándano · ${harvest.variety}`,
      status: "recibidas",
      sourceSystem: "AgroSoft",
      area: "Campo / transporte",
      updatedAt: harvest.date.source.updatedAt,
      originalId: harvest.crateFrom,
      sourceName: harvest.date.source.source,
    });
    flow(harvest.id, groupId, "Enviada en");
  }

  for (const crew of harvestCrews) {
    rec({
      id: crew.id,
      type: "harvestCrew",
      label: crew.id,
      subtitle: `${crew.name} · ${crew.workerCount} trabajadores`,
      product: "Cosecha",
      status: "registrada",
      sourceSystem: "AgroSoft",
      area: farms.find((f) => f.id === crew.farmId)?.name ?? "Campo",
      updatedAt: `${crew.date}T16:00:00-05:00`,
      originalId: crew.id,
      sourceName: "Sistema agrícola AgroSoft",
    });
  }

  for (const crate of crates) {
    rec({
      id: crate.id,
      type: "crate",
      label: crate.id,
      subtitle: crate.harvestId,
      product: "Arándano fresco",
      status: "recibida",
      sourceSystem: "AgroSoft",
      area: "Campo",
      updatedAt: crate.receivedAt,
      originalId: crate.id,
      sourceName: "Sistema agrícola AgroSoft",
    });
    const harvest = harvests.find((h) => h.id === crate.harvestId);
    if (harvest) flow(harvest.id, crate.id, "Contiene");
  }

  for (const tr of transports) {
    rec({
      id: tr.id,
      type: "transport",
      label: tr.id,
      subtitle: `${tr.fromLabel} → ${tr.toLabel}`,
      product: "Arándano fresco",
      status: tr.status,
      sourceSystem: "AgroSoft",
      area: "Logística de campo",
      updatedAt: tr.date.source.updatedAt,
      originalId: tr.id,
      sourceName: tr.date.source.source,
    });
    flow(`JABAS-${tr.harvestId}`, tr.id, "Trasladado en");
    const harvest = harvests.find((h) => h.id === tr.harvestId);
    if (harvest) {
      for (const crate of crates.filter((c) => c.harvestId === harvest.id)) {
        flow(crate.id, tr.id, "Trasladado en");
      }
    }
  }

  for (const recp of receptions) {
    rec({
      id: recp.id,
      type: "reception",
      label: recp.id,
      subtitle: recp.plant,
      product: "Arándano fresco",
      status: recp.status,
      sourceSystem: "PlantOS",
      area: recp.plant,
      updatedAt: recp.date.source.updatedAt,
      originalId: recp.id,
      sourceName: recp.date.source.source,
    });
    flow(recp.transportId, recp.id, "Recibido como");
  }

  for (const proc of processingLots) {
    rec({
      id: proc.id,
      type: "processingLot",
      label: proc.id,
      subtitle: proc.plant,
      product: "Arándano fresco",
      status: "conforme",
      sourceSystem: "PlantOS",
      area: proc.plant,
      updatedAt: proc.date.source.updatedAt,
      originalId: proc.id,
      sourceName: proc.date.source.source,
    });
    if (proc.receptionId) flow(proc.receptionId, proc.id, "Ingresa a");
  }

  for (const lot of packingLots) {
    rec({
      id: lot.id,
      type: "packingLot",
      label: lot.id,
      subtitle: `Arándano fresco · ${lot.variety}`,
      product: `Arándano fresco · ${lot.variety}`,
      status: lot.status,
      sourceSystem: "PackLine",
      area: "Planta Chao · empaque",
      updatedAt: lot.packingDate.source.updatedAt,
      originalId: lot.id,
      sourceName: lot.packingDate.source.source,
    });
    flow(lot.processingLotId, lot.id, "Da origen a");

    const boxGroup = `CAJAS-${lot.id}`;
    rec({
      id: boxGroup,
      aliases: [lot.boxFrom, lot.boxTo],
      type: "box",
      label: `Cajas ${lot.boxFrom} a ${lot.boxTo}`,
      subtitle: `${lot.boxCount} cajas de producto`,
      product: lot.variety,
      status: lot.status,
      sourceSystem: "PackLine",
      area: "Planta Chao · empaque",
      updatedAt: lot.packingDate.source.updatedAt,
      originalId: lot.boxFrom,
      sourceName: lot.packingDate.source.source,
    });
    const hasLotQr = qrCodes.some((q) => q.packingLotId === lot.id);
    if (!hasLotQr) flow(lot.id, boxGroup, "Empacado en");
  }

  for (const qr of qrCodes) {
    const lot = packingLots.find((item) => item.id === qr.packingLotId);
    rec({
      id: qr.id,
      aliases: lot ? [`CLAMS-${lot.id}`] : [],
      type: "qrCode",
      label: qr.id,
      subtitle: lot ? `Pegado en ${lot.clamshellCount} clamshells` : "QR de clamshells del lote",
      product: lot ? `Arándano fresco · ${lot.variety}` : "Arándano fresco",
      status: qr.status,
      sourceSystem: "PackLine",
      area: "Planta Chao · empaque",
      updatedAt: qr.printedAt.source.updatedAt,
      originalId: qr.id,
      sourceName: qr.printedAt.source.source,
    });
    flow(qr.packingLotId, qr.id, "QR aplicado a clamshells");
    flow(qr.id, `CAJAS-${qr.packingLotId}`, "Colocado en cajas");
  }

  for (const box of boxes) {
    rec({
      id: box.id,
      type: "box",
      label: box.id,
      subtitle: box.packingLotId,
      product: "Arándano fresco",
      status: "empacada",
      sourceSystem: "PackLine",
      area: "Planta Chao",
      updatedAt: "2026-07-18T23:10:00-05:00",
      originalId: box.id,
      sourceName: "Sistema de empaque PackLine",
    });
    flow(`CAJAS-${box.packingLotId}`, box.id, "Incluye");
    flow(box.id, box.palletId, "Agrupada en");
  }

  for (const pallet of pallets) {
    rec({
      id: pallet.id,
      type: "pallet",
      label: pallet.id,
      subtitle: `${pallet.boxCount} cajas`,
      product: "Arándano fresco",
      status: "despachado",
      sourceSystem: "ERP Valle Azul",
      area: "Logística de planta",
      updatedAt: "2026-07-19T06:00:00-05:00",
      originalId: pallet.id,
      sourceName: "Sistema Logístico ERP",
    });
    flow(`CAJAS-${pallet.packingLotId}`, pallet.id, "Agrupadas en");
    flow(pallet.id, pallet.containerId, "Cargado en");
  }

  for (const container of containers) {
    rec({
      id: container.id,
      aliases: [`CONT-${container.id}`],
      type: "container",
      label: container.id,
      subtitle: container.vessel,
      product: "Arándano fresco",
      status: "en tránsito",
      sourceSystem: "ERP Valle Azul",
      area: "Logística de exportación",
      updatedAt: container.departureDate.source.updatedAt,
      originalId: container.id,
      sourceName: container.departureDate.source.source,
    });
    flow(container.id, container.bookingId, "Documentado en");
  }

  for (const booking of bookings) {
    rec({
      id: booking.id,
      type: "booking",
      label: booking.id,
      subtitle: booking.carrier,
      product: "Arándano fresco",
      status: "confirmado",
      sourceSystem: "ERP Valle Azul",
      area: "Logística de exportación",
      updatedAt: `${booking.etd}T09:00:00-05:00`,
      originalId: booking.id,
      sourceName: "Sistema Logístico ERP",
    });
    flow(booking.id, booking.importerId, "Recibido por");
  }

  for (const importer of importers) {
    rec({
      id: importer.id,
      aliases: [importer.code, importer.name],
      type: "importer",
      label: importer.name,
      subtitle: importer.country,
      product: "Arándano fresco",
      status: "activo",
      sourceSystem: "TradeDoc",
      area: importer.country,
      updatedAt: "2026-08-08T10:00:00-05:00",
      originalId: importer.id,
      sourceName: "Portal del importador",
    });
  }

  for (const cd of distributionCenters) {
    rec({
      id: cd.id,
      aliases: [cd.code],
      type: "distributionCenter",
      label: `${cd.code} · ${cd.name}`,
      subtitle: cd.city,
      status: "operativo",
      sourceSystem: "TradeDoc",
      area: cd.country,
      updatedAt: "2026-08-10T08:00:00-05:00",
      originalId: cd.id,
      sourceName: "Portal del importador",
    });
  }

  for (const sm of supermarkets) {
    rec({
      id: sm.id,
      aliases: [sm.name, sm.chain],
      type: "supermarket",
      label: sm.name,
      subtitle: `${sm.city}, ${sm.country}`,
      status: "en tienda",
      sourceSystem: "TradeDoc",
      area: sm.country,
      updatedAt: "2026-08-12T09:00:00-05:00",
      originalId: sm.id,
      sourceName: "Portal del supermercado",
    });
  }

  aliases.set("SM-014", "SM-FM");
  aliases.set("SM-018", "SM-GM");
  aliases.set("SM-022", "SM-FC");

  for (const dest of destinations) {
    const lot = packingLots.find((l) => l.id === dest.packingLotId);
    if (!lot) continue;
    flow(dest.importerId, dest.distributionCenterId, "Distribuido desde", [dest.packingLotId]);
    flow(dest.distributionCenterId, dest.supermarketId, "Exhibido en", [dest.packingLotId]);
  }

  for (const batch of clamshellBatches) {
    rec({
      id: batch.id,
      type: "clamshellBatch",
      label: batch.id,
      subtitle: "Lote de clamshell",
      product: "Clamshell PET 125 g",
      status: batch.status,
      sourceSystem: "ERP Valle Azul",
      area: "Almacén de insumos",
      updatedAt: batch.receivedAt.source.updatedAt,
      originalId: batch.id,
      sourceName: batch.receivedAt.source.source,
    });
    supplied(batch.id, batch.supplierId);
    for (const lotId of batch.relatedPackingLotIds) uses(lotId, batch.id);
  }

  for (const lot of inputLots) {
    rec({
      id: lot.id,
      aliases: lot.kind === "caja" ? ["CAJ-260718-14", "CX-2026-051"] : lot.kind === "etiqueta" ? ["ETQ-260718-08", "ETQ-2026-018"] : [],
      type: "inputLot",
      label: lot.id,
      subtitle: lot.name,
      product: lot.name,
      status: lot.status,
      sourceSystem: "ERP Valle Azul",
      area: "Almacén de insumos",
      updatedAt: lot.receivedAt.source.updatedAt,
      originalId: lot.id,
      sourceName: lot.receivedAt.source.source,
    });
    supplied(lot.id, lot.supplierId);
    for (const lotId of lot.relatedPackingLotIds) uses(lotId, lot.id);
  }

  for (const supplier of suppliers) {
    rec({
      id: supplier.id,
      aliases: [supplier.code, supplier.name],
      type: "supplier",
      label: supplier.name,
      subtitle: supplier.code,
      status: supplier.status,
      sourceSystem: supplier.type === "agricola" ? "AgroSoft" : "ERP Valle Azul",
      area: supplier.type === "agricola" ? "Proveedor agrícola" : "Proveedor de insumos",
      updatedAt: `${supplier.lastDelivery}T10:00:00-05:00`,
      originalId: supplier.id,
      sourceName: "Maestro de proveedores",
    });
  }

  for (const qc of qualityControls) {
    rec({
      id: qc.id,
      type: "qualityControl",
      label: qc.id,
      subtitle: `${qc.type} · ${qc.result.value}`,
      product: "Arándano fresco",
      status: qc.result.value,
      sourceSystem: "QMS",
      area: "Calidad · Planta Chao",
      updatedAt: qc.date.source.updatedAt,
      originalId: qc.id,
      sourceName: qc.date.source.source,
    });
    attests(qc.packingLotId, qc.id, "Liberación de calidad");
  }

  for (const cert of certifications) {
    rec({
      id: cert.id,
      aliases: [cert.code],
      type: "certification",
      label: cert.code,
      subtitle: `${cert.name} · ${cert.relatedEntityLabel}`,
      status: cert.status,
      sourceSystem: "QMS",
      area: cert.relatedEntityLabel,
      updatedAt: `${cert.issuedAt}T09:00:00-05:00`,
      originalId: cert.id,
      sourceName: "Repositorio de certificaciones",
    });
    attests(cert.relatedEntityId, cert.id, cert.name);
  }
}

seed();

export function resolveIdentifier(q: string): IdentifierRecord | null {
  seed();
  const raw = q.trim();
  if (!raw) return records.get("EMP-2026-0841") ?? null;
  const key = raw.toUpperCase();
  const id = aliases.get(key);
  if (id) return records.get(id) ?? null;
  for (const item of records.values()) {
    if (item.label.toUpperCase() === key || item.id.toUpperCase() === key) return item;
  }
  for (const item of records.values()) {
    if (item.id.toUpperCase().includes(key) || item.label.toUpperCase().includes(key)) return item;
  }
  return null;
}

export function getIdentifier(id: string): IdentifierRecord | undefined {
  seed();
  return records.get(aliases.get(id.toUpperCase()) ?? id);
}

function outgoing(id: string, kinds: IdentifierLink["kind"][]) {
  return links.filter((l) => l.fromId === id && kinds.includes(l.kind));
}

function incoming(id: string, kinds: IdentifierLink["kind"][]) {
  return links.filter((l) => l.toId === id && kinds.includes(l.kind));
}

function inferScope(id: string): Set<string> | null {
  const r = records.get(id);
  if (!r) return null;
  if (r.type === "packingLot") return new Set([id]);
  if (r.type === "qrCode") {
    const qr = qrCodes.find((q) => q.id === id);
    return qr ? new Set([qr.packingLotId]) : null;
  }
  if (r.type === "pallet") {
    const pallet = pallets.find((p) => p.id === id);
    return pallet ? new Set([pallet.packingLotId]) : null;
  }
  if (r.type === "box") {
    const box = boxes.find((b) => b.id === id);
    if (box) return new Set([box.packingLotId]);
    if (id.startsWith("CAJAS-")) return new Set([id.replace("CAJAS-", "")]);
  }
  return null;
}

function walk(
  id: string,
  direction: "up" | "down",
  kinds: IdentifierLink["kind"][],
  seen: Set<string>,
  depth: number,
  scope: Set<string> | null = inferScope(id),
): GraphNode {
  const current = nodeFrom(id);
  if (seen.has(id) || depth > 10) return current;
  seen.add(id);

  const edges = direction === "down" ? outgoing(id, kinds) : incoming(id, kinds);
  const nextIds = new Map<string, string>();
  for (const edge of edges) {
    const next = direction === "down" ? edge.toId : edge.fromId;
    if (!records.has(next)) continue;
    if (shouldSkipChild(id, next, direction)) continue;
    if (edge.scopeLotIds && scope && !edge.scopeLotIds.some((lotId) => scope.has(lotId))) continue;
    nextIds.set(next, direction === "up" ? invertRelation(edge.relation) : edge.relation);
  }

  current.children = [...nextIds.entries()].map(([next, relation]) => {
    const childScope = scope ?? inferScope(next) ?? (edges.find((e) => (direction === "down" ? e.toId : e.fromId) === next)?.scopeLotIds
      ? new Set(edges.find((e) => (direction === "down" ? e.toId : e.fromId) === next)!.scopeLotIds)
      : null);
    const child = walk(next, direction, kinds, new Set(seen), depth + 1, childScope);
    return { ...child, relation };
  });
  return current;
}

const INVERSE_RELATIONS: Record<string, string> = {
  "Da origen a": "Procesado a partir de",
  "Ingresa a": "Recepcionado como",
  "Recibido como": "Recibido desde",
  "Trasladado en": "Recibido desde",
  "Enviada en": "Corresponden a",
  "Contiene": "Corresponden a",
  "Cosechado en": "Cosechado en",
  "Cosechó": "Cosechada por",
  "Plantado en": "Proviene de",
  "Incluye": "Pertenece a",
  "Identificado por": "Identifica a",
  "QR aplicado a clamshells": "Etiqueta del lote",
  "Colocado en cajas": "Contiene clamshells con",
  "Empacado en": "Contiene",
  "Agrupado en": "Formado por",
  "Agrupadas en": "Formado por",
  "Cargado en": "Transporta",
  "Documentado en": "Documenta",
  "Recibido por": "Recibió",
  "Distribuido desde": "Alimenta a",
  "Exhibido en": "Recibe de",
};

function invertRelation(relation: string): string {
  return INVERSE_RELATIONS[relation] ?? relation;
}

function shouldSkipChild(parentId: string, childId: string, direction: "up" | "down"): boolean {
  const parent = records.get(parentId);
  const child = records.get(childId);
  if (!parent || !child) return true;
  if (direction === "up" && parent.type === "transport" && child.type === "crate" && !childId.startsWith("JABAS-")) {
    return true;
  }
  if (parent.type === "harvest" && child.type === "crate" && !childId.startsWith("JABAS-") && direction === "down") {
    return true;
  }
  if (parent.type === "crate" && parentId.startsWith("JABAS-") && child.type === "crate" && direction === "down") {
    return true;
  }
  if (parent.type === "box" && parentId.startsWith("CAJAS-") && child.type === "box" && direction === "down") {
    return true;
  }
  if (child.type === "box" && !childId.startsWith("CAJAS-") && parent.type === "packingLot") return true;
  if (direction === "up" && parent.type === "crate" && !parentId.startsWith("JABAS-") && child.type === "harvest") {
    return false;
  }
  return false;
}

function inputGroups(id: string): TraceInputGroup[] {
  const used = outgoing(id, ["uses"]);
  const groups: TraceInputGroup[] = [];
  for (const edge of used) {
    const batch = records.get(edge.toId);
    if (!batch) continue;
    const supplierEdge = outgoing(edge.toId, ["supplied_by"])[0];
    const supplier = supplierEdge ? records.get(supplierEdge.toId) : undefined;
    const kind = batch.id.startsWith("CL-") ? "clamshell" : batch.id.startsWith("ETQ-") ? "etiqueta" : "caja";
    const title = kind === "clamshell" ? "Clamshell" : kind === "etiqueta" ? "Etiqueta" : "Caja";
    const batchNode: TraceNode = {
      type: batch.type,
      id: batch.id,
      label: batch.label,
      subtitle: batch.subtitle,
      relation: "Utiliza insumo",
      branch: "input",
    };
    groups.push({
      kind,
      title,
      batch: batchNode,
      supplier: supplier
        ? {
            type: supplier.type,
            id: supplier.id,
            label: supplier.label,
            subtitle: supplier.subtitle,
            relation: "Suministrado por",
            branch: "input",
          }
        : undefined,
    });
  }
  return groups;
}

function qualityGroups(id: string): ExplorerRefGroup[] {
  const groups: ExplorerRefGroup[] = [];
  const seen = new Set<string>();

  const pushEdge = (fromId: string) => {
    for (const edge of outgoing(fromId, ["attests"])) {
      const item = records.get(edge.toId);
      if (!item || seen.has(item.id)) continue;
      seen.add(item.id);
      groups.push({
        title: edge.relation,
        node: {
          type: item.type,
          id: item.id,
          label: item.label,
          subtitle: item.subtitle,
          branch: "input",
        },
        note: item.sourceSystem,
      });
    }
  };

  pushEdge(id);
  const current = records.get(id);
  if (current?.type === "packingLot") {
    const lot = packingLots.find((l) => l.id === id);
    const harvest = harvests.find((h) => h.id === lot?.harvestIds[0]);
    if (harvest) pushEdge(harvest.farmId);
  }
  if (current?.type === "farm" || current?.type === "plot" || current?.type === "harvest") {
    const harvest = harvests.find((h) => h.id === id);
    const plot = plots.find((p) => p.id === id);
    const farmId = harvest?.farmId ?? plot?.farmId ?? (current.type === "farm" ? id : undefined);
    if (farmId) pushEdge(farmId);
  }
  return groups;
}

function relationTree(id: string): GraphNode {
  const down = walk(id, "down", ["flow"], new Set(), 0);
  const up = walk(id, "up", ["flow"], new Set(), 0);
  const used = outgoing(id, ["uses"]);
  const usedBy = incoming(id, ["uses"]);
  const suppliedBy = outgoing(id, ["supplied_by"]);
  const attested = outgoing(id, ["attests"]);

  const extras: GraphNode[] = [];
  for (const edge of used) {
    extras.push({ ...nodeFrom(edge.toId, { relation: edge.relation, branch: "input" }), children: walk(edge.toId, "down", ["supplied_by"], new Set(), 0).children });
  }
  for (const edge of usedBy) {
    extras.push(nodeFrom(edge.fromId, { relation: "Utilizado en", branch: "input" }));
  }
  for (const edge of suppliedBy) {
    extras.push(nodeFrom(edge.toId, { relation: edge.relation, branch: "input" }));
  }
  for (const edge of attested) {
    extras.push(nodeFrom(edge.toId, { relation: edge.relation, branch: "input" }));
  }

  const originChildren = up.children.map((c) => ({ ...c, relation: c.relation ? `Origen · ${c.relation}` : "Origen" }));
  const destChildren = down.children.map((c) => ({ ...c, relation: c.relation ? `Destino · ${c.relation}` : "Destino" }));

  return {
    ...nodeFrom(id),
    children: [...originChildren, ...destChildren, ...extras],
  };
}

function destinationForInput(id: string): GraphNode {
  const usedBy = incoming(id, ["uses"]);
  const lotIds = [...new Set(usedBy.map((e) => e.fromId))];
  return {
    ...nodeFrom(id),
    children: lotIds.map((lotId) => {
      const dest = walk(lotId, "down", ["flow"], new Set(), 0);
      return { ...dest, relation: "Utilizado en" };
    }),
  };
}

export function buildExplorerView(id: string, mode: ExplorerMode): ExplorerViewModel | null {
  seed();
  const record = getIdentifier(id);
  if (!record) return null;
  const isInput = record.type === "clamshellBatch" || record.type === "inputLot" || (record.type === "supplier" && record.area.includes("insumo"));

  const originTree = walk(record.id, "up", ["flow", "supplied_by"], new Set(), 0);
  const destinationTree = isInput ? destinationForInput(record.id) : walk(record.id, "down", ["flow"], new Set(), 0);

  return {
    mode,
    record,
    originTree,
    destinationTree,
    relationTree: relationTree(record.id),
    inputs: inputGroups(record.id),
    quality: qualityGroups(record.id),
  };
}

export function inputImpact(batchId: string) {
  seed();
  const record = getIdentifier(batchId);
  if (!record) return null;
  const lotIds = [...new Set(incoming(record.id, ["uses"]).map((e) => e.fromId))];
  const lots = packingLots.filter((l) => lotIds.includes(l.id));
  const palletIds = [...new Set(lots.flatMap((l) => l.palletIds))];
  const containerIds = [...new Set(lots.map((l) => l.containerId))];
  const dests = destinations.filter((d) => lots.some((l) => l.id === d.packingLotId));
  const supermarketIds = [...new Set(dests.map((d) => d.supermarketId))];
  const importerIds = [...new Set(dests.map((d) => d.importerId))];
  return {
    batch: record,
    lots,
    palletIds,
    containerIds,
    supermarketIds,
    importerIds,
    dests,
  };
}

function collectIds(node: GraphNode, into: string[]) {
  into.push(node.id);
  for (const child of node.children) collectIds(child, into);
}

export function exampleIdentifiers(id: string): IdentifierRecord[] {
  const view = buildExplorerView(id, "relaciones");
  if (!view) return [];
  const ids: string[] = [];
  collectIds(view.originTree, ids);
  collectIds(view.destinationTree, ids);
  for (const group of view.inputs) {
    ids.push(group.batch.id);
    if (group.supplier) ids.push(group.supplier.id);
  }
  for (const group of view.quality) ids.push(group.node.id);

  const seen = new Set<string>();
  const items: IdentifierRecord[] = [];
  for (const itemId of ids) {
    const record = records.get(itemId);
    if (!record || seen.has(record.id)) continue;
    if (record.type === "box" && !record.id.startsWith("CAJAS-")) continue;
    if (record.type === "crate" && !record.id.startsWith("JABAS-")) continue;
    seen.add(record.id);
    items.push(record);
  }

  const order: EntityType[] = [
    "packingLot",
    "qrCode",
    "processingLot",
    "reception",
    "transport",
    "crate",
    "harvest",
    "harvestCrew",
    "plot",
    "nursery",
    "box",
    "pallet",
    "container",
    "booking",
    "qualityControl",
    "clamshellBatch",
    "inputLot",
  ];
  return items
    .sort((a, b) => (order.indexOf(a.type) === -1 ? 80 : order.indexOf(a.type)) - (order.indexOf(b.type) === -1 ? 80 : order.indexOf(b.type)))
    .slice(0, 14);
}

export function searchIdentifiers(q: string): IdentifierRecord[] {
  seed();
  const query = q.trim().toUpperCase();
  if (!query) return [];
  const rank: Partial<Record<EntityType, number>> = {
    packingLot: 0,
    qrCode: 1,
    clamshellBatch: 2,
    qualityControl: 3,
    harvest: 4,
    processingLot: 5,
    reception: 6,
    pallet: 7,
    container: 8,
    harvestCrew: 9,
    plot: 10,
    certification: 11,
    inputLot: 12,
    booking: 13,
  };
  return [...records.values()]
    .filter((r) => {
      const hit =
        r.id.toUpperCase().includes(query) ||
        r.label.toUpperCase().includes(query) ||
        r.aliases.some((a) => a.toUpperCase().includes(query));
      if (!hit) return false;
      if (r.type === "box" && !r.id.startsWith("CAJAS-") && r.id.toUpperCase() !== query) return false;
      if (r.type === "crate" && !r.id.startsWith("JABAS-") && r.id.toUpperCase() !== query) return false;
      return true;
    })
    .sort((a, b) => (rank[a.type] ?? 40) - (rank[b.type] ?? 40))
    .slice(0, 8);
}

export function identifierTypeLabel(type: EntityType): string {
  return entityTypeLabel(type);
}

export { records as identifierRecords };

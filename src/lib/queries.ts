import {
  bookings,
  boxes,
  certifications,
  claims,
  clamshellBatches,
  company,
  containers,
  crates,
  destinations,
  distributionCenters,
  distributors,
  documents,
  farms,
  harvestCrews,
  harvests,
  importers,
  inputLots,
  nurseries,
  packingLots,
  packagingMaterials,
  pallets,
  plots,
  processingLots,
  qrCodes,
  receptions,
  transports,
  products,
  qualityControls,
  recalls,
  supermarkets,
  suppliers,
} from "@/data";
import { ENTITY_ROUTES } from "@/lib/constants";
import { inputImpact } from "@/lib/graph";
import type {
  Box,
  Claim,
  ClamshellBatch,
  Container,
  Destination,
  Document,
  EntityType,
  PackingLot,
  Pallet,
  QualityControl,
  Recall,
  Supplier,
} from "@/types";

export function getCompany() {
  return company;
}

export function getProduct(id: string) {
  return products.find((p) => p.id === id);
}

export function getFarm(id: string) {
  return farms.find((f) => f.id === id);
}

export function getPlot(id: string) {
  const u = id.toUpperCase();
  return plots.find((p) => p.id === id || p.code.toUpperCase() === u || p.id.toUpperCase() === u);
}

export function getSupplier(id: string) {
  return suppliers.find((s) => s.id === id);
}

export function getHarvest(id: string) {
  return harvests.find((h) => h.id === id);
}

export function getProcessingLot(id: string) {
  return processingLots.find((p) => p.id === id);
}

export function getPackingLot(id: string): PackingLot | undefined {
  return packingLots.find((p) => p.id === id);
}

export function getClamshellBatch(id: string) {
  return clamshellBatches.find((c) => c.id === id);
}

export function getBox(id: string) {
  return boxes.find((b) => b.id === id);
}

export function getPallet(id: string) {
  return pallets.find((p) => p.id === id);
}

export function getContainer(id: string) {
  return containers.find((c) => c.id === id);
}

export function getBooking(id: string) {
  return bookings.find((b) => b.id === id);
}

export function getImporter(id: string) {
  return importers.find((i) => i.id === id);
}

export function getDistributor(id: string) {
  return distributors.find((d) => d.id === id);
}

export function getDistributionCenter(id: string) {
  return distributionCenters.find((d) => d.id === id);
}

export function getSupermarket(id: string) {
  return supermarkets.find((s) => s.id === id);
}

export function getQualityControl(id: string) {
  return qualityControls.find((q) => q.id === id);
}

export function getClaim(id: string) {
  return claims.find((c) => c.id === id);
}

export function getRecall(id: string) {
  return recalls.find((r) => r.id === id);
}

export function getDocument(id: string) {
  return documents.find((d) => d.id === id);
}

export function getCertification(id: string) {
  return certifications.find((c) => c.id === id);
}

export function getCrate(id: string) {
  return crates.find((c) => c.id === id);
}

export function lotsByStatus() {
  return packingLots;
}

export function getDestinationsForLot(lotId: string): Destination[] {
  return destinations.filter((d) => d.packingLotId === lotId);
}

export function getClaimsForLot(lotId: string): Claim[] {
  return claims.filter((c) => c.packingLotId === lotId);
}

export function getRecallsForLot(lotId: string): Recall[] {
  return recalls.filter((r) => r.packingLotId === lotId);
}

export function getQcForLot(lotId: string): QualityControl[] {
  return qualityControls.filter((q) => q.packingLotId === lotId);
}

export function getDocumentsForEntity(type: EntityType, id: string): Document[] {
  return documents.filter((d) => d.relatedEntityType === type && d.relatedEntityId === id);
}

export function getLotsBySupplier(supplierId: string): PackingLot[] {
  const supplier = getSupplier(supplierId);
  if (!supplier) return [];
  const fromField = packingLots.filter((l) => supplier.relatedLotIds.includes(l.id));
  if (fromField.length) return fromField;

  if (supplier.type === "agricola") {
    const farmIds = farms.filter((f) => f.supplierId === supplierId).map((f) => f.id);
    const harvestIds = harvests.filter((h) => farmIds.includes(h.farmId) || h.supplierId === supplierId).map((h) => h.id);
    return packingLots.filter((l) => l.harvestIds.some((id) => harvestIds.includes(id)));
  }
  if (supplier.type === "clamshells") {
    const batchIds = clamshellBatches.filter((b) => b.supplierId === supplierId).map((b) => b.id);
    return packingLots.filter((l) => batchIds.includes(l.clamshellBatchId));
  }
  if (supplier.type === "etiquetas") {
    return packingLots.filter((l) => {
      const batch = l.labelBatchId ? inputLots.find((i) => i.id === l.labelBatchId) : undefined;
      return batch?.supplierId === supplierId || supplier.relatedLotIds.includes(l.id);
    });
  }
  if (supplier.type === "cajas") {
    return packingLots.filter((l) => {
      const batch = l.cartonBatchId ? inputLots.find((i) => i.id === l.cartonBatchId) : undefined;
      return batch?.supplierId === supplierId || supplier.relatedLotIds.includes(l.id);
    });
  }
  return packingLots.filter((l) => supplier.relatedLotIds.includes(l.id));
}

export function getLotsByClamshellBatch(id: string): PackingLot[] {
  const batch = getClamshellBatch(id);
  if (batch?.relatedPackingLotIds.length) {
    return packingLots.filter((l) => batch.relatedPackingLotIds.includes(l.id));
  }
  return packingLots.filter((l) => l.clamshellBatchId === id);
}

export function entityHref(type: EntityType, id: string): string {
  const fn = ENTITY_ROUTES[type];
  return fn ? fn(id) : `/entidades/${type}/${id}`;
}

export interface SearchHit {
  type: EntityType;
  id: string;
  label: string;
  subtitle: string;
  packingLotId?: string;
}

export function searchEntities(q: string): SearchHit[] {
  const query = q.trim().toUpperCase();
  if (!query) return [];
  const hits: SearchHit[] = [];

  const push = (type: EntityType, id: string, label: string, subtitle: string, packingLotId?: string) => {
    if (id.toUpperCase().includes(query) || label.toUpperCase().includes(query)) {
      hits.push({ type, id, label, subtitle, packingLotId });
    }
  };

  for (const l of packingLots) push("packingLot", l.id, l.id, `Lote de empaque · ${l.variety}`, l.id);
  for (const h of harvests) push("harvest", h.id, h.id, `Cosecha · ${h.variety}`, packingLots.find((l) => l.harvestIds.includes(h.id))?.id);
  for (const c of harvestCrews) push("harvestCrew", c.id, c.id, c.name);
  for (const p of processingLots) push("processingLot", p.id, p.id, `Procesamiento · ${p.plant}`, packingLots.find((l) => l.processingLotId === p.id)?.id);
  for (const c of crates) {
    if (c.id.toUpperCase() === query || c.id.toUpperCase().includes(query)) {
      const lot = packingLots.find((l) => {
        const h = harvests.find((x) => x.id === c.harvestId);
        return h ? l.harvestIds.includes(h.id) : false;
      });
      hits.push({ type: "crate", id: c.id, label: c.id, subtitle: `Jaba · ${c.harvestId}`, packingLotId: lot?.id });
    }
  }
  for (const b of boxes) {
    if (b.id.toUpperCase() === query) {
      hits.push({ type: "box", id: b.id, label: b.id, subtitle: `Caja · ${b.packingLotId}`, packingLotId: b.packingLotId });
    }
  }
  for (const p of pallets) push("pallet", p.id, p.id, `Pallet · ${p.packingLotId}`, p.packingLotId);
  for (const c of containers) push("container", c.id, c.id, `Contenedor · ${c.country}`, c.packingLotIds[0]);
  for (const b of bookings) push("booking", b.id, b.id, `Booking · ${b.destination}`, packingLots.find((l) => l.bookingId === b.id)?.id);
  for (const cb of clamshellBatches) push("clamshellBatch", cb.id, cb.id, "Lote de clamshell", cb.relatedPackingLotIds[0]);
  for (const lot of inputLots) push("inputLot", lot.id, lot.id, lot.name, lot.relatedPackingLotIds[0]);
  for (const plot of plots) push("plot", plot.id, plot.code, `Parcela · ${plot.variety}`);
  for (const n of nurseries) push("nursery", n.id, n.id, n.name);
  for (const t of transports) push("transport", t.id, t.id, `${t.fromLabel} → ${t.toLabel}`);
  for (const r of receptions) push("reception", r.id, r.id, r.plant);
  for (const qr of qrCodes) push("qrCode", qr.id, qr.id, qr.packingLotId, qr.packingLotId);
  for (const f of farms) push("farm", f.id, f.name, f.code);
  for (const s of suppliers) push("supplier", s.id, s.name, s.code);
  for (const cl of claims) push("claim", cl.id, cl.id, cl.problem, cl.packingLotId);
  for (const r of recalls) push("recall", r.id, r.id, r.motive, r.packingLotId);
  for (const qc of qualityControls) push("qualityControl", qc.id, qc.id, qc.type, qc.packingLotId);
  for (const sm of supermarkets) {
    if (sm.name.toUpperCase().includes(query)) {
      hits.push({ type: "supermarket", id: sm.id, label: sm.name, subtitle: sm.country });
    }
  }

  const seen = new Set<string>();
  return hits.filter((h) => {
    const k = `${h.type}:${h.id}`;
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  }).slice(0, 25);
}

export function resolvePackingLotFromQuery(q: string): PackingLot | undefined {
  const hits = searchEntities(q);
  const exactLot = packingLots.find((l) => l.id.toUpperCase() === q.trim().toUpperCase());
  if (exactLot) return exactLot;
  const lotHit = hits.find((h) => h.type === "packingLot");
  if (lotHit) return getPackingLot(lotHit.id);
  return hits.find((h) => h.packingLotId)?.packingLotId
    ? getPackingLot(hits.find((h) => h.packingLotId)!.packingLotId!)
    : undefined;
}

export {
  buildForwardChainFromLot,
  buildForwardFromInput,
  buildReverseChain,
  buildTrace,
  packingLotsForEntity,
  relatedPackingLotId,
  resolveTraceSubject,
  buildTraceView,
} from "@/lib/trace";

export function relatedDestinationsSummary(lotId: string) {
  return getDestinationsForLot(lotId).map((d) => ({
    destination: d,
    supermarket: getSupermarket(d.supermarketId),
    importer: getImporter(d.importerId),
    cd: getDistributionCenter(d.distributionCenterId),
  }));
}

export function investigationForLot(lotId: string) {
  const lot = getPackingLot(lotId);
  if (!lot) return null;
  const harvest = getHarvest(lot.harvestIds[0] ?? "");
  const plot = harvest ? getPlot(harvest.plotId) : undefined;
  const farm = harvest ? getFarm(harvest.farmId) : undefined;
  const agricultural = farm ? getSupplier(farm.supplierId) : undefined;
  const processing = getProcessingLot(lot.processingLotId);
  const clamshell = getClamshellBatch(lot.clamshellBatchId);
  const clamshellSupplier = clamshell ? getSupplier(clamshell.supplierId) : undefined;
  const pallet = getPallet(lot.palletIds[0] ?? "");
  const container = getContainer(lot.containerId);
  const booking = getBooking(lot.bookingId);
  const dests = relatedDestinationsSummary(lotId);
  const relatedLots = clamshell ? getLotsByClamshellBatch(clamshell.id).filter((l) => l.id !== lot.id) : [];
  const impact = clamshell ? inputImpact(clamshell.id) : null;
  return {
    lot,
    agricultural,
    farm,
    plot,
    harvest,
    processing,
    clamshell,
    clamshellSupplier,
    pallet,
    container,
    booking,
    dests,
    relatedLots,
    impact,
  };
}

export function lotContext(lot: PackingLot) {
  const harvest = getHarvest(lot.harvestIds[0] ?? "");
  const plot = harvest ? getPlot(harvest.plotId) : undefined;
  const farm = harvest ? getFarm(harvest.farmId) : undefined;
  const processing = getProcessingLot(lot.processingLotId);
  const clamshell = getClamshellBatch(lot.clamshellBatchId);
  const clamshellSupplier = clamshell ? getSupplier(clamshell.supplierId) : undefined;
  const pallet = getPallet(lot.palletIds[0] ?? "");
  const container = getContainer(lot.containerId);
  const booking = getBooking(lot.bookingId);
  const importer = booking ? getImporter(booking.importerId) : undefined;
  const product = getProduct(lot.productId);
  const agricultural = farm ? getSupplier(farm.supplierId) : undefined;
  const material = clamshell ? packagingMaterials.find((m) => m.id === clamshell.materialId) : undefined;
  const labelLot = lot.labelBatchId ? inputLots.find((i) => i.id === lot.labelBatchId) : undefined;
  const cartonLot = lot.cartonBatchId ? inputLots.find((i) => i.id === lot.cartonBatchId) : undefined;
  const labelSupplier = labelLot ? getSupplier(labelLot.supplierId) : undefined;
  const cartonSupplier = cartonLot ? getSupplier(cartonLot.supplierId) : undefined;
  return {
    lot,
    harvest,
    plot,
    farm,
    processing,
    clamshell,
    clamshellSupplier,
    labelLot,
    labelSupplier,
    cartonLot,
    cartonSupplier,
    pallet,
    container,
    booking,
    importer,
    product,
    agricultural,
    material,
    harvests: lot.harvestIds.map((id) => getHarvest(id)).filter(Boolean),
    pallets: lot.palletIds.map((id) => getPallet(id)).filter(Boolean) as Pallet[],
    dests: relatedDestinationsSummary(lot.id),
    qcs: getQcForLot(lot.id),
    claims: getClaimsForLot(lot.id),
    docs: documents.filter((d) => d.relatedEntityId === lot.id || lot.qualityControlIds.includes(d.relatedEntityId)),
    relatedCrates: harvest ? crates.filter((c) => c.harvestId === harvest.id) : [],
  };
}

export function getEntityLabel(type: EntityType, id: string): string {
  switch (type) {
    case "farm":
      return getFarm(id)?.name ?? id;
    case "plot":
      return getPlot(id)?.code ?? id;
    case "supplier":
      return getSupplier(id)?.name ?? id;
    case "importer":
      return getImporter(id)?.name ?? id;
    case "supermarket":
      return getSupermarket(id)?.name ?? id;
    case "distributionCenter":
      return getDistributionCenter(id)?.code ?? id;
    default:
      return id;
  }
}

export type AnyEntity =
  | { kind: "packingLot"; data: PackingLot }
  | { kind: "pallet"; data: Pallet }
  | { kind: "container"; data: Container }
  | { kind: "box"; data: Box }
  | { kind: "supplier"; data: Supplier }
  | { kind: "claim"; data: Claim }
  | { kind: "qualityControl"; data: QualityControl }
  | { kind: "clamshellBatch"; data: ClamshellBatch }
  | { kind: "harvest"; data: ReturnType<typeof getHarvest> }
  | { kind: "farm"; data: ReturnType<typeof getFarm> }
  | { kind: "plot"; data: ReturnType<typeof getPlot> }
  | { kind: "processingLot"; data: ReturnType<typeof getProcessingLot> }
  | { kind: "booking"; data: ReturnType<typeof getBooking> }
  | { kind: "importer"; data: ReturnType<typeof getImporter> }
  | { kind: "distributionCenter"; data: ReturnType<typeof getDistributionCenter> }
  | { kind: "supermarket"; data: ReturnType<typeof getSupermarket> }
  | { kind: "crate"; data: ReturnType<typeof getCrate> }
  | { kind: "recall"; data: Recall };

export function loadEntity(type: string, id: string) {
  switch (type) {
    case "farm":
      return getFarm(id);
    case "plot":
      return getPlot(id);
    case "harvest":
      return getHarvest(id);
    case "harvestCrew":
      return harvestCrews.find((c) => c.id === id);
    case "crate":
      return getCrate(id);
    case "processingLot":
      return getProcessingLot(id);
    case "packingLot":
      return getPackingLot(id);
    case "clamshellBatch":
      return getClamshellBatch(id);
    case "inputLot":
      return inputLots.find((l) => l.id === id);
    case "nursery":
      return nurseries.find((n) => n.id === id);
    case "transport":
      return transports.find((t) => t.id === id);
    case "reception":
      return receptions.find((r) => r.id === id);
    case "qrCode":
      return qrCodes.find((q) => q.id === id);
    case "box":
      return getBox(id);
    case "pallet":
      return getPallet(id);
    case "container":
      return getContainer(id);
    case "booking":
      return getBooking(id);
    case "importer":
      return getImporter(id);
    case "distributionCenter":
      return getDistributionCenter(id);
    case "supermarket":
      return getSupermarket(id);
    case "supplier":
      return getSupplier(id);
    case "qualityControl":
      return getQualityControl(id);
    case "certification":
      return getCertification(id);
    default:
      return undefined;
  }
}

export {
  packingLots,
  suppliers,
  claims,
  recalls,
  destinations,
  qualityControls,
  certifications,
  documents,
  farms,
  plots,
  harvests,
  pallets,
  containers,
  bookings,
  clamshellBatches,
};

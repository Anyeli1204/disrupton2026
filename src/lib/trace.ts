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
  receptions,
  supermarkets,
  suppliers,
  transports,
} from "@/data";
import type {
  EntityType,
  InputLot,
  PackingLot,
  TraceInputGroup,
  TraceMode,
  TraceNode,
  TraceSubject,
  TraceViewModel,
} from "@/types";

function getFarm(id: string) {
  return farms.find((f) => f.id === id);
}
function getPlot(id: string) {
  return plots.find((p) => p.id === id);
}
function getSupplier(id: string) {
  return suppliers.find((s) => s.id === id);
}
function getHarvest(id: string) {
  return harvests.find((h) => h.id === id);
}
function getProcessingLot(id: string) {
  return processingLots.find((p) => p.id === id);
}
function getPackingLot(id: string) {
  return packingLots.find((p) => p.id === id);
}
function getClamshellBatch(id: string) {
  return clamshellBatches.find((c) => c.id === id);
}
function getInputLot(id: string) {
  return inputLots.find((l) => l.id === id);
}
function getBox(id: string) {
  return boxes.find((b) => b.id === id);
}
function getPallet(id: string) {
  return pallets.find((p) => p.id === id);
}
function getContainer(id: string) {
  return containers.find((c) => c.id === id);
}
function getBooking(id: string) {
  return bookings.find((b) => b.id === id);
}
function getCrate(id: string) {
  return crates.find((c) => c.id === id);
}
function getImporter(id: string) {
  return importers.find((i) => i.id === id);
}
function getDistributionCenter(id: string) {
  return distributionCenters.find((d) => d.id === id);
}
function getSupermarket(id: string) {
  return supermarkets.find((s) => s.id === id);
}

function n(
  type: EntityType,
  id: string,
  label: string,
  subtitle?: string,
  extra?: Partial<TraceNode>,
): TraceNode {
  return { type, id, label, subtitle, branch: "product", ...extra };
}

function inCodeRange(id: string, from: string, to: string): boolean {
  const num = (v: string) => Number(v.replace(/^[A-Z]+-?/i, ""));
  const nId = num(id);
  const nFrom = num(from);
  const nTo = num(to);
  if ([nId, nFrom, nTo].some((x) => Number.isNaN(x))) {
    return id.toUpperCase() === from.toUpperCase() || id.toUpperCase() === to.toUpperCase();
  }
  return nId >= nFrom && nId <= nTo;
}

export function packingLotsForEntity(type: EntityType, id: string): PackingLot[] {
  switch (type) {
    case "packingLot": {
      const lot = getPackingLot(id);
      return lot ? [lot] : [];
    }
    case "harvest":
      return packingLots.filter((l) => l.harvestIds.includes(id));
    case "plot": {
      const harvestIds = harvests.filter((h) => h.plotId === id).map((h) => h.id);
      return packingLots.filter((l) => l.harvestIds.some((h) => harvestIds.includes(h)));
    }
    case "farm": {
      const harvestIds = harvests.filter((h) => h.farmId === id).map((h) => h.id);
      return packingLots.filter((l) => l.harvestIds.some((h) => harvestIds.includes(h)));
    }
    case "crate": {
      const crate = getCrate(id);
      return crate ? packingLots.filter((l) => l.harvestIds.includes(crate.harvestId)) : [];
    }
    case "processingLot":
      return packingLots.filter((l) => l.processingLotId === id);
    case "reception": {
      const recp = receptions.find((r) => r.id === id);
      return recp ? packingLots.filter((l) => l.processingLotId === recp.processingLotId) : [];
    }
    case "transport": {
      const tr = transports.find((t) => t.id === id);
      return tr ? packingLots.filter((l) => l.harvestIds.includes(tr.harvestId)) : [];
    }
    case "harvestCrew": {
      const crew = harvestCrews.find((c) => c.id === id);
      return crew ? packingLots.filter((l) => l.harvestIds.some((hid) => harvests.find((h) => h.id === hid)?.crewId === crew.id)) : [];
    }
    case "qualityControl":
      return packingLots.filter((l) => l.qualityControlIds.includes(id));
    case "certification":
      return packingLots.filter((l) => {
        const harvest = harvests.find((h) => l.harvestIds.includes(h.id));
        return harvest?.farmId && certifications.find((c) => c.id === id && c.relatedEntityId === harvest.farmId);
      });
    case "nursery": {
      const plotIds = plots.filter((p) => p.nurseryId === id).map((p) => p.id);
      const harvestIds = harvests.filter((h) => plotIds.includes(h.plotId)).map((h) => h.id);
      return packingLots.filter((l) => l.harvestIds.some((hid) => harvestIds.includes(hid)));
    }
    case "qrCode": {
      const qr = qrCodes.find((q) => q.id === id);
      return qr ? packingLots.filter((l) => l.id === qr.packingLotId) : [];
    }
    case "clamshellBatch": {
      const batch = getClamshellBatch(id);
      if (batch?.relatedPackingLotIds.length) {
        return packingLots.filter((l) => batch.relatedPackingLotIds.includes(l.id));
      }
      return packingLots.filter((l) => l.clamshellBatchId === id);
    }
    case "inputLot": {
      const input = getInputLot(id);
      if (!input) return [];
      if (input.relatedPackingLotIds.length) {
        return packingLots.filter((l) => input.relatedPackingLotIds.includes(l.id));
      }
      return packingLots.filter((l) => l.labelBatchId === id || l.cartonBatchId === id);
    }
    case "box": {
      const box = getBox(id);
      if (box) {
        const lot = getPackingLot(box.packingLotId);
        return lot ? [lot] : [];
      }
      return packingLots.filter((l) => inCodeRange(id, l.boxFrom, l.boxTo));
    }
    case "pallet": {
      const pallet = getPallet(id);
      if (!pallet) return packingLots.filter((l) => l.palletIds.includes(id));
      const lot = getPackingLot(pallet.packingLotId);
      return lot ? [lot] : [];
    }
    case "container":
      return packingLots.filter((l) => l.containerId === id);
    case "booking":
      return packingLots.filter((l) => l.bookingId === id);
    case "supplier": {
      const supplier = getSupplier(id);
      if (!supplier) return [];
      if (supplier.type === "agricola") {
        const farmIds = farms.filter((f) => f.supplierId === id).map((f) => f.id);
        const harvestIds = harvests.filter((h) => farmIds.includes(h.farmId) || h.supplierId === id).map((h) => h.id);
        return packingLots.filter((l) => l.harvestIds.some((hid) => harvestIds.includes(hid)));
      }
      if (supplier.type === "clamshells") {
        const batchIds = clamshellBatches.filter((b) => b.supplierId === id).map((b) => b.id);
        return packingLots.filter((l) => batchIds.includes(l.clamshellBatchId));
      }
      if (supplier.type === "etiquetas") {
        return packingLots.filter((l) => {
          const batch = l.labelBatchId ? getInputLot(l.labelBatchId) : undefined;
          return batch?.supplierId === id || supplier.relatedLotIds.includes(l.id);
        });
      }
      if (supplier.type === "cajas") {
        return packingLots.filter((l) => {
          const batch = l.cartonBatchId ? getInputLot(l.cartonBatchId) : undefined;
          return batch?.supplierId === id || supplier.relatedLotIds.includes(l.id);
        });
      }
      return packingLots.filter((l) => supplier.relatedLotIds.includes(l.id));
    }
    case "importer": {
      const bookingIds = bookings.filter((b) => b.importerId === id).map((b) => b.id);
      return packingLots.filter((l) => bookingIds.includes(l.bookingId));
    }
    case "distributionCenter":
      return packingLots.filter((l) => destinations.some((d) => d.packingLotId === l.id && d.distributionCenterId === id));
    case "supermarket":
      return packingLots.filter((l) => destinations.some((d) => d.packingLotId === l.id && d.supermarketId === id));
    default:
      return [];
  }
}

function productLineage(lot: PackingLot): TraceNode[] {
  const harvest = getHarvest(lot.harvestIds[0] ?? "");
  const plot = harvest ? getPlot(harvest.plotId) : undefined;
  const farm = harvest ? getFarm(harvest.farmId) : undefined;
  const agricultural = farm ? getSupplier(farm.supplierId) : harvest ? getSupplier(harvest.supplierId) : undefined;
  const processing = getProcessingLot(lot.processingLotId);

  const chain: TraceNode[] = [
    n("packingLot", lot.id, lot.id, `Arándano fresco · ${lot.variety}`, { branch: "product" }),
  ];
  if (processing) {
    chain.push(n("processingLot", processing.id, processing.id, processing.plant, { relation: "Procesado a partir de" }));
  }
  if (harvest) {
    chain.push(
      n("crate", harvest.crateFrom, `Jabas ${harvest.crateFrom} a ${harvest.crateTo}`, `${harvest.crateCount} jabas`, {
        relation: "Recibido desde",
      }),
    );
    chain.push(n("harvest", harvest.id, harvest.id, harvest.date.value, { relation: "Corresponden a" }));
  }
  if (plot) {
    chain.push(n("plot", plot.id, `Parcela ${plot.code}`, plot.variety, { relation: "Cosechado en" }));
  }
  if (farm) {
    chain.push(n("farm", farm.id, farm.name, `${farm.region} · ${farm.district}`, { relation: "Pertenece a" }));
  }
  if (agricultural && agricultural.name !== farm?.name) {
    chain.push(
      n("supplier", agricultural.id, agricultural.name, agricultural.code, {
        relation: "Operado por",
      }),
    );
  }
  return chain;
}

function productForwardLineage(lot: PackingLot): TraceNode[] {
  const inverse = productLineage(lot).filter((node) => node.type !== "supplier");
  const forward = [...inverse].reverse();
  const relations: Partial<Record<EntityType, string>> = {
    plot: "Incluye",
    harvest: "Genera",
    crate: "Enviada en",
    processingLot: "Ingresa a",
    packingLot: "Da origen a",
  };
  return forward.map((node, i) =>
    i === 0 ? { ...node, relation: undefined } : { ...node, relation: relations[node.type] ?? "Continúa en" },
  );
}

function destinationLineage(lot: PackingLot): TraceNode[] {
  const pallet = getPallet(lot.palletIds[0] ?? "");
  const container = getContainer(lot.containerId);
  const booking = getBooking(lot.bookingId);
  const importer = booking ? getImporter(booking.importerId) : undefined;
  const dests = destinations.filter((d) => d.packingLotId === lot.id);
  const cd = dests[0] ? getDistributionCenter(dests[0].distributionCenterId) : undefined;
  const sms = dests.map((d) => getSupermarket(d.supermarketId)).filter((s): s is NonNullable<typeof s> => Boolean(s));

  const chain: TraceNode[] = [
    n("packingLot", lot.id, lot.id, `Arándano fresco · ${lot.variety}`, { branch: "destination" }),
    n("box", lot.boxFrom, `Cajas ${lot.boxFrom} a ${lot.boxTo}`, `${lot.boxCount} cajas de producto`, {
      relation: "Empacado en",
      branch: "destination",
    }),
  ];
  if (pallet) {
    chain.push(n("pallet", pallet.id, pallet.id, `${pallet.boxCount} cajas`, { relation: "Agrupado en", branch: "destination" }));
  }
  if (container) {
    chain.push(n("container", container.id, container.id, container.vessel, { relation: "Cargado en", branch: "destination" }));
  }
  if (booking) {
    chain.push(n("booking", booking.id, booking.id, booking.carrier, { relation: "Documentado en", branch: "destination" }));
  }
  if (importer) {
    chain.push(n("importer", importer.id, importer.name, importer.country, { relation: "Recibido por", branch: "destination" }));
  }
  if (cd) {
    chain.push(n("distributionCenter", cd.id, `${cd.code} · ${cd.name}`, cd.city, { relation: "Distribuido desde", branch: "destination" }));
  }
  if (sms.length) {
    chain.push(
      n("supermarket", sms[0].id, sms.length === 1 ? sms[0].name : "Supermercados", sms.map((s) => s.name).join(", "), {
        relation: "Exhibido en",
        branch: "destination",
      }),
    );
  }
  return chain;
}

function mergeDestinationLineage(lots: PackingLot[]): TraceNode[] {
  if (lots.length === 1) return destinationLineage(lots[0]);
  const palletIds = [...new Set(lots.flatMap((l) => l.palletIds))];
  const containerIds = [...new Set(lots.map((l) => l.containerId))];
  const bookingIds = [...new Set(lots.map((l) => l.bookingId))];
  const importerNames = [
    ...new Set(
      lots
        .map((l) => getBooking(l.bookingId))
        .map((b) => (b ? getImporter(b.importerId)?.name : undefined))
        .filter((x): x is string => Boolean(x)),
    ),
  ];
  const sms = [
    ...new Set(
      lots
        .flatMap((l) => destinations.filter((d) => d.packingLotId === l.id))
        .map((d) => getSupermarket(d.supermarketId)?.name)
        .filter((x): x is string => Boolean(x)),
    ),
  ];
  const first = lots[0];
  const booking = getBooking(first.bookingId);
  const importer = booking ? getImporter(booking.importerId) : undefined;
  const firstDest = destinations.find((d) => d.packingLotId === first.id);
  const cd = firstDest ? getDistributionCenter(firstDest.distributionCenterId) : undefined;

  return [
    n("packingLot", first.id, lots.length === 1 ? first.id : "Lotes de empaque", lots.slice(0, 8).map((l) => l.id).join(", "), {
      relation: "Utilizado en",
      branch: "destination",
    }),
    n("box", first.boxFrom, "Cajas de producto", lots.map((l) => `${l.boxFrom}–${l.boxTo}`).slice(0, 5).join(" · "), {
      relation: "Empacado en",
      branch: "destination",
    }),
    n("pallet", palletIds[0] ?? "", palletIds.length === 1 ? palletIds[0] : "Pallets", palletIds.join(", "), {
      relation: "Agrupado en",
      branch: "destination",
    }),
    n("container", containerIds[0] ?? "", containerIds.length === 1 ? containerIds[0] : "Contenedores", containerIds.join(", "), {
      relation: "Cargado en",
      branch: "destination",
    }),
    n("booking", bookingIds[0] ?? "", bookingIds.length === 1 ? bookingIds[0] : "Bookings", bookingIds.join(", "), {
      relation: "Documentado en",
      branch: "destination",
    }),
    n("importer", importer?.id ?? "", importerNames.length === 1 ? importerNames[0] : "Importadores", importerNames.join(", "), {
      relation: "Recibido por",
      branch: "destination",
    }),
    n("distributionCenter", cd?.id ?? "CD", cd ? `${cd.code} · ${cd.name}` : "Centros de distribución", cd?.city, {
      relation: "Distribuido desde",
      branch: "destination",
    }),
    n("supermarket", firstDest?.supermarketId ?? "SM", "Supermercados", sms.join(", "), {
      relation: "Exhibido en",
      branch: "destination",
    }),
  ];
}

function inputForwardChain(lots: PackingLot[]): TraceNode[] {
  const lotNodes = lots.map((lot, i) =>
    n("packingLot", lot.id, lot.id, `Arándano fresco · ${lot.variety}`, {
      relation: i === 0 ? "Utilizado en" : "También utilizado en",
      branch: "destination",
    }),
  );
  const dest = mergeDestinationLineage(lots).filter((node) => node.type !== "packingLot");
  return [...lotNodes, ...dest];
}

function inputsForLot(lot: PackingLot): TraceInputGroup[] {
  const groups: TraceInputGroup[] = [];
  const clamshell = getClamshellBatch(lot.clamshellBatchId);
  if (clamshell) {
    const supplier = getSupplier(clamshell.supplierId);
    groups.push({
      kind: "clamshell",
      title: "Clamshell",
      batch: n("clamshellBatch", clamshell.id, clamshell.id, `${clamshell.quantity.toLocaleString("es-PE")} unidades`, {
        relation: "Utiliza insumo",
        branch: "input",
      }),
      supplier: supplier
        ? n("supplier", supplier.id, supplier.name, supplier.code, { relation: "Suministrado por", branch: "input" })
        : undefined,
    });
  }
  const label = lot.labelBatchId ? getInputLot(lot.labelBatchId) : undefined;
  if (label) groups.push(inputGroup(label, "Etiqueta"));
  const carton = lot.cartonBatchId ? getInputLot(lot.cartonBatchId) : undefined;
  if (carton) groups.push(inputGroup(carton, "Caja"));
  return groups;
}

function inputGroup(lot: InputLot, title: string): TraceInputGroup {
  const supplier = getSupplier(lot.supplierId);
  return {
    kind: lot.kind,
    title,
    batch: n("inputLot", lot.id, lot.id, lot.name, { relation: "Utiliza insumo", branch: "input" }),
    supplier: supplier
      ? n("supplier", supplier.id, supplier.name, supplier.code, { relation: "Suministrado por", branch: "input" })
      : undefined,
  };
}

function sliceFromType(chain: TraceNode[], type: EntityType, id?: string): TraceNode[] {
  const index = chain.findIndex((node) => {
    if (node.type !== type) return false;
    if (!id) return true;
    if (type === "box" && inCodeRange(id, node.id, node.id)) return true;
    if (type === "crate") return true;
    return node.id === id || node.id.toUpperCase() === id.toUpperCase();
  });
  if (index < 0) return chain;
  return chain.slice(index).map((node, i) => (i === 0 ? { ...node, isOrigin: true, relation: undefined } : node));
}

function describeSubject(subject: TraceSubject): TraceNode {
  const { type, id } = subject;
  switch (type) {
    case "packingLot":
      return n(type, id, id, "Lote de empaque");
    case "harvest":
      return n(type, id, id, "Cosecha");
    case "plot":
      return n(type, id, `Parcela ${id}`, getPlot(id)?.variety);
    case "farm":
      return n(type, id, getFarm(id)?.name ?? id, getFarm(id) ? `${getFarm(id)!.region} · ${getFarm(id)!.district}` : "Fundo");
    case "crate":
      return n(type, id, id, "Jaba");
    case "processingLot":
      return n(type, id, id, "Procesamiento");
    case "clamshellBatch":
      return n(type, id, id, "Insumo · clamshell", { branch: "input" });
    case "inputLot": {
      const lot = getInputLot(id);
      return n(type, id, id, lot?.name ?? "Insumo", { branch: "input" });
    }
    case "box":
      return n(type, id, id, "Caja de producto");
    case "pallet":
      return n(type, id, id, "Pallet");
    case "container":
      return n(type, id, id, "Contenedor");
    case "booking":
      return n(type, id, id, "Booking");
    case "supplier":
      return n(type, id, getSupplier(id)?.name ?? id, getSupplier(id)?.code);
    case "importer":
      return n(type, id, getImporter(id)?.name ?? id, "Importador");
    case "distributionCenter": {
      const cd = getDistributionCenter(id);
      return n(type, id, cd ? `${cd.code} · ${cd.name}` : id, cd?.city);
    }
    case "supermarket":
      return n(type, id, getSupermarket(id)?.name ?? id, "Punto de venta");
    default:
      return n(type, id, id);
  }
}

function isInputSubject(subject: TraceSubject): boolean {
  if (subject.type === "clamshellBatch" || subject.type === "inputLot") return true;
  if (subject.type !== "supplier") return false;
  const supplier = getSupplier(subject.id);
  return Boolean(supplier && supplier.type !== "agricola");
}

function emptyView(subject: TraceSubject, mode: TraceMode): TraceViewModel {
  const origin = { ...describeSubject(subject), isOrigin: true };
  return {
    mode,
    layout: "simple",
    origin,
    productChain: [origin],
    inputs: [],
    destinationChain: [],
  };
}

export function resolveTraceSubject(q: string): TraceSubject | null {
  const raw = q.trim();
  if (!raw) return { type: "packingLot", id: "EMP-2026-0841", label: "EMP-2026-0841" };
  const u = raw.toUpperCase();

  const exact: Array<[EntityType, { id: string } | undefined]> = [
    ["packingLot", getPackingLot(u)],
    ["harvest", getHarvest(u)],
    ["harvestCrew", harvestCrews.find((c) => c.id.toUpperCase() === u)],
    ["processingLot", getProcessingLot(u)],
    ["reception", receptions.find((r) => r.id.toUpperCase() === u)],
    ["transport", transports.find((t) => t.id.toUpperCase() === u)],
    ["nursery", nurseries.find((n) => n.id.toUpperCase() === u)],
    ["qrCode", qrCodes.find((q) => q.id.toUpperCase() === u)],
    ["clamshellBatch", getClamshellBatch(u)],
    ["inputLot", getInputLot(u)],
    ["pallet", getPallet(u)],
    ["container", getContainer(u)],
    ["booking", getBooking(u)],
    ["plot", getPlot(u)],
    ["crate", getCrate(u) ?? crates.find((c) => c.id.toUpperCase() === u)],
    ["box", getBox(u) ?? boxes.find((b) => b.id.toUpperCase() === u)],
    ["farm", farms.find((f) => f.id.toUpperCase() === u || f.name.toUpperCase() === u || f.code.toUpperCase() === u)],
    ["supplier", getSupplier(u)],
  ];

  for (const [type, entity] of exact) {
    if (entity) {
      const subject = { type, id: entity.id, label: entity.id };
      return { ...subject, label: describeSubject(subject).label };
    }
  }

  const farmByName = farms.find((f) => f.name.toUpperCase().includes(u));
  if (farmByName) return { type: "farm", id: farmByName.id, label: farmByName.name };

  const supplierByName = suppliers.find(
    (s) => s.name.toUpperCase().includes(u) || s.code.toUpperCase() === u || s.id.toUpperCase() === u,
  );
  if (supplierByName) return { type: "supplier", id: supplierByName.id, label: supplierByName.name };

  const importer = importers.find((i) => i.id.toUpperCase() === u || i.name.toUpperCase().includes(u));
  if (importer) return { type: "importer", id: importer.id, label: importer.name };

  const sm = supermarkets.find((s) => s.id.toUpperCase() === u || s.name.toUpperCase().includes(u));
  if (sm) return { type: "supermarket", id: sm.id, label: sm.name };

  const cd = distributionCenters.find(
    (c) => c.id.toUpperCase() === u || c.code.toUpperCase() === u || c.name.toUpperCase().includes(u),
  );
  if (cd) return { type: "distributionCenter", id: cd.id, label: cd.code };

  const lotPartial = packingLots.find((l) => l.id.toUpperCase().includes(u));
  if (lotPartial) return { type: "packingLot", id: lotPartial.id, label: lotPartial.id };
  return null;
}

export function buildTraceView(subject: TraceSubject, mode: TraceMode): TraceViewModel {
  const origin = { ...describeSubject(subject), isOrigin: true };
  const lots = packingLotsForEntity(subject.type, subject.id);
  const primary = lots.find((l) => l.id === "EMP-2026-0841") ?? lots[0];

  if (isInputSubject(subject)) {
    if (mode === "inversa") {
      const supplierId =
        subject.type === "clamshellBatch"
          ? getClamshellBatch(subject.id)?.supplierId
          : subject.type === "inputLot"
            ? getInputLot(subject.id)?.supplierId
            : subject.id;
      const supplier = supplierId ? getSupplier(supplierId) : undefined;
      return {
        mode,
        layout: "input-inverse",
        origin,
        productChain: [
          origin,
          ...(supplier && supplier.id !== subject.id
            ? [n("supplier", supplier.id, supplier.name, supplier.code, { relation: "Suministrado por", branch: "input" })]
            : []),
        ],
        inputs: [],
        destinationChain: [],
      };
    }

    const dest = lots.length ? inputForwardChain(lots) : [];
    return {
      mode,
      layout: "input-forward",
      origin,
      productChain: [origin],
      inputs: [],
      destinationChain: dest,
    };
  }

  if (!primary) return emptyView(subject, mode);

  if (mode === "adelante") {
    if (["farm", "plot", "harvest", "crate", "processingLot", "supplier"].includes(subject.type)) {
      const forwardAgri = productForwardLineage(primary);
      const fromOrigin = sliceFromType(forwardAgri, subject.type === "supplier" ? "farm" : subject.type, subject.id);
      const dest = mergeDestinationLineage(lots.length > 1 ? lots : [primary]);
      return {
        mode,
        layout: "product-forward",
        origin,
        productChain: fromOrigin,
        inputs: [],
        destinationChain: dest.filter((node) => node.type !== "packingLot"),
      };
    }
    const dest = destinationLineage(primary);
    const start = dest.findIndex((node) => node.type === subject.type);
    return {
      mode,
      layout: "product-forward",
      origin,
      productChain: [origin],
      inputs: [],
      destinationChain: dest.slice(start >= 0 ? start + 1 : 1),
    };
  }

  const lineage = productLineage(primary);
  const dest = destinationLineage(primary);
  const destBack = [...dest].reverse();
  const inDestination = ["box", "pallet", "container", "booking", "importer", "distributionCenter", "supermarket"].includes(
    subject.type,
  );

  const showInputs = subject.type === "packingLot" || inDestination;

  if (inDestination) {
    const fromDest = sliceFromType(destBack, subject.type, subject.id);
    const afterLot = lineage.slice(1);
    return {
      mode,
      layout: "product-inverse",
      origin,
      productChain: [
        ...fromDest,
        ...afterLot,
      ],
      inputs: showInputs ? inputsForLot(primary) : [],
      destinationChain: [],
    };
  }

  return {
    mode,
    layout: "product-inverse",
    origin,
    productChain: sliceFromType(lineage, subject.type, subject.id),
    inputs: showInputs ? inputsForLot(primary) : [],
    destinationChain: [],
  };
}

export function buildTrace(subject: TraceSubject, mode: TraceMode): TraceNode[] {
  const view = buildTraceView(subject, mode);
  if (view.layout === "input-forward") return [view.origin, ...view.destinationChain];
  if (view.layout === "product-forward") return [...view.productChain, ...view.destinationChain.filter((n) => n.type !== "packingLot" || view.productChain[0]?.type !== "packingLot")];
  return view.productChain;
}

export function buildReverseChain(lot: PackingLot): TraceNode[] {
  return buildTrace({ type: "packingLot", id: lot.id, label: lot.id }, "inversa");
}

export function buildForwardChainFromLot(lot: PackingLot): TraceNode[] {
  return buildTrace({ type: "packingLot", id: lot.id, label: lot.id }, "adelante");
}

export function buildForwardFromInput(batchId: string): TraceNode[] {
  const batch = getClamshellBatch(batchId) ?? getInputLot(batchId);
  if (!batch) return [];
  const type = getClamshellBatch(batchId) ? "clamshellBatch" : "inputLot";
  return buildTrace({ type, id: batch.id, label: batch.id }, "adelante");
}

export function relatedPackingLotId(subject: TraceSubject): string | undefined {
  return packingLotsForEntity(subject.type, subject.id)[0]?.id;
}

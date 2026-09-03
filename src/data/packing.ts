import type {
  Box,
  ClamshellBatch,
  InputLot,
  LotStatus,
  PackagingMaterial,
  PackingLot,
} from "@/types";
import { sourced } from "./sources";

export const packagingMaterials: PackagingMaterial[] = [
  { id: "MAT-CL-125", name: "Clamshell PET 125 g", type: "clamshell", spec: "PET 125 g, tapa bisagra", supplierId: "PROV-EMP-004" },
  { id: "MAT-CL-125B", name: "Clamshell PET 125 g", type: "clamshell", spec: "PET 125 g, ventilado", supplierId: "PROV-EMP-005" },
  { id: "MAT-BOX-5", name: "Caja corrugada export", type: "caja", spec: "12 clamshells / caja", supplierId: "PROV-CAJ-001" },
  { id: "MAT-PAL-ISPM", name: "Pallet ISPM-15", type: "pallet", spec: "120 x 100 cm tratado", supplierId: "PROV-PAL-001" },
  { id: "MAT-LBL-GS1", name: "Etiqueta GS1 clamshell", type: "etiqueta", spec: "QR + lote de empaque", supplierId: "PROV-ETQ-001" },
];

export const inputLots: InputLot[] = [
  {
    id: "ETQ-2026-018",
    kind: "etiqueta",
    name: "Etiqueta GS1 clamshell",
    supplierId: "PROV-ETQ-001",
    materialId: "MAT-LBL-GS1",
    receivedAt: sourced("2026-07-12", "ERP Valle Azul", "Sistema Logístico ERP", "2026-07-12T10:15:00-05:00"),
    quantity: 40000,
    unit: "unidades",
    relatedPackingLotIds: ["EMP-2026-0841", "EMP-2026-0842", "EMP-2026-0847"],
    status: "aprobado",
  },
  {
    id: "CX-2026-051",
    kind: "caja",
    name: "Caja corrugada export",
    supplierId: "PROV-CAJ-001",
    materialId: "MAT-BOX-5",
    receivedAt: sourced("2026-07-15", "ERP Valle Azul", "Sistema Logístico ERP", "2026-07-15T09:40:00-05:00"),
    quantity: 12000,
    unit: "unidades",
    relatedPackingLotIds: ["EMP-2026-0841", "EMP-2026-0842", "EMP-2026-0843", "EMP-2026-0844"],
    status: "aprobado",
  },
];

export const clamshellBatches: ClamshellBatch[] = [
  {
    id: "CL-260815-02",
    supplierId: "PROV-EMP-004",
    materialId: "MAT-CL-125",
    receivedAt: sourced("2026-08-16", "ERP Valle Azul", "Sistema Logístico ERP", "2026-08-16T11:20:00-05:00"),
    quantity: 25000,
    relatedPackingLotIds: ["EMP-2026-0841", "EMP-2026-0842", "EMP-2026-0847"],
    status: "aprobado",
  },
  {
    id: "CL-260820-01",
    supplierId: "PROV-EMP-005",
    materialId: "MAT-CL-125B",
    receivedAt: sourced("2026-08-20", "ERP Valle Azul", "Sistema Logístico ERP", "2026-08-20T09:40:00-05:00"),
    quantity: 18000,
    relatedPackingLotIds: ["EMP-2026-0843", "EMP-2026-0845"],
    status: "aprobado",
  },
];

function boxIds(from: number, to: number): string[] {
  const ids: string[] = [];
  for (let n = from; n <= to; n++) ids.push(`C-${n}`);
  return ids;
}

function makeBoxes(packingLotId: string, palletId: string, from: number, to: number): Box[] {
  return boxIds(from, to).map((id) => ({
    id,
    packingLotId,
    palletId,
    clamshellCount: 12,
    weightKg: 1.5,
  }));
}

const extraStatuses: LotStatus[] = [
  "autorizado",
  "autorizado",
  "autorizado",
  "observado",
  "autorizado",
  "cerrado",
  "autorizado",
  "bloqueado",
];

function extraLots(): PackingLot[] {
  const lots: PackingLot[] = [];
  const templates: Array<Pick<PackingLot, "harvestIds" | "processingLotId" | "clamshellBatchId" | "containerId" | "bookingId" | "destinationCountry" | "variety" | "productId">> = [
    { harvestIds: ["COS-240718-04"], processingLotId: "PROC-0718-06", clamshellBatchId: "CL-260815-02", containerId: "MSKU1234567", bookingId: "BK-958204", destinationCountry: "Estados Unidos", variety: "Ventura", productId: "PROD-VENTURA" },
    { harvestIds: ["COS-240720-01"], processingLotId: "PROC-0720-02", clamshellBatchId: "CL-260820-01", containerId: "TCLU7654321", bookingId: "BK-958310", destinationCountry: "Países Bajos", variety: "Ventura", productId: "PROD-VENTURA" },
    { harvestIds: ["COS-240722-02"], processingLotId: "PROC-0722-01", clamshellBatchId: "CL-260820-01", containerId: "TCLU7654321", bookingId: "BK-958310", destinationCountry: "Países Bajos", variety: "Biloxi", productId: "PROD-BILOXI" },
  ];

  for (let i = 0; i < 43; i++) {
    const n = 846 + i;
    const t = templates[i % templates.length];
    const boxFrom = 5000 + i * 48;
    const boxTo = boxFrom + 47;
    const palletId = `PAL-${String(100 + i).padStart(3, "0")}`;
    const day = String(19 + (i % 8)).padStart(2, "0");
    lots.push({
      id: `EMP-2026-0${n}`,
      productId: t.productId,
      variety: t.variety,
      status: extraStatuses[i % extraStatuses.length],
      harvestIds: t.harvestIds,
      processingLotId: t.processingLotId,
      clamshellBatchId: t.clamshellBatchId,
      boxIds: boxIds(boxFrom, boxTo),
      boxFrom: `C-${boxFrom}`,
      boxTo: `C-${boxTo}`,
      boxCount: 48,
      palletIds: [palletId],
      containerId: t.containerId,
      bookingId: t.bookingId,
      destinationIds: [],
      qualityControlIds: [],
      claimIds: [],
      weightKg: sourced(72, "PackLine", "Sistema de empaque PackLine", `2026-07-${day}T22:10:00-05:00`),
      harvestDate: sourced(`2026-07-${day}`, "AgroSoft", "Sistema agrícola AgroSoft", `2026-07-${day}T16:42:00-05:00`),
      processingDate: sourced(`2026-07-${day}`, "PlantOS", "Sistema de planta PlantOS", `2026-07-${day}T21:05:00-05:00`),
      packingDate: sourced(`2026-07-${day}`, "PackLine", "Sistema de empaque PackLine", `2026-07-${day}T23:00:00-05:00`),
      packingLine: i % 2 === 0 ? "Línea A" : "Línea B",
      clamshellCount: 576,
      destinationCountry: t.destinationCountry,
      companyId: "COMP-001",
    });
  }
  return lots;
}

const detailedLots: PackingLot[] = [
  {
    id: "EMP-2026-0841",
    productId: "PROD-VENTURA",
    variety: "Ventura",
    status: "autorizado",
    harvestIds: ["COS-240718-03"],
    processingLotId: "PROC-0718-05",
    clamshellBatchId: "CL-260815-02",
    labelBatchId: "ETQ-2026-018",
    cartonBatchId: "CX-2026-051",
    boxIds: boxIds(4001, 4096),
    boxFrom: "C-4001",
    boxTo: "C-4096",
    boxCount: 96,
    palletIds: ["PAL-086"],
    containerId: "MSKU1234567",
    bookingId: "BK-958204",
    destinationIds: ["DEST-0841-FM", "DEST-0841-GM", "DEST-0841-FC"],
    qualityControlIds: ["QC-2026-481"],
    claimIds: ["INC-2026-014"],
    weightKg: sourced(144, "PackLine", "Sistema de empaque PackLine", "2026-07-18T23:40:00-05:00"),
    harvestDate: sourced("2026-07-18", "AgroSoft", "Sistema agrícola AgroSoft", "2026-07-18T16:42:00-05:00"),
    processingDate: sourced("2026-07-18", "PlantOS", "Sistema de planta PlantOS", "2026-07-18T21:05:00-05:00"),
    packingDate: sourced("2026-07-18", "PackLine", "Sistema de empaque PackLine", "2026-07-18T23:10:00-05:00"),
    packingLine: "Línea A — clamshell 125 g",
    clamshellCount: 1152,
    destinationCountry: "Estados Unidos",
    companyId: "COMP-001",
  },
  {
    id: "EMP-2026-0842",
    productId: "PROD-VENTURA",
    variety: "Ventura",
    status: "autorizado",
    harvestIds: ["COS-240718-04"],
    processingLotId: "PROC-0718-06",
    clamshellBatchId: "CL-260815-02",
    labelBatchId: "ETQ-2026-018",
    cartonBatchId: "CX-2026-051",
    boxIds: boxIds(4101, 4172),
    boxFrom: "C-4101",
    boxTo: "C-4172",
    boxCount: 72,
    palletIds: ["PAL-087"],
    containerId: "MSKU1234567",
    bookingId: "BK-958204",
    destinationIds: ["DEST-0842-WH"],
    qualityControlIds: ["QC-2026-482"],
    claimIds: [],
    weightKg: sourced(108, "PackLine", "Sistema de empaque PackLine", "2026-07-18T23:55:00-05:00"),
    harvestDate: sourced("2026-07-18", "AgroSoft", "Sistema agrícola AgroSoft", "2026-07-18T17:10:00-05:00"),
    processingDate: sourced("2026-07-18", "PlantOS", "Sistema de planta PlantOS", "2026-07-18T22:40:00-05:00"),
    packingDate: sourced("2026-07-18", "PackLine", "Sistema de empaque PackLine", "2026-07-18T23:50:00-05:00"),
    packingLine: "Línea A — clamshell 125 g",
    clamshellCount: 864,
    destinationCountry: "Estados Unidos",
    companyId: "COMP-001",
  },
  {
    id: "EMP-2026-0843",
    productId: "PROD-VENTURA",
    variety: "Ventura",
    status: "observado",
    harvestIds: ["COS-240720-01"],
    processingLotId: "PROC-0720-02",
    clamshellBatchId: "CL-260820-01",
    cartonBatchId: "CX-2026-051",
    boxIds: boxIds(4201, 4264),
    boxFrom: "C-4201",
    boxTo: "C-4264",
    boxCount: 64,
    palletIds: ["PAL-088", "PAL-089"],
    containerId: "TCLU7654321",
    bookingId: "BK-958310",
    destinationIds: ["DEST-0843-MP"],
    qualityControlIds: ["QC-2026-490"],
    claimIds: ["INC-2026-018"],
    weightKg: sourced(96, "PackLine", "Sistema de empaque PackLine", "2026-07-20T22:10:00-05:00"),
    harvestDate: sourced("2026-07-20", "AgroSoft", "Sistema agrícola AgroSoft", "2026-07-20T15:20:00-05:00"),
    processingDate: sourced("2026-07-20", "PlantOS", "Sistema de planta PlantOS", "2026-07-20T20:15:00-05:00"),
    packingDate: sourced("2026-07-20", "PackLine", "Sistema de empaque PackLine", "2026-07-20T22:00:00-05:00"),
    packingLine: "Línea B — clamshell 125 g",
    clamshellCount: 768,
    destinationCountry: "Países Bajos",
    companyId: "COMP-001",
  },
  {
    id: "EMP-2026-0844",
    productId: "PROD-VENTURA",
    variety: "Ventura",
    status: "autorizado",
    harvestIds: ["COS-240718-03", "COS-240718-04"],
    processingLotId: "PROC-0718-05",
    clamshellBatchId: "CL-260815-02",
    labelBatchId: "ETQ-2026-018",
    cartonBatchId: "CX-2026-051",
    boxIds: boxIds(4301, 4348),
    boxFrom: "C-4301",
    boxTo: "C-4348",
    boxCount: 48,
    palletIds: ["PAL-090"],
    containerId: "MSKU1234567",
    bookingId: "BK-958204",
    destinationIds: ["DEST-0844-FM"],
    qualityControlIds: ["QC-2026-483"],
    claimIds: [],
    weightKg: sourced(72, "PackLine", "Sistema de empaque PackLine", "2026-07-19T01:10:00-05:00"),
    harvestDate: sourced("2026-07-18", "AgroSoft", "Sistema agrícola AgroSoft", "2026-07-18T16:42:00-05:00"),
    processingDate: sourced("2026-07-18", "PlantOS", "Sistema de planta PlantOS", "2026-07-18T21:05:00-05:00"),
    packingDate: sourced("2026-07-19", "PackLine", "Sistema de empaque PackLine", "2026-07-19T01:00:00-05:00"),
    packingLine: "Línea A — clamshell 125 g",
    clamshellCount: 576,
    destinationCountry: "Estados Unidos",
    companyId: "COMP-001",
  },
  {
    id: "EMP-2026-0845",
    productId: "PROD-BILOXI",
    variety: "Biloxi",
    status: "cerrado",
    harvestIds: ["COS-240722-02"],
    processingLotId: "PROC-0722-01",
    clamshellBatchId: "CL-260820-01",
    boxIds: boxIds(4401, 4440),
    boxFrom: "C-4401",
    boxTo: "C-4440",
    boxCount: 40,
    palletIds: ["PAL-091"],
    containerId: "TCLU7654321",
    bookingId: "BK-958310",
    destinationIds: ["DEST-0845-MP"],
    qualityControlIds: ["QC-2026-501"],
    claimIds: ["INC-2026-020"],
    weightKg: sourced(60, "PackLine", "Sistema de empaque PackLine", "2026-07-22T21:40:00-05:00"),
    harvestDate: sourced("2026-07-22", "AgroSoft", "Sistema agrícola AgroSoft", "2026-07-22T16:05:00-05:00"),
    processingDate: sourced("2026-07-22", "PlantOS", "Sistema de planta PlantOS", "2026-07-22T19:50:00-05:00"),
    packingDate: sourced("2026-07-22", "PackLine", "Sistema de empaque PackLine", "2026-07-22T21:30:00-05:00"),
    packingLine: "Línea B — clamshell 125 g",
    clamshellCount: 480,
    destinationCountry: "Países Bajos",
    companyId: "COMP-001",
  },
];

export const packingLots: PackingLot[] = [...detailedLots, ...extraLots()].map((lot) =>
  lot.id === "EMP-2026-0847"
    ? {
        ...lot,
        clamshellBatchId: "CL-260815-02",
        labelBatchId: "ETQ-2026-018",
        cartonBatchId: "CX-2026-051",
        palletIds: ["PAL-093"],
        destinationIds: ["DEST-0847-MP", "DEST-0847-AK", "DEST-0847-SP"],
      }
    : lot,
);

export const boxes: Box[] = [
  ...makeBoxes("EMP-2026-0841", "PAL-086", 4001, 4096),
  ...makeBoxes("EMP-2026-0842", "PAL-087", 4101, 4172),
  ...makeBoxes("EMP-2026-0843", "PAL-088", 4201, 4232),
  ...makeBoxes("EMP-2026-0843", "PAL-089", 4233, 4264),
  ...makeBoxes("EMP-2026-0844", "PAL-090", 4301, 4348),
  ...makeBoxes("EMP-2026-0845", "PAL-091", 4401, 4440),
];

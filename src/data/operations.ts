import type { Nursery, QrCodeRecord, ReceptionLot, TransportMovement } from "@/types";
import { sourced } from "./sources";

export const nurseries: Nursery[] = [
  {
    id: "VIV-VENTURA-20",
    name: "Material vegetal Ventura",
    variety: "Ventura",
    sourceSystem: "AgroSoft",
    area: "Vivero Santa Rosa",
    receivedAt: sourced("2020-08-12", "AgroSoft", "Sistema agrícola AgroSoft", "2020-08-12T09:00:00-05:00"),
    status: "activo",
  },
  {
    id: "VIV-BILOXI-22",
    name: "Material vegetal Biloxi",
    variety: "Biloxi",
    sourceSystem: "AgroSoft",
    area: "Vivero Santa Rosa",
    receivedAt: sourced("2022-09-04", "AgroSoft", "Sistema agrícola AgroSoft", "2022-09-04T09:00:00-05:00"),
    status: "activo",
  },
];

export const transports: TransportMovement[] = [
  {
    id: "TRP-240718-02",
    harvestId: "COS-240718-03",
    fromLabel: "Fundo Santa Rosa",
    toLabel: "Planta Chao",
    crateFrom: "J-0181",
    crateTo: "J-0204",
    date: sourced("2026-07-18", "AgroSoft", "Sistema agrícola AgroSoft", "2026-07-18T17:55:00-05:00"),
    receptionId: "REC-240718-01",
    status: "entregado",
  },
  {
    id: "TRP-240718-03",
    harvestId: "COS-240718-04",
    fromLabel: "Fundo Santa Rosa",
    toLabel: "Planta Chao",
    crateFrom: "J-0205",
    crateTo: "J-0228",
    date: sourced("2026-07-18", "AgroSoft", "Sistema agrícola AgroSoft", "2026-07-18T18:20:00-05:00"),
    receptionId: "REC-240718-02",
    status: "entregado",
  },
];

export const receptions: ReceptionLot[] = [
  {
    id: "REC-240718-01",
    plant: "Planta Chao",
    harvestId: "COS-240718-03",
    transportId: "TRP-240718-02",
    processingLotId: "PROC-0718-05",
    date: sourced("2026-07-18", "PlantOS", "Sistema de planta PlantOS", "2026-07-18T18:40:00-05:00"),
    kgReceived: 1488,
    status: "conforme",
  },
  {
    id: "REC-240718-02",
    plant: "Planta Chao",
    harvestId: "COS-240718-04",
    transportId: "TRP-240718-03",
    processingLotId: "PROC-0718-06",
    date: sourced("2026-07-18", "PlantOS", "Sistema de planta PlantOS", "2026-07-18T19:05:00-05:00"),
    kgReceived: 1510,
    status: "conforme",
  },
];

export const qrCodes: QrCodeRecord[] = [
  {
    id: "QR-0841",
    packingLotId: "EMP-2026-0841",
    printedAt: sourced("2026-07-18", "PackLine", "Sistema de empaque PackLine", "2026-07-18T23:12:00-05:00"),
    status: "impreso",
  },
  {
    id: "QR-0842",
    packingLotId: "EMP-2026-0842",
    printedAt: sourced("2026-07-18", "PackLine", "Sistema de empaque PackLine", "2026-07-18T23:52:00-05:00"),
    status: "impreso",
  },
];

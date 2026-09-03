import type { Harvest, HarvestCrew, Crate } from "@/types";
import { sourced } from "./sources";

export const harvestCrews: HarvestCrew[] = [
  {
    id: "CUA-FSR-014-AM",
    farmId: "FARM-001",
    plotId: "P-014",
    name: "Cuadrilla Santa Rosa 014 — mañana",
    supervisor: "Carlos Mendoza",
    shift: "Mañana",
    workerCount: 18,
    date: "2026-07-18",
  },
  {
    id: "CUA-FSR-015-PM",
    farmId: "FARM-001",
    plotId: "P-015",
    name: "Cuadrilla Santa Rosa 015 — tarde",
    supervisor: "Carlos Mendoza",
    shift: "Tarde",
    workerCount: 16,
    date: "2026-07-18",
  },
  {
    id: "CUA-FEM-021-AM",
    farmId: "FARM-002",
    plotId: "P-021",
    name: "Cuadrilla El Mirador 021 — mañana",
    supervisor: "Elena Vargas",
    shift: "Mañana",
    workerCount: 14,
    date: "2026-07-20",
  },
  {
    id: "CUA-FEM-022-AM",
    farmId: "FARM-002",
    plotId: "P-022",
    name: "Cuadrilla El Mirador 022 — mañana",
    supervisor: "Jorge Salazar",
    shift: "Mañana",
    workerCount: 12,
    date: "2026-07-22",
  },
];

export const harvests: Harvest[] = [
  {
    id: "COS-240718-03",
    plotId: "P-014",
    farmId: "FARM-001",
    supplierId: "PROV-AGR-001",
    date: sourced("2026-07-18", "AgroSoft", "Sistema agrícola AgroSoft", "2026-07-18T16:42:00-05:00"),
    supervisor: "Carlos Mendoza",
    crateFrom: "J-0181",
    crateTo: "J-0204",
    crateCount: 24,
    kgHarvested: 1488,
    variety: "Ventura",
    shift: "Mañana",
    crewId: "CUA-FSR-014-AM",
  },
  {
    id: "COS-240718-04",
    plotId: "P-015",
    farmId: "FARM-001",
    supplierId: "PROV-AGR-001",
    date: sourced("2026-07-18", "AgroSoft", "Sistema agrícola AgroSoft", "2026-07-18T17:10:00-05:00"),
    supervisor: "Carlos Mendoza",
    crateFrom: "J-0205",
    crateTo: "J-0228",
    crateCount: 24,
    kgHarvested: 1510,
    variety: "Ventura",
    shift: "Tarde",
    crewId: "CUA-FSR-015-PM",
  },
  {
    id: "COS-240720-01",
    plotId: "P-021",
    farmId: "FARM-002",
    supplierId: "PROV-AGR-002",
    date: sourced("2026-07-20", "AgroSoft", "Sistema agrícola AgroSoft", "2026-07-20T15:20:00-05:00"),
    supervisor: "Elena Vargas",
    crateFrom: "J-0301",
    crateTo: "J-0320",
    crateCount: 20,
    kgHarvested: 1210,
    variety: "Ventura",
    shift: "Mañana",
    crewId: "CUA-FEM-021-AM",
  },
  {
    id: "COS-240722-02",
    plotId: "P-022",
    farmId: "FARM-002",
    supplierId: "PROV-AGR-003",
    date: sourced("2026-07-22", "AgroSoft", "Sistema agrícola AgroSoft", "2026-07-22T16:05:00-05:00"),
    supervisor: "Jorge Salazar",
    crateFrom: "J-0401",
    crateTo: "J-0418",
    crateCount: 18,
    kgHarvested: 980,
    variety: "Biloxi",
    shift: "Mañana",
    crewId: "CUA-FEM-022-AM",
  },
];

function crateRange(from: number, to: number, harvestId: string, weightKg: number): Crate[] {
  const list: Crate[] = [];
  for (let n = from; n <= to; n++) {
    list.push({
      id: `J-${String(n).padStart(4, "0")}`,
      harvestId,
      weightKg,
      receivedAt: "2026-07-18T18:30:00-05:00",
    });
  }
  return list;
}

export const crates: Crate[] = [
  ...crateRange(181, 204, "COS-240718-03", 62),
  ...crateRange(205, 228, "COS-240718-04", 63),
  ...crateRange(301, 320, "COS-240720-01", 60.5),
  ...crateRange(401, 418, "COS-240722-02", 54.4),
];

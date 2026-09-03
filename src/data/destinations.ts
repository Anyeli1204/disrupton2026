import type { Destination, DistributionCenter, Distributor, Importer, Supermarket } from "@/types";

export const importers: Importer[] = [
  { id: "IMP-001", name: "Fresh Imports LLC", country: "Estados Unidos", code: "IMP-009", contact: "Daniel Brooks" },
  { id: "IMP-002", name: "EuroBerry GmbH", country: "Países Bajos", code: "IMP-NL-002", contact: "Ingrid Bakker" },
];

export const distributors: Distributor[] = [
  { id: "DIST-001", name: "Fresh Imports Distribution", country: "Estados Unidos", importerId: "IMP-001" },
  { id: "DIST-002", name: "EuroBerry Distribution", country: "Países Bajos", importerId: "IMP-002" },
];

export const distributionCenters: DistributionCenter[] = [
  { id: "CD-01", code: "CD-01", name: "CD Philadelphia", city: "Philadelphia", country: "Estados Unidos", importerId: "IMP-001" },
  { id: "CD-02", code: "CD-02", name: "CD Miami", city: "Miami", country: "Estados Unidos", importerId: "IMP-001" },
  { id: "CD-03", code: "CD-03", name: "CD Rotterdam", city: "Rotterdam", country: "Países Bajos", importerId: "IMP-002" },
];

export const supermarkets: Supermarket[] = [
  { id: "SM-FM", name: "Fresh Market", country: "Estados Unidos", city: "Philadelphia", chain: "Fresh Market" },
  { id: "SM-GM", name: "Green Market", country: "Estados Unidos", city: "Philadelphia", chain: "Green Market" },
  { id: "SM-FC", name: "Food Center", country: "Estados Unidos", city: "Camden", chain: "Food Center" },
  { id: "SM-WH", name: "Whole Harvest", country: "Estados Unidos", city: "Miami", chain: "Whole Harvest" },
  { id: "SM-MP", name: "Market Plaza", country: "Países Bajos", city: "Rotterdam", chain: "Market Plaza" },
  { id: "SM-AK", name: "Ahold Kern", country: "Países Bajos", city: "Amsterdam", chain: "Ahold Kern" },
  { id: "SM-SP", name: "Spar Plus", country: "Países Bajos", city: "Utrecht", chain: "Spar Plus" },
];

export const destinations: Destination[] = [
  { id: "DEST-0841-FM", packingLotId: "EMP-2026-0841", importerId: "IMP-001", distributorId: "DIST-001", distributionCenterId: "CD-01", supermarketId: "SM-FM", country: "Estados Unidos", boxCount: 40, boxFrom: "C-4001", boxTo: "C-4040", status: "en_tienda" },
  { id: "DEST-0841-GM", packingLotId: "EMP-2026-0841", importerId: "IMP-001", distributorId: "DIST-001", distributionCenterId: "CD-01", supermarketId: "SM-GM", country: "Estados Unidos", boxCount: 35, boxFrom: "C-4041", boxTo: "C-4075", status: "en_tienda" },
  { id: "DEST-0841-FC", packingLotId: "EMP-2026-0841", importerId: "IMP-001", distributorId: "DIST-001", distributionCenterId: "CD-01", supermarketId: "SM-FC", country: "Estados Unidos", boxCount: 21, boxFrom: "C-4076", boxTo: "C-4096", status: "en_tienda" },
  { id: "DEST-0842-WH", packingLotId: "EMP-2026-0842", importerId: "IMP-001", distributorId: "DIST-001", distributionCenterId: "CD-02", supermarketId: "SM-WH", country: "Estados Unidos", boxCount: 72, boxFrom: "C-4101", boxTo: "C-4172", status: "en_tienda" },
  { id: "DEST-0843-MP", packingLotId: "EMP-2026-0843", importerId: "IMP-002", distributorId: "DIST-002", distributionCenterId: "CD-03", supermarketId: "SM-MP", country: "Países Bajos", boxCount: 64, boxFrom: "C-4201", boxTo: "C-4264", status: "en_cd" },
  { id: "DEST-0844-FM", packingLotId: "EMP-2026-0844", importerId: "IMP-001", distributorId: "DIST-001", distributionCenterId: "CD-01", supermarketId: "SM-FM", country: "Estados Unidos", boxCount: 48, boxFrom: "C-4301", boxTo: "C-4348", status: "en_tienda" },
  { id: "DEST-0845-MP", packingLotId: "EMP-2026-0845", importerId: "IMP-002", distributorId: "DIST-002", distributionCenterId: "CD-03", supermarketId: "SM-MP", country: "Países Bajos", boxCount: 40, boxFrom: "C-4401", boxTo: "C-4440", status: "vendido" },
  { id: "DEST-0847-MP", packingLotId: "EMP-2026-0847", importerId: "IMP-002", distributorId: "DIST-002", distributionCenterId: "CD-03", supermarketId: "SM-MP", country: "Países Bajos", boxCount: 24, boxFrom: "C-5048", boxTo: "C-5071", status: "en_cd" },
  { id: "DEST-0847-AK", packingLotId: "EMP-2026-0847", importerId: "IMP-002", distributorId: "DIST-002", distributionCenterId: "CD-03", supermarketId: "SM-AK", country: "Países Bajos", boxCount: 16, boxFrom: "C-5072", boxTo: "C-5087", status: "en_cd" },
  { id: "DEST-0847-SP", packingLotId: "EMP-2026-0847", importerId: "IMP-002", distributorId: "DIST-002", distributionCenterId: "CD-03", supermarketId: "SM-SP", country: "Países Bajos", boxCount: 8, boxFrom: "C-5088", boxTo: "C-5095", status: "en_transito" },
];

import type { Farm, Plot } from "@/types";

export const farms: Farm[] = [
  {
    id: "FARM-001",
    name: "Fundo Santa Rosa",
    code: "FSR-01",
    supplierId: "PROV-AGR-001",
    region: "La Libertad",
    district: "Virú",
    hectares: 86,
    plotIds: ["P-011", "P-012", "P-013", "P-014", "P-015", "P-016"],
    certificationIds: ["CERT-GGAP-001"],
    status: "aprobado",
  },
  {
    id: "FARM-002",
    name: "Fundo El Mirador",
    code: "FEM-02",
    supplierId: "PROV-AGR-002",
    region: "La Libertad",
    district: "Chao",
    hectares: 54,
    plotIds: ["P-021", "P-022"],
    certificationIds: ["CERT-GGAP-002"],
    status: "aprobado",
  },
];

export const plots: Plot[] = [
  { id: "P-011", code: "P-011", farmId: "FARM-001", hectares: 12.4, variety: "Ventura", plantingYear: 2021, supervisor: "Luis Paredes", nurseryId: "VIV-VENTURA-20" },
  { id: "P-012", code: "P-012", farmId: "FARM-001", hectares: 14.1, variety: "Ventura", plantingYear: 2021, supervisor: "Luis Paredes", nurseryId: "VIV-VENTURA-20" },
  { id: "P-013", code: "P-013", farmId: "FARM-001", hectares: 11.8, variety: "Biloxi", plantingYear: 2022, supervisor: "Rosa Quispe", nurseryId: "VIV-BILOXI-22" },
  { id: "P-014", code: "PAR-P014", farmId: "FARM-001", hectares: 15.6, variety: "Ventura", plantingYear: 2020, supervisor: "Carlos Mendoza", nurseryId: "VIV-VENTURA-20" },
  { id: "P-015", code: "P-015", farmId: "FARM-001", hectares: 16.2, variety: "Ventura", plantingYear: 2020, supervisor: "Carlos Mendoza", nurseryId: "VIV-VENTURA-20" },
  { id: "P-016", code: "P-016", farmId: "FARM-001", hectares: 15.9, variety: "Biloxi", plantingYear: 2023, supervisor: "Rosa Quispe", nurseryId: "VIV-BILOXI-22" },
  { id: "P-021", code: "P-021", farmId: "FARM-002", hectares: 28.0, variety: "Ventura", plantingYear: 2021, supervisor: "Elena Vargas", nurseryId: "VIV-VENTURA-20" },
  { id: "P-022", code: "P-022", farmId: "FARM-002", hectares: 26.0, variety: "Biloxi", plantingYear: 2022, supervisor: "Elena Vargas", nurseryId: "VIV-BILOXI-22" },
];

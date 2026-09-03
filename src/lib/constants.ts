import type {
  ClaimStatus,
  ClaimType,
  DocumentCategory,
  EntityType,
  LotStatus,
  RecallStatus,
  SupplierType,
} from "@/types";

export const LOT_STATUS_LABEL: Record<LotStatus, string> = {
  autorizado: "Autorizado",
  observado: "Observado",
  bloqueado: "Bloqueado",
  inmovilizado: "Inmovilizado",
  sujeto_a_retiro: "Sujeto a retiro",
  retirado: "Retirado",
  cerrado: "Cerrado",
};

export const LOT_STATUS_TONE: Record<LotStatus, "green" | "amber" | "red" | "gray"> = {
  autorizado: "green",
  observado: "amber",
  bloqueado: "red",
  inmovilizado: "red",
  sujeto_a_retiro: "red",
  retirado: "red",
  cerrado: "gray",
};

export const SUPPLIER_TYPE_LABEL: Record<SupplierType, string> = {
  agricola: "Agrícola",
  clamshells: "Clamshells",
  etiquetas: "Etiquetas",
  cajas: "Cajas",
  pallets: "Pallets",
  logistica: "Logística",
  otros: "Otros insumos",
};

export const CLAIM_TYPE_LABEL: Record<ClaimType, string> = {
  calidad: "Calidad",
  empaque: "Empaque",
  temperatura: "Temperatura",
  producto: "Producto",
  documentacion: "Documentación",
  otro: "Otro",
};

export const CLAIM_STATUS_LABEL: Record<ClaimStatus, string> = {
  nuevo: "Nuevo",
  en_investigacion: "En investigación",
  esperando_informacion: "Esperando información",
  resuelto: "Resuelto",
  cerrado: "Cerrado",
};

export const RECALL_STATUS_LABEL: Record<RecallStatus, string> = {
  borrador: "Borrador",
  iniciado: "Iniciado",
  en_proceso: "En proceso",
  parcialmente_recuperado: "Parcialmente recuperado",
  finalizado: "Finalizado",
  cerrado: "Cerrado",
};

export const DOCUMENT_CATEGORY_LABEL: Record<DocumentCategory, string> = {
  certificaciones: "Certificaciones",
  calidad: "Calidad",
  proveedores: "Proveedores",
  exportacion: "Exportación",
  logistica: "Logística",
  reclamos: "Reclamos",
  auditorias: "Auditorías",
};

export const NAV_ITEMS: { href: string; label: string; icon: string }[] = [
  { href: "/", label: "Dashboard", icon: "LayoutDashboard" },
  { href: "/trazabilidad", label: "Explorador", icon: "GitBranch" },
  { href: "/lotes", label: "Lotes", icon: "Package" },
  { href: "/proveedores", label: "Proveedores e insumos", icon: "Truck" },
  { href: "/calidad", label: "Calidad y certificaciones", icon: "ShieldCheck" },
  { href: "/reclamos", label: "Reclamos e incidencias", icon: "AlertTriangle" },
  { href: "/destinos", label: "Destinos", icon: "MapPin" },
  { href: "/retiros", label: "Retiros", icon: "Undo2" },
  { href: "/auditorias", label: "Auditorías", icon: "ClipboardList" },
  { href: "/documentos", label: "Documentos", icon: "FolderOpen" },
];

export const ENTITY_ROUTES: Partial<Record<EntityType, (id: string) => string>> = {
  packingLot: (id) => `/lotes/${id}`,
  supplier: (id) => `/proveedores/${id}`,
  claim: (id) => `/reclamos/${id}`,
  incident: (id) => `/reclamos/${id}`,
  recall: (id) => `/retiros/${id}`,
  qualityControl: (id) => `/calidad/${id}`,
  destination: (id) => `/destinos/${id}`,
  farm: (id) => `/entidades/farm/${id}`,
  plot: (id) => `/entidades/plot/${id}`,
  harvest: (id) => `/entidades/harvest/${id}`,
  harvestCrew: (id) => `/entidades/harvestCrew/${id}`,
  crate: (id) => `/entidades/crate/${id}`,
  nursery: (id) => `/entidades/nursery/${id}`,
  transport: (id) => `/entidades/transport/${id}`,
  reception: (id) => `/entidades/reception/${id}`,
  qrCode: (id) => `/entidades/qrCode/${id}`,
  processingLot: (id) => `/entidades/processingLot/${id}`,
  clamshellBatch: (id) => `/entidades/clamshellBatch/${id}`,
  inputLot: (id) => `/entidades/inputLot/${id}`,
  box: (id) => `/entidades/box/${id}`,
  pallet: (id) => `/entidades/pallet/${id}`,
  container: (id) => `/entidades/container/${id}`,
  booking: (id) => `/entidades/booking/${id}`,
  importer: (id) => `/entidades/importer/${id}`,
  distributionCenter: (id) => `/entidades/distributionCenter/${id}`,
  supermarket: (id) => `/entidades/supermarket/${id}`,
  document: (id) => `/documentos?id=${id}`,
  certification: (id) => `/calidad?cert=${id}`,
};

export const MAIN_LOT_ID = "EMP-2026-0841";
export const MAIN_CLAIM_ID = "INC-2026-014";
export const MAIN_RECALL_ID = "RET-2026-003";

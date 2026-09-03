import type { Company, Product, DashboardKpis, ActivityItem, AlertItem, NotificationItem } from "@/types";
export { lotStatusSummary } from "./kpis";

export const company: Company = {
  id: "COMP-001",
  name: "Agroexportadora Valle Azul S.A.C.",
  tradeName: "Valle Azul",
  ruc: "20601234567",
  campaign: "2026–2027",
  plant: "Planta Chao",
  country: "Perú",
  user: {
    name: "María Delgado",
    role: "Jefa de Trazabilidad",
    initials: "MD",
  },
};

export const products: Product[] = [
  { id: "PROD-VENTURA", name: "Arándano fresco", variety: "Ventura", category: "Berries", caliber: "Jumbo" },
  { id: "PROD-BILOXI", name: "Arándano fresco", variety: "Biloxi", category: "Berries", caliber: "Large" },
];

export const dashboardKpis: DashboardKpis = {
  activeLots: 48,
  observedLots: 3,
  openClaims: 5,
  criticalIncidents: 1,
  activeRecalls: 1,
  activeSuppliers: 17,
};

export const recentActivity: ActivityItem[] = [
  { id: "act-1", at: "2026-08-22T09:14:00-05:00", text: "Nuevo reclamo recibido de Fresh Market", href: "/reclamos/INC-2026-014" },
  { id: "act-2", at: "2026-08-22T08:40:00-05:00", text: "Lote EMP-2026-0841 marcado como observado", href: "/lotes/EMP-2026-0841" },
  { id: "act-3", at: "2026-08-21T16:05:00-05:00", text: "Control de calidad aprobado", href: "/calidad/QC-2026-481" },
  { id: "act-4", at: "2026-07-21T09:15:00-05:00", text: "Contenedor MSKU1234567 despachado", href: "/entidades/container/MSKU1234567" },
  { id: "act-5", at: "2026-08-16T11:20:00-05:00", text: "Proveedor Envases Andinos actualizado", href: "/proveedores/PROV-EMP-004" },
];

export const alerts: AlertItem[] = [
  { id: "al-1", level: "alta", text: "Reclamo asociado al lote EMP-2026-0841", href: "/reclamos/INC-2026-014" },
  { id: "al-2", level: "media", text: "Certificación próxima a vencer", href: "/calidad?cert=CERT-SMETA-001" },
  { id: "al-3", level: "baja", text: "Información logística actualizada", href: "/entidades/container/MSKU1234567" },
];

export const notifications: NotificationItem[] = [
  { id: "n-1", text: "Fresh Market reportó pérdida de firmeza en 24 cajas", at: "2026-08-22T09:14:00-05:00", read: false, href: "/reclamos/INC-2026-014" },
  { id: "n-2", text: "Retiro RET-2026-003: 18 de 24 cajas localizadas", at: "2026-08-22T11:00:00-05:00", read: false, href: "/retiros/RET-2026-003" },
  { id: "n-3", text: "SMETA de Planta Chao vence el 30/09/2026", at: "2026-08-20T08:00:00-05:00", read: true, href: "/calidad" },
];


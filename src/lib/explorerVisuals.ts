import type { EntityType } from "@/types";
import {
  Award,
  BadgeCheck,
  Box,
  Building2,
  Container,
  Factory,
  Layers,
  Leaf,
  MapPin,
  Package,
  PackageOpen,
  QrCode,
  Ship,
  Sprout,
  StickyNote,
  Store,
  Trees,
  Truck,
  Users,
  Warehouse,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export const EXPLORER_PHOTOS = {
  blueberries: "/images/hero-blueberries.jpg",
  packing: "/images/stage-packing.jpg",
  processing: "/images/stage-processing.jpg",
  reception: "/images/stage-reception.jpg",
  transport: "/images/stage-transport.jpg",
  crates: "/images/stage-crates.jpg",
  harvest: "/images/stage-harvest.jpg",
  plot: "/images/stage-plot.jpg",
  nursery: "/images/stage-nursery.jpg",
  farm: "/images/stage-farm.jpg",
  crew: "/images/stage-crew.jpg",
  qr: "/images/stage-qr.jpg",
  boxes: "/images/stage-boxes.jpg",
  pallet: "/images/stage-pallet.jpg",
  container: "/images/stage-container.jpg",
  market: "/images/stage-market.jpg",
  quality: "/images/stage-quality.jpg",
  warehouse: "/images/stage-warehouse.jpg",
  booking: "/images/stage-booking.jpg",
} as const;

export const NODE_ICON: Partial<Record<EntityType, LucideIcon>> = {
  farm: Trees,
  plot: MapPin,
  harvest: Leaf,
  harvestCrew: Users,
  crate: Box,
  nursery: Sprout,
  transport: Truck,
  reception: Factory,
  qrCode: QrCode,
  processingLot: Factory,
  packingLot: Package,
  clamshellBatch: PackageOpen,
  inputLot: Layers,
  box: Box,
  pallet: Warehouse,
  container: Container,
  booking: StickyNote,
  importer: Building2,
  distributionCenter: Warehouse,
  supermarket: Store,
  supplier: Truck,
  qualityControl: BadgeCheck,
  certification: Award,
};

export type NodeTone = {
  rail: string;
  icon: string;
  card: string;
  chip: string;
  accent: string;
};

const TONES = {
  field: {
    rail: "bg-emerald-500",
    icon: "bg-emerald-600 text-white",
    card: "border-emerald-200 bg-gradient-to-r from-emerald-50 to-white",
    chip: "bg-emerald-100 text-emerald-800",
    accent: "from-emerald-700/70",
  },
  plant: {
    rail: "bg-teal-500",
    icon: "bg-teal-600 text-white",
    card: "border-teal-200 bg-gradient-to-r from-teal-50 to-white",
    chip: "bg-teal-100 text-teal-800",
    accent: "from-teal-800/70",
  },
  pack: {
    rail: "bg-zhenda",
    icon: "bg-zhenda text-white",
    card: "border-emerald-300 bg-gradient-to-r from-emerald-100 to-white",
    chip: "bg-emerald-200/80 text-emerald-900",
    accent: "from-[#122018]/75",
  },
  ship: {
    rail: "bg-slate-500",
    icon: "bg-slate-700 text-white",
    card: "border-slate-200 bg-gradient-to-r from-slate-50 to-white",
    chip: "bg-slate-100 text-slate-700",
    accent: "from-slate-800/70",
  },
} satisfies Record<string, NodeTone>;

export function nodeTone(type: EntityType): NodeTone {
  if (["farm", "plot", "harvest", "harvestCrew", "nursery", "crate", "transport"].includes(type)) return TONES.field;
  if (["reception", "processingLot"].includes(type)) return TONES.plant;
  if (["packingLot", "qrCode", "box", "pallet", "clamshellBatch", "inputLot", "qualityControl", "certification"].includes(type)) {
    return TONES.pack;
  }
  return TONES.ship;
}

const PHOTO_BY_TYPE: Partial<Record<EntityType, string>> = {
  packingLot: EXPLORER_PHOTOS.packing,
  clamshellBatch: EXPLORER_PHOTOS.packing,
  inputLot: EXPLORER_PHOTOS.boxes,
  processingLot: EXPLORER_PHOTOS.processing,
  reception: EXPLORER_PHOTOS.reception,
  transport: EXPLORER_PHOTOS.transport,
  crate: EXPLORER_PHOTOS.crates,
  harvest: EXPLORER_PHOTOS.harvest,
  plot: EXPLORER_PHOTOS.plot,
  nursery: EXPLORER_PHOTOS.nursery,
  farm: EXPLORER_PHOTOS.farm,
  harvestCrew: EXPLORER_PHOTOS.crew,
  qrCode: EXPLORER_PHOTOS.qr,
  box: EXPLORER_PHOTOS.boxes,
  pallet: EXPLORER_PHOTOS.pallet,
  container: EXPLORER_PHOTOS.container,
  booking: EXPLORER_PHOTOS.booking,
  importer: EXPLORER_PHOTOS.warehouse,
  distributionCenter: EXPLORER_PHOTOS.warehouse,
  supermarket: EXPLORER_PHOTOS.market,
  supplier: EXPLORER_PHOTOS.boxes,
  qualityControl: EXPLORER_PHOTOS.quality,
  certification: EXPLORER_PHOTOS.quality,
};

export function nodePhoto(type: EntityType): string {
  return PHOTO_BY_TYPE[type] ?? EXPLORER_PHOTOS.blueberries;
}

export function nodeShortLabel(type: EntityType): string {
  const map: Partial<Record<EntityType, string>> = {
    packingLot: "Empaque",
    processingLot: "Proceso",
    reception: "Recepción",
    transport: "Campo",
    crate: "Jabas",
    harvest: "Cosecha",
    harvestCrew: "Cuadrilla",
    plot: "Parcela",
    farm: "Fundo",
    nursery: "Vivero",
    qrCode: "QR",
    box: "Cajas",
    pallet: "Pallet",
    container: "Contenedor",
    booking: "Booking",
    importer: "Importador",
    distributionCenter: "CD",
    supermarket: "Retail",
    clamshellBatch: "Clamshell",
    qualityControl: "Calidad",
    certification: "Certificación",
  };
  return map[type] ?? type;
}

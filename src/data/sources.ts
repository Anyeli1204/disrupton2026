import type { DataSource, Sourced } from "@/types";

export function src(system: string, source: string, updatedAt: string): DataSource {
  return { system, source, updatedAt };
}

export function sourced<T>(value: T, system: string, source: string, updatedAt: string): Sourced<T> {
  return { value, source: src(system, source, updatedAt) };
}

export const SRC = {
  agro: (at: string) => src("AgroSoft", "Sistema agrícola AgroSoft", at),
  erp: (at: string) => src("ERP Valle Azul", "Sistema Logístico ERP", at),
  quality: (at: string) => src("QMS", "Sistema de Calidad", at),
  packing: (at: string) => src("PackLine", "Sistema de empaque PackLine", at),
  plant: (at: string) => src("PlantOS", "Sistema de planta PlantOS", at),
  trade: (at: string) => src("TradeDoc", "Sistema de exportación TradeDoc", at),
  portal: (at: string) => src("Zhenda", "Portal de reclamos Zhenda", at),
};

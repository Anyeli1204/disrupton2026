import type { LotStatus } from "@/types";

export const lotStatusSummary: { status: LotStatus; count: number }[] = [
  { status: "autorizado", count: 39 },
  { status: "observado", count: 3 },
  { status: "bloqueado", count: 1 },
  { status: "inmovilizado", count: 1 },
  { status: "sujeto_a_retiro", count: 1 },
  { status: "retirado", count: 1 },
  { status: "cerrado", count: 2 },
];

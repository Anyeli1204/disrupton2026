"use client";

import { LotDetail } from "@/components/lots/LotDetail";
import { PageHeader } from "@/components/ui/PageHeader";
import { getPackingLot } from "@/lib/queries";
import { useZhendaStore } from "@/lib/store";

export function LotDetailPage({ id }: { id: string }) {
  const store = useZhendaStore();
  const lot = store.allLots().find((l) => l.id === id) ?? getPackingLot(id);
  if (!lot) {
    return (
      <PageHeader
        eyebrow="Lote de empaque"
        title={id}
        description="No hay una ficha para este identificador en los sistemas conectados."
      />
    );
  }
  return <LotDetail lot={lot} />;
}

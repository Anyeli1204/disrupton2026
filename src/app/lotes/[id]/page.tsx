import { LotDetail } from "@/components/lots/LotDetail";
import { getPackingLot } from "@/lib/queries";
import { notFound } from "next/navigation";
import { Suspense } from "react";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const lot = getPackingLot(id);
  if (!lot) notFound();
  return (
    <Suspense>
      <LotDetail lot={lot} />
    </Suspense>
  );
}

import { LotDestinations } from "@/components/destinations/DestinationsModule";
import { Suspense } from "react";

export default async function Page({ params }: { params: Promise<{ loteId: string }> }) {
  const { loteId } = await params;
  return (
    <Suspense>
      <LotDestinations loteId={loteId} />
    </Suspense>
  );
}

import { ClaimDetail } from "@/components/claims/ClaimsModule";
import { getClaim } from "@/lib/queries";
import { notFound } from "next/navigation";
import { Suspense } from "react";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const claim = getClaim(id);
  if (!claim) notFound();
  return (
    <Suspense>
      <ClaimDetail claim={claim} />
    </Suspense>
  );
}

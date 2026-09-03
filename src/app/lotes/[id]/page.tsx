import { LotDetailPage } from "@/components/lots/LotDetailPage";
import { Suspense } from "react";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <Suspense>
      <LotDetailPage id={id} />
    </Suspense>
  );
}

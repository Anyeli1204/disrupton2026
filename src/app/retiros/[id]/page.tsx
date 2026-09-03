import { RecallDetail } from "@/components/recalls/RecallsModule";
import { Suspense } from "react";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <Suspense>
      <RecallDetail recallId={id} />
    </Suspense>
  );
}

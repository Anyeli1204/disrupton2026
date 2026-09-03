import { QualityDetail } from "@/components/quality/QualityModule";
import { Suspense } from "react";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <Suspense>
      <QualityDetail id={id} />
    </Suspense>
  );
}

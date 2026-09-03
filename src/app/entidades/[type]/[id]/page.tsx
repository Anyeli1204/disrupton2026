import { EntityDetail } from "@/components/entities/EntityDetail";
import { Suspense } from "react";

export default async function Page({ params }: { params: Promise<{ type: string; id: string }> }) {
  const { type, id } = await params;
  return (
    <Suspense>
      <EntityDetail type={type} id={id} />
    </Suspense>
  );
}

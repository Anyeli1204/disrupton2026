import { TraceabilityView } from "@/components/traceability/TraceabilityView";
import { Suspense } from "react";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ q?: string | string[] }>;
}) {
  const q = (await searchParams).q ?? "";
  const query = Array.isArray(q) ? q[0] : q;
  return (
    <Suspense fallback={<p className="text-sm text-slate-500">Cargando explorador…</p>}>
      <TraceabilityView initialQuery={query} />
    </Suspense>
  );
}

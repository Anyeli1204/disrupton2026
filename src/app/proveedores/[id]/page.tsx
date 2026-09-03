import { SupplierDetail } from "@/components/suppliers/SuppliersModule";
import { getSupplier } from "@/lib/queries";
import { notFound } from "next/navigation";
import { Suspense } from "react";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supplier = getSupplier(id);
  if (!supplier) notFound();
  return (
    <Suspense>
      <SupplierDetail supplier={supplier} />
    </Suspense>
  );
}

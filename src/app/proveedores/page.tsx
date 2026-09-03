import { SuppliersList } from "@/components/suppliers/SuppliersModule";
import { Suspense } from "react";

export default function Page() {
  return (
    <Suspense>
      <SuppliersList />
    </Suspense>
  );
}

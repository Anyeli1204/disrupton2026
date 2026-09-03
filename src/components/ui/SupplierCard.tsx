import type { Supplier } from "@/types";
import { SUPPLIER_TYPE_LABEL } from "@/lib/constants";
import Link from "next/link";
import { StatusBadge } from "./StatusBadge";

export function SupplierCard({ supplier }: { supplier: Supplier }) {
  return (
    <Link href={`/proveedores/${supplier.id}`} className="zhenda-card block p-4 transition hover:-translate-y-0.5 hover:border-zhenda/30">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-semibold text-slate-900">{supplier.name}</p>
          <p className="mt-1 text-xs text-slate-500">
            {supplier.code} · {SUPPLIER_TYPE_LABEL[supplier.type]}
          </p>
          <p className="mt-2 text-sm text-slate-600">{supplier.productsServices}</p>
        </div>
        <StatusBadge status={supplier.status} />
      </div>
    </Link>
  );
}

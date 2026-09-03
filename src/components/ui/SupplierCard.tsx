import type { Supplier } from "@/types";
import { SUPPLIER_TYPE_LABEL } from "@/lib/constants";
import Link from "next/link";
import { StatusBadge } from "./StatusBadge";

export function SupplierCard({ supplier }: { supplier: Supplier }) {
  return (
    <Link href={`/proveedores/${supplier.id}`} className="block rounded-xl border border-slate-200 bg-white p-4 hover:border-zhenda/40">
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

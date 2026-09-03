import type { Claim } from "@/types";
import { CLAIM_TYPE_LABEL } from "@/lib/constants";
import { formatDate } from "@/lib/format";
import Link from "next/link";
import { StatusBadge } from "./StatusBadge";

export function ClaimCard({ claim }: { claim: Claim }) {
  return (
    <Link href={`/reclamos/${claim.id}`} className="block rounded-xl border border-slate-200 bg-white p-4 hover:border-zhenda/40">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-slate-900">{claim.id}</p>
          <p className="mt-1 text-sm text-slate-600">{claim.problem}</p>
          <p className="mt-1 text-xs text-slate-500">
            {claim.client} · {formatDate(claim.date)} · {CLAIM_TYPE_LABEL[claim.type]}
          </p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <StatusBadge status={claim.severity} />
          <StatusBadge status={claim.status} />
        </div>
      </div>
    </Link>
  );
}

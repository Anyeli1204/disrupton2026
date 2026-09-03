import { Document as DocType } from "@/types";
import { formatDate } from "@/lib/format";
import { FileText } from "lucide-react";
import { StatusBadge } from "./StatusBadge";
import { DataSourceBadge } from "./DataSourceBadge";

export function DocumentCard({ doc }: { doc: DocType }) {
  return (
    <div className="zhenda-card flex items-start gap-3 p-4">
      <span className="rounded-lg bg-emerald-50 p-2 text-zhenda">
        <FileText className="h-4 w-4" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate font-medium text-slate-900">{doc.name}</p>
        <p className="mt-0.5 text-xs text-slate-500">
          {doc.code} · {doc.relatedEntityLabel} · {formatDate(doc.date)}
        </p>
        <div className="mt-2 flex items-center gap-2">
          <StatusBadge status={doc.status} />
          <DataSourceBadge source={doc.source} />
        </div>
      </div>
    </div>
  );
}

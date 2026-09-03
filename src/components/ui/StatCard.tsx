import type { LucideIcon } from "lucide-react";

export function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  tone = "neutral",
}: {
  label: string;
  value: number | string;
  hint?: string;
  icon: LucideIcon;
  tone?: "neutral" | "green" | "amber" | "red";
}) {
  const ring = {
    neutral: "border-slate-200",
    green: "border-emerald-200",
    amber: "border-amber-200",
    red: "border-red-200",
  }[tone];
  const iconColor = {
    neutral: "text-zhenda bg-emerald-50",
    green: "text-emerald-700 bg-emerald-50",
    amber: "text-amber-700 bg-amber-50",
    red: "text-red-700 bg-red-50",
  }[tone];

  return (
    <div className={`rounded-xl border bg-white p-4 shadow-sm ${ring}`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</p>
          <p className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">{value}</p>
          {hint && <p className="mt-1 text-xs text-slate-500">{hint}</p>}
        </div>
        <span className={`rounded-lg p-2 ${iconColor}`}>
          <Icon className="h-5 w-5" />
        </span>
      </div>
    </div>
  );
}

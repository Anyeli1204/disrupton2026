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
  const iconColor = {
    neutral: "text-zhenda bg-emerald-50",
    green: "text-emerald-700 bg-emerald-50",
    amber: "text-amber-700 bg-amber-50",
    red: "text-red-700 bg-red-50",
  }[tone];

  return (
    <div className="zhenda-card p-4 transition hover:-translate-y-0.5 hover:border-zhenda/20">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">{label}</p>
          <p className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">{value}</p>
          {hint && <p className="mt-1 text-xs text-slate-500">{hint}</p>}
        </div>
        <span className={`rounded-xl p-2.5 ${iconColor}`}>
          <Icon className="h-5 w-5" />
        </span>
      </div>
    </div>
  );
}

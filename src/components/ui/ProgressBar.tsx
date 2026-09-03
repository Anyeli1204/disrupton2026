export function ProgressBar({ value, label }: { value: number; label?: string }) {
  const pct = Math.max(0, Math.min(100, Math.round(value)));
  return (
    <div>
      {label && <div className="mb-1 flex justify-between text-xs text-slate-600">{label}</div>}
      <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
        <div className="h-full rounded-full bg-zhenda transition-all" style={{ width: `${pct}%` }} />
      </div>
      <p className="mt-1 text-right text-xs font-medium text-slate-600">{pct} %</p>
    </div>
  );
}

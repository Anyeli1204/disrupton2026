import Link from "next/link";

export function AlertCard({
  level,
  text,
  href,
}: {
  level: "alta" | "media" | "baja";
  text: string;
  href?: string;
}) {
  const tone = {
    alta: "border-l-red-600 bg-red-50/60",
    media: "border-l-amber-500 bg-amber-50/60",
    baja: "border-l-slate-400 bg-slate-50",
  }[level];
  const label = level.toUpperCase();
  const inner = (
    <div className={`rounded-lg border border-slate-200 border-l-4 p-3 ${tone}`}>
      <p className="text-[10px] font-bold tracking-widest text-slate-500">{label}</p>
      <p className="mt-1 text-sm text-slate-800">{text}</p>
    </div>
  );
  return href ? <Link href={href}>{inner}</Link> : inner;
}

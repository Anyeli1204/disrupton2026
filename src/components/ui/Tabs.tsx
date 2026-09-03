"use client";

export function Tabs({
  tabs,
  value,
  onChange,
}: {
  tabs: { id: string; label: string }[];
  value: string;
  onChange: (id: string) => void;
}) {
  return (
    <div className="flex gap-1 overflow-x-auto border-b border-slate-200">
      {tabs.map((t) => (
        <button
          key={t.id}
          type="button"
          onClick={() => onChange(t.id)}
          className={`whitespace-nowrap px-4 py-2.5 text-sm font-medium transition ${
            value === t.id
              ? "border-b-2 border-zhenda text-zhenda"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}

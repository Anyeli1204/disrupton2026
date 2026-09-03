"use client";

export function DataTable<T>({
  columns,
  rows,
  rowKey,
  empty = "No hay registros.",
  onRowClick,
}: {
  columns: { key: string; header: string; className?: string; render: (row: T) => React.ReactNode }[];
  rows: T[];
  rowKey: (row: T) => string;
  empty?: string;
  onRowClick?: (row: T) => void;
}) {
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
      <table className="min-w-full text-sm">
        <thead className="bg-slate-50 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-500">
          <tr>
            {columns.map((c) => (
              <th key={c.key} className={`whitespace-nowrap px-4 py-3 ${c.className ?? ""}`}>
                {c.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {rows.length === 0 && (
            <tr>
              <td colSpan={columns.length} className="px-4 py-10 text-center text-slate-500">
                {empty}
              </td>
            </tr>
          )}
          {rows.map((row) => (
            <tr
              key={rowKey(row)}
              className={onRowClick ? "cursor-pointer hover:bg-emerald-50/40" : "hover:bg-slate-50/80"}
              onClick={onRowClick ? () => onRowClick(row) : undefined}
            >
              {columns.map((c) => (
                <td key={c.key} className={`px-4 py-3 align-middle text-slate-700 ${c.className ?? ""}`}>
                  {c.render(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

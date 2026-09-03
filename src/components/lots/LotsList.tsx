"use client";

import { LotsOverview } from "@/components/lots/LotsOverview";
import { Button } from "@/components/ui/Button";
import { CountryFlag } from "@/components/ui/CountryFlag";
import { EntityLink } from "@/components/ui/EntityLink";
import { Modal } from "@/components/ui/Modal";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { LOT_STATUS_LABEL } from "@/lib/constants";
import { formatDate, formatDateTime, formatNumber } from "@/lib/format";
import { EXPLORER_PHOTOS } from "@/lib/explorerVisuals";
import { useZhendaStore } from "@/lib/store";
import type { LotStatus } from "@/types";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Download,
  Info,
  Plus,
  QrCode,
  Search,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";

const PAGE_SIZE = 10;
const VARIETIES = ["Ventura", "Biloxi"];

function toInputDate(iso: string) {
  if (/^\d{4}-\d{2}-\d{2}/.test(iso)) return iso.slice(0, 10);
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toISOString().slice(0, 10);
}

function rowPhoto(variety: string, status: string) {
  if (status === "observado" || status === "sujeto_a_retiro") return EXPLORER_PHOTOS.quality;
  if (variety === "Biloxi") return EXPLORER_PHOTOS.harvest;
  return EXPLORER_PHOTOS.packing;
}

export function LotsList() {
  const router = useRouter();
  const params = useSearchParams();
  const estado = (params.get("estado") as LotStatus | null) ?? "";
  const store = useZhendaStore();
  const [q, setQ] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [page, setPage] = useState(1);
  const [createOpen, setCreateOpen] = useState(false);

  const lots = store.allLots();
  const destinations = useMemo(
    () => [...new Set(lots.map((l) => l.destinationCountry))].sort(),
    [lots],
  );

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    return lots.filter((l) => {
      if (estado && l.status !== estado) return false;
      const packed = toInputDate(l.packingDate.value);
      if (from && packed < from) return false;
      if (to && packed > to) return false;
      if (!query) return true;
      return (
        l.id.toLowerCase().includes(query) ||
        l.variety.toLowerCase().includes(query) ||
        l.destinationCountry.toLowerCase().includes(query)
      );
    });
  }, [lots, estado, q, from, to]);

  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, pages);
  const slice = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const fromRow = filtered.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1;
  const toRow = Math.min(currentPage * PAGE_SIZE, filtered.length);

  function setStatus(next: LotStatus | "") {
    setPage(1);
    router.push(next ? `/lotes?estado=${next}` : "/lotes");
  }

  function exportCsv() {
    const header = ["Lote", "Variedad", "Fecha empaque", "Destino", "Cajas", "Estado", "Última actualización", "Línea"];
    const lines = filtered.map((r) =>
      [
        r.id,
        r.variety,
        formatDate(r.packingDate.value),
        r.destinationCountry,
        r.boxCount,
        LOT_STATUS_LABEL[r.status],
        formatDateTime(r.packingDate.source.updatedAt),
        r.packingLine,
      ]
        .map((cell) => `"${String(cell).replaceAll('"', '""')}"`)
        .join(","),
    );
    const blob = new Blob(["\uFEFF" + [header.join(","), ...lines].join("\n")], {
      type: "text/csv;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "lotes-empaque.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title="Lotes de empaque"
        description="Identificador maestro asociado al QR del clamshell."
        meta={
          <span className="inline-flex items-center gap-1 text-xs text-slate-400">
            <Info className="h-3.5 w-3.5" />
            Campaña 2026–2027 · PackLine
          </span>
        }
      />

      <LotsOverview lots={lots} onFilterStatus={setStatus} />

      <div className="zhenda-card flex flex-wrap items-center gap-2 p-3">
        <label className="relative min-w-[14rem] flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setPage(1);
            }}
            placeholder="Buscar por lote, variedad o destino..."
            className="zhenda-input rounded-full pl-10"
          />
        </label>
        <label className="inline-flex items-center gap-2 text-xs text-slate-500">
          <CalendarDays className="h-4 w-4" />
          <input
            type="date"
            value={from}
            onChange={(e) => {
              setFrom(e.target.value);
              setPage(1);
            }}
            className="zhenda-input w-[9.5rem] rounded-full py-2"
          />
          <span>—</span>
          <input
            type="date"
            value={to}
            onChange={(e) => {
              setTo(e.target.value);
              setPage(1);
            }}
            className="zhenda-input w-[9.5rem] rounded-full py-2"
          />
        </label>
        <select
          className="zhenda-select"
          value={estado}
          onChange={(e) => setStatus(e.target.value as LotStatus | "")}
        >
          <option value="">Todos los estados</option>
          {Object.entries(LOT_STATUS_LABEL).map(([k, v]) => (
            <option key={k} value={k}>
              {v}
            </option>
          ))}
        </select>
        <Button onClick={exportCsv}>
          <Download className="h-4 w-4" />
          Exportar
        </Button>
        <Button variant="primary" onClick={() => setCreateOpen(true)}>
          <Plus className="h-4 w-4" />
          Nuevo lote
        </Button>
      </div>

      <div className="zhenda-card overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-emerald-50/70 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-3 py-3" />
              <th className="px-3 py-3">Lote</th>
              <th className="px-3 py-3">Variedad</th>
              <th className="px-3 py-3">Fecha de empaque</th>
              <th className="px-3 py-3">Destino</th>
              <th className="px-3 py-3">Cajas</th>
              <th className="px-3 py-3">Estado</th>
              <th className="px-3 py-3">Última actualización</th>
              <th className="px-3 py-3">Línea</th>
              <th className="px-3 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {slice.length === 0 && (
              <tr>
                <td colSpan={10} className="px-4 py-10 text-center text-slate-500">
                  No hay lotes con esos filtros.
                </td>
              </tr>
            )}
            {slice.map((row) => (
              <tr
                key={row.id}
                className="cursor-pointer hover:bg-emerald-50/50"
                onClick={() => router.push(`/lotes/${row.id}`)}
              >
                <td className="px-3 py-3.5">
                  <Link
                    href={`/trazabilidad?q=${encodeURIComponent(row.id)}`}
                    onClick={(e) => e.stopPropagation()}
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-zhenda hover:bg-emerald-50"
                    aria-label={`Explorar ${row.id}`}
                  >
                    <QrCode className="h-4 w-4" />
                  </Link>
                </td>
                <td className="px-3 py-3.5">
                  <span className="inline-flex items-center gap-2.5">
                    <span className="relative h-9 w-9 shrink-0 overflow-hidden rounded-lg ring-1 ring-emerald-100">
                      <Image
                        src={rowPhoto(row.variety, row.status)}
                        alt=""
                        fill
                        className="object-cover"
                        sizes="36px"
                      />
                    </span>
                    <EntityLink type="packingLot" id={row.id} />
                  </span>
                </td>
                <td className="px-3 py-3.5 text-slate-700">{row.variety}</td>
                <td className="px-3 py-3.5 text-slate-700">{formatDate(row.packingDate.value)}</td>
                <td className="px-3 py-3.5">
                  <span className="inline-flex items-center gap-2">
                    <CountryFlag country={row.destinationCountry} />
                    {row.destinationCountry}
                  </span>
                </td>
                <td className="px-3 py-3.5 text-slate-700">{formatNumber(row.boxCount)}</td>
                <td className="px-3 py-3.5">
                  <StatusBadge status={row.status} />
                </td>
                <td className="px-3 py-3.5 text-slate-500">{formatDateTime(row.packingDate.source.updatedAt)}</td>
                <td className="max-w-[12rem] truncate px-3 py-3.5 text-slate-600">{row.packingLine}</td>
                <td className="px-3 py-3.5 text-slate-400">
                  <ChevronRight className="h-4 w-4" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 px-4 py-3 text-xs text-slate-500">
          <p>
            Mostrando {fromRow} a {toRow} de {formatNumber(filtered.length)} lotes
          </p>
          <div className="flex items-center gap-2">
            <span>{PAGE_SIZE} por página</span>
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="rounded-lg border border-slate-200 p-1.5 disabled:opacity-40"
              aria-label="Página anterior"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </button>
            {Array.from({ length: pages }, (_, i) => i + 1)
              .filter((n) => n === 1 || n === pages || Math.abs(n - currentPage) <= 2)
              .reduce<(number | "gap")[]>((acc, n, i, arr) => {
                if (i > 0 && n - (arr[i - 1] as number) > 1) acc.push("gap");
                acc.push(n);
                return acc;
              }, [])
              .map((n, i) =>
                n === "gap" ? (
                  <span key={`g-${i}`}>…</span>
                ) : (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setPage(n)}
                    className={`min-w-7 rounded-lg px-2 py-1 font-medium ${
                      n === currentPage ? "border border-zhenda text-zhenda" : "hover:bg-emerald-50"
                    }`}
                  >
                    {n}
                  </button>
                ),
              )}
            <button
              type="button"
              disabled={currentPage >= pages}
              onClick={() => setPage((p) => Math.min(pages, p + 1))}
              className="rounded-lg border border-slate-200 p-1.5 disabled:opacity-40"
              aria-label="Página siguiente"
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      <NewLotModal
        open={createOpen}
        destinations={destinations}
        onClose={() => setCreateOpen(false)}
        onCreate={(input) => {
          const lot = store.addLot(input);
          setCreateOpen(false);
          router.push(`/lotes/${lot.id}`);
        }}
      />
    </div>
  );
}

function NewLotModal({
  open,
  destinations,
  onClose,
  onCreate,
}: {
  open: boolean;
  destinations: string[];
  onClose: () => void;
  onCreate: (input: { variety: string; destinationCountry: string; boxCount: number }) => void;
}) {
  const [variety, setVariety] = useState("Ventura");
  const [destinationCountry, setDestinationCountry] = useState(destinations[0] ?? "Estados Unidos");
  const [boxCount, setBoxCount] = useState(48);

  return (
    <Modal
      open={open}
      title="Nuevo lote de empaque"
      onClose={onClose}
      footer={
        <div className="flex justify-end gap-2">
          <Button onClick={onClose}>Cancelar</Button>
          <Button
            variant="primary"
            onClick={() =>
              onCreate({
                variety,
                destinationCountry,
                boxCount: Math.max(1, Number(boxCount) || 1),
              })
            }
          >
            Registrar lote
          </Button>
        </div>
      }
    >
      <p className="mb-4 text-sm leading-6 text-slate-600">
        Zhenda no crea el lote en PackLine: registra el identificador y reutiliza cosecha, clamshell, contenedor y booking
        de un lote semilla de la misma variedad.
      </p>
      <div className="grid gap-3">
        <label className="text-xs text-slate-500">
          Variedad
          <select className="zhenda-input mt-1 w-full rounded-xl" value={variety} onChange={(e) => setVariety(e.target.value)}>
            {VARIETIES.map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>
        </label>
        <label className="text-xs text-slate-500">
          Destino
          <span className="mt-1 flex items-center gap-2">
            <CountryFlag country={destinationCountry} className="h-7 w-7" />
            <select
              className="zhenda-input w-full rounded-xl"
              value={destinationCountry}
              onChange={(e) => setDestinationCountry(e.target.value)}
            >
              {destinations.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </span>
        </label>
        <label className="text-xs text-slate-500">
          Cajas
          <input
            type="number"
            min={1}
            className="zhenda-input mt-1"
            value={boxCount}
            onChange={(e) => setBoxCount(Number(e.target.value))}
          />
        </label>
      </div>
    </Modal>
  );
}

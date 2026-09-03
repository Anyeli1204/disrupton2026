"use client";

import { entityTypeLabel } from "@/lib/format";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

const LABELS: Record<string, string> = {
  "": "Dashboard",
  trazabilidad: "Explorador",
  lotes: "Lotes",
  proveedores: "Proveedores e insumos",
  calidad: "Calidad y certificaciones",
  reclamos: "Reclamos e incidencias",
  destinos: "Destinos",
  retiros: "Retiros",
  auditorias: "Auditorías",
  documentos: "Documentos",
  entidades: "Entidad",
};

function crumbLabel(segment: string, index: number, parts: string[]) {
  if (LABELS[segment] && index === 0) return LABELS[segment];
  if (parts[0] === "entidades" && index === 1) return entityTypeLabel(segment);
  return decodeURIComponent(segment);
}

export function Breadcrumbs() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const from = searchParams.get("from");
  const current = pathname.split("/").filter(Boolean);
  const trails: string[][] = [];

  if (from) {
    for (const p of from.split("|")) {
      const segs = p.split("/").filter(Boolean);
      if (segs.length) trails.push(segs);
    }
  }
  trails.push(current);

  const crumbs: { href: string; label: string }[] = [{ href: "/", label: "Inicio" }];
  const seen = new Set<string>(["/"]);

  for (const parts of trails) {
    let acc = "";
    parts.forEach((seg, i) => {
      acc += `/${seg}`;
      if (seen.has(acc)) return;
      seen.add(acc);
      crumbs.push({ href: acc, label: crumbLabel(seg, i, parts) });
    });
  }

  if (pathname === "/" && !from) return null;

  return (
    <nav className="mb-5 flex flex-wrap items-center gap-1 text-xs text-slate-500">
      {crumbs.map((c, i) => (
        <span key={`${c.href}-${i}`} className="inline-flex items-center gap-1">
          {i > 0 && <ChevronRight className="h-3 w-3" />}
          {i === crumbs.length - 1 ? (
            <span className="font-medium text-slate-800">{c.label}</span>
          ) : (
            <Link href={c.href} className="hover:text-zhenda">
              {c.label}
            </Link>
          )}
        </span>
      ))}
    </nav>
  );
}

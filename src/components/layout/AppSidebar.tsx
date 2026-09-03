"use client";

import { NAV_ITEMS } from "@/lib/constants";
import { company } from "@/data/company";
import {
  AlertTriangle,
  ClipboardList,
  FolderOpen,
  GitBranch,
  LayoutDashboard,
  MapPin,
  Menu,
  Package,
  ShieldCheck,
  Truck,
  Undo2,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { LucideIcon } from "lucide-react";

const ICONS: Record<string, LucideIcon> = {
  LayoutDashboard,
  GitBranch,
  Package,
  Truck,
  ShieldCheck,
  AlertTriangle,
  MapPin,
  Undo2,
  ClipboardList,
  FolderOpen,
};

export function AppSidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const pathname = usePathname();

  return (
    <>
      {open && <button type="button" className="fixed inset-0 z-30 bg-[#0e1a14]/50 lg:hidden" aria-label="Cerrar menú" onClick={onClose} />}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-[16.5rem] flex-col bg-gradient-to-b from-[#122018] to-[#0e1a14] text-white shadow-[8px_0_32px_rgba(14,26,20,0.18)] transition-transform lg:static lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="border-b border-white/10 px-5 py-5">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3" onClick={onClose}>
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-zhenda text-sm font-bold shadow-inner">
                Z
              </span>
              <span>
                <span className="block text-base font-semibold tracking-tight">Zhenda</span>
                <span className="block text-[10px] uppercase tracking-[0.18em] text-emerald-200/65">Interoperabilidad</span>
              </span>
            </Link>
            <button type="button" className="rounded-lg p-1 text-emerald-100/70 hover:bg-white/10 lg:hidden" onClick={onClose}>
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4 zhenda-scroll">
          {NAV_ITEMS.map((item) => {
            const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            const Icon = ICONS[item.icon] ?? LayoutDashboard;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition ${
                  active
                    ? "bg-zhenda font-medium text-white shadow-sm"
                    : "text-emerald-100/70 hover:bg-white/10 hover:text-white"
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-white/10 px-5 py-4">
          <p className="text-[11px] leading-5 text-emerald-100/45">Conecta los códigos de cada sistema</p>
          <p className="mt-1 text-[11px] font-medium text-emerald-200/80">{company.plant} · {company.campaign}</p>
        </div>
      </aside>
    </>
  );
}

export function SidebarToggle({ onClick }: { onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="rounded-xl border border-slate-200 bg-white p-2 text-slate-600 shadow-sm lg:hidden">
      <Menu className="h-4 w-4" />
    </button>
  );
}

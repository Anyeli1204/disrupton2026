"use client";

import { NAV_ITEMS } from "@/lib/constants";
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
      {open && <button type="button" className="fixed inset-0 z-30 bg-slate-900/40 lg:hidden" aria-label="Cerrar menú" onClick={onClose} />}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-[#122018] text-white transition-transform lg:static lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-5 py-5">
          <Link href="/" className="flex items-center gap-2" onClick={onClose}>
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-zhenda text-sm font-bold">Z</span>
            <span>
              <span className="block text-base font-semibold tracking-tight">Zhenda</span>
              <span className="block text-[10px] uppercase tracking-[0.18em] text-emerald-200/70">Interoperabilidad</span>
            </span>
          </Link>
          <button type="button" className="lg:hidden" onClick={onClose}>
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 pb-6 zhenda-scroll">
          {NAV_ITEMS.map((item) => {
            const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            const Icon = ICONS[item.icon] ?? LayoutDashboard;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm ${
                  active ? "bg-white/10 font-medium text-white" : "text-emerald-100/70 hover:bg-white/5 hover:text-white"
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <p className="px-5 py-4 text-[11px] text-emerald-100/40">Conecta los códigos de cada sistema</p>
      </aside>
    </>
  );
}

export function SidebarToggle({ onClick }: { onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="rounded-lg border border-slate-200 bg-white p-2 text-slate-600 lg:hidden">
      <Menu className="h-4 w-4" />
    </button>
  );
}

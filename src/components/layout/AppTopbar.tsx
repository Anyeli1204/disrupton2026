"use client";

import { notifications } from "@/data";
import { company } from "@/data/company";
import { formatDateTime } from "@/lib/format";
import { Bell } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { SearchBar } from "@/components/ui/SearchBar";
import { SidebarToggle } from "./AppSidebar";

export function AppTopbar({ onMenu }: { onMenu: () => void }) {
  const [open, setOpen] = useState(false);
  const unread = notifications.filter((n) => !n.read).length;

  return (
    <header className="sticky top-0 z-20 border-b border-emerald-900/8 bg-white/80 backdrop-blur-md">
      <div className="flex flex-wrap items-center gap-3 px-4 py-3 lg:px-10">
        <SidebarToggle onClick={onMenu} />
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-slate-900">{company.tradeName}</p>
          <p className="text-xs text-slate-500">Campaña {company.campaign}</p>
        </div>
        <div className="order-last w-full lg:order-none lg:max-w-xl lg:flex-1">
          <SearchBar size="sm" placeholder="Buscador global: QR, lote, pallet, contenedor…" />
        </div>
        <div className="ml-auto flex items-center gap-3">
          <div className="relative">
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              className="relative rounded-xl border border-slate-200 bg-white p-2 text-slate-600 shadow-sm hover:border-zhenda/30"
              aria-label="Notificaciones"
            >
              <Bell className="h-4 w-4" />
              {unread > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-600 px-1 text-[10px] text-white">
                  {unread}
                </span>
              )}
            </button>
            {open && (
              <div className="absolute right-0 mt-2 w-80 overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl">
                <p className="px-3 py-2 text-[11px] font-semibold uppercase tracking-wide text-slate-400">Notificaciones</p>
                {notifications.map((n) => (
                  <Link
                    key={n.id}
                    href={n.href ?? "/"}
                    onClick={() => setOpen(false)}
                    className="block rounded-xl px-3 py-2 hover:bg-emerald-50/70"
                  >
                    <p className="text-sm text-slate-800">{n.text}</p>
                    <p className="text-[11px] text-slate-400">{formatDateTime(n.at)}</p>
                  </Link>
                ))}
              </div>
            )}
          </div>
          <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white py-1 pl-1 pr-3 shadow-sm">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-zhenda text-xs font-semibold text-white">
              {company.user.initials}
            </span>
            <div className="hidden sm:block">
              <p className="text-sm font-medium leading-tight">{company.user.name}</p>
              <p className="text-[11px] text-slate-500">{company.user.role}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

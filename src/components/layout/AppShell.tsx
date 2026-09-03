"use client";

import { Suspense, useState } from "react";
import { AppSidebar } from "./AppSidebar";
import { AppTopbar } from "./AppTopbar";
import { Breadcrumbs } from "./Breadcrumbs";

export function AppShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex min-h-screen">
      <AppSidebar open={open} onClose={() => setOpen(false)} />
      <div className="flex min-w-0 flex-1 flex-col">
        <Suspense fallback={null}>
          <AppTopbar onMenu={() => setOpen(true)} />
        </Suspense>
        <main className="flex-1 px-4 py-6 lg:px-10">
          <Suspense fallback={null}>
            <Breadcrumbs />
          </Suspense>
          {children}
        </main>
      </div>
    </div>
  );
}

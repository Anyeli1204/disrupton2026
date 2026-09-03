"use client";

import { entityHref } from "@/lib/queries";
import type { EntityType } from "@/types";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

export function EntityLink({
  type,
  id,
  children,
  className,
}: {
  type: EntityType;
  id: string;
  children?: React.ReactNode;
  className?: string;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const prev = searchParams.get("from");
  const trail = [prev, pathname].filter(Boolean).join("|");
  const href = `${entityHref(type, id)}${trail ? `?from=${encodeURIComponent(trail)}` : ""}`;

  return (
    <Link
      href={href}
      className={className ?? "font-medium text-zhenda hover:underline"}
    >
      {children ?? id}
    </Link>
  );
}

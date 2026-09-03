import { DocumentsRepository } from "@/components/documents/DocumentsRepository";
import { Suspense } from "react";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ id?: string | string[] }>;
}) {
  const sp = await searchParams;
  const id = Array.isArray(sp.id) ? sp.id[0] : sp.id;
  return (
    <Suspense>
      <DocumentsRepository highlightId={id} />
    </Suspense>
  );
}

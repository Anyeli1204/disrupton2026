import { AuditDossier } from "@/components/audits/AuditsModule";
import { Suspense } from "react";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <Suspense>
      <AuditDossier id={id} />
    </Suspense>
  );
}

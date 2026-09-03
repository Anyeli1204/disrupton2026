import { AuditsList } from "@/components/audits/AuditsModule";
import { Suspense } from "react";

export default function Page() {
  return (
    <Suspense>
      <AuditsList />
    </Suspense>
  );
}

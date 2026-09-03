import { ClaimsInbox } from "@/components/claims/ClaimsModule";
import { Suspense } from "react";

export default function Page() {
  return (
    <Suspense>
      <ClaimsInbox />
    </Suspense>
  );
}

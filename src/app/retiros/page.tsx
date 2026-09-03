import { RecallsList } from "@/components/recalls/RecallsModule";
import { Suspense } from "react";

export default function Page() {
  return (
    <Suspense>
      <RecallsList />
    </Suspense>
  );
}

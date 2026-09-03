import { LotsList } from "@/components/lots/LotsList";
import { Suspense } from "react";

export default function Page() {
  return (
    <Suspense>
      <LotsList />
    </Suspense>
  );
}

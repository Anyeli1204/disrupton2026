import { DestinationsList } from "@/components/destinations/DestinationsModule";
import { Suspense } from "react";

export default function Page() {
  return (
    <Suspense>
      <DestinationsList />
    </Suspense>
  );
}

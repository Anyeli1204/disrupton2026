import { QualityList } from "@/components/quality/QualityModule";
import { Suspense } from "react";

export default function Page() {
  return (
    <Suspense>
      <QualityList />
    </Suspense>
  );
}

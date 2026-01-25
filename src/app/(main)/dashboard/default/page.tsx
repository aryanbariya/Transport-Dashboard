import { Suspense } from "react";
import { SectionCards } from "./_components/section-cards";
import { SectionCardsSkeleton } from "./_components/section-cards-skeleton";

export default function Page() {
  return (
    <div className="@container/main flex flex-col gap-4 md:gap-6">
      <Suspense fallback={<SectionCardsSkeleton />}>
        <SectionCards />
      </Suspense>
      {/* <ChartAreaInteractive /> */}
      {/* <DataTable data={data} /> */}
    </div>
  );
}

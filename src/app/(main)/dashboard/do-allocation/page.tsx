import { DOAllocationTable } from "./_components/do-allocation-table";

export const metadata = {
    title: "DO Allocation | PDS-Transport",
    description: "View Delivery Order allocations across different subgodowns.",
};

export default function DOAllocationPage() {
    return (
        <div className="flex flex-col gap-4 min-w-0 w-full overflow-hidden">
            <div className="flex flex-col gap-1">
                <h1 className="text-2xl font-bold tracking-tight">DO Allocation</h1>
                <p className="text-muted-foreground">
                    View Delivery Order allocations across different subgodowns.
                </p>
            </div>
            <DOAllocationTable />
        </div>
    );
}

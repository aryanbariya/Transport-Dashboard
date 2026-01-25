import { PackagingTable } from "./_components/packaging-table";

export const metadata = {
    title: "Packaging Master | PDS-Transport",
    description: "Manage packaging materials, weights, and statuses.",
};

export default function PackagingMasterPage() {
    return (
        <div className="flex flex-col gap-4">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Packaging</h1>
                <p className="text-muted-foreground">
                    Manage your packaging materials, their weights, and operational status.
                </p>
            </div>
            <PackagingTable />
        </div>
    );
}

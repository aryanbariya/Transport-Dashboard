import { MSWCTable } from "./_components/mswc-table";

export const metadata = {
    title: "MSWC Master | PDS-Transport",
    description: "Manage MSWC godowns and their details.",
};

export default function MSWCMasterPage() {
    return (
        <div className="flex flex-col gap-4">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">MSWC Godowns</h1>
                <p className="text-muted-foreground">
                    Manage your MSWC godowns, locations, and status.
                </p>
            </div>
            <MSWCTable />
        </div>
    );
}

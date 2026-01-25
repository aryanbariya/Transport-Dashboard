import { GodownTable } from "./_components/godown-table";

export const metadata = {
    title: "Godown Master | PDS-Transport",
    description: "Manage godowns, sub-godowns, and their details.",
};

export default function GodownMasterPage() {
    return (
        <div className="flex flex-col gap-4">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Godowns</h1>
                <p className="text-muted-foreground">
                    Manage your transport godowns, sub-godowns, and their parent locations.
                </p>
            </div>
            <GodownTable />
        </div>
    );
}

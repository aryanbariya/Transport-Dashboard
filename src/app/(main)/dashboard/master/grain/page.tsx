import { GrainTable } from "./_components/grain-table";

export const metadata = {
    title: "Grain Master | PDS-Transport",
    description: "Manage system grains, their storage godowns, and modification history.",
};

export default function GrainMasterPage() {
    return (
        <div className="flex flex-col gap-4">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Grains</h1>
                <p className="text-muted-foreground">
                    Manage your transport grains, their assigned godowns, and history.
                </p>
            </div>
            <GrainTable />
        </div>
    );
}

import { OwnerTable } from "./_components/owner-table";

export const metadata = {
    title: "Owner Master | PDS-Transport",
    description: "Manage system owners and their details.",
};

export default function OwnerMasterPage() {
    return (
        <div className="flex flex-col gap-4">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Owners</h1>
                <p className="text-muted-foreground">
                    Manage your transport owners and their contact information.
                </p>
            </div>
            <OwnerTable />
        </div>
    );
}

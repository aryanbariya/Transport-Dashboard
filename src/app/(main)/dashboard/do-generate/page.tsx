import { DOGenerateTable } from "./_components/do-generate-table";

export const metadata = {
    title: "DO Generate | PDS-Transport",
    description: "Manage Delivery Order generation records.",
};

export default function DOGeneratePage() {
    return (
        <div className="flex flex-col gap-4">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">DO Generate</h1>
                <p className="text-muted-foreground">
                    View and manage Delivery Order generation records.
                </p>
            </div>
            <DOGenerateTable />
        </div>
    );
}

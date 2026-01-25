import { SchemeTable } from "./_components/scheme-table";

export const metadata = {
    title: "Scheme Master | PDS-Transport",
    description: "Manage scheme names and their statuses.",
};

export default function SchemeMasterPage() {
    return (
        <div className="flex flex-col gap-4">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Schemes</h1>
                <p className="text-muted-foreground">
                    Manage your transport schemes and their current operational status.
                </p>
            </div>
            <SchemeTable />
        </div>
    );
}

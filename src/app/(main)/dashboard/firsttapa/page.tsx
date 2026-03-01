import { TransportTable } from "./_components/transport-table";

export const metadata = {
    title: "First Tapa | PDS-Transport",
    description: "Manage and monitor transport entries for First Tapa.",
};

export default function FirstTapaPage() {
    return (
        <div className="flex flex-col gap-4">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">First Tapa</h1>
                <p className="text-muted-foreground">
                    Manage and monitor transport entries for First Tapa.
                </p>
            </div>
            <TransportTable />
        </div>
    );
}

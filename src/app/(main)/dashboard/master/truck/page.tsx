import { TruckTable } from "./_components/truck-table";

export const metadata = {
    title: "Truck Master | PDS-Transport",
    description: "Manage transport trucks, their details, and validity documents.",
};

export default function TruckMasterPage() {
    return (
        <div className="flex flex-col gap-4">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Trucks</h1>
                <p className="text-muted-foreground">
                    Manage your transport trucks, registration details, and document validities.
                </p>
            </div>
            <TruckTable />
        </div>
    );
}

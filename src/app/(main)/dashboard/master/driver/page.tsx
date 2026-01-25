import { DriverTable } from "./_components/driver-table";

export const metadata = {
    title: "Driver Master | PDS-Transport",
    description: "Manage system drivers, their licenses and contact details.",
};

export default function DriverMasterPage() {
    return (
        <div className="flex flex-col gap-4">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Drivers</h1>
                <p className="text-muted-foreground">
                    Manage your transport drivers, their licenses, and contact information.
                </p>
            </div>
            <DriverTable />
        </div>
    );
}

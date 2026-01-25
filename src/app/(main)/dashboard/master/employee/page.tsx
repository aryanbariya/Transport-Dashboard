import { EmployeeTable } from "./_components/employee-table";

export const metadata = {
    title: "Employee Master | PDS-Transport",
    description: "Manage system employees and their details.",
};

export default function EmployeeMasterPage() {
    return (
        <div className="flex flex-col gap-4">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Employees</h1>
                <p className="text-muted-foreground">
                    Manage your transport employees, their credentials, and bank information.
                </p>
            </div>
            <EmployeeTable />
        </div>
    );
}

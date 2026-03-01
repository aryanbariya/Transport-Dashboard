import { FirstReportTable } from "./_components/first-report-table";

export const metadata = {
    title: "First Report | PDS-Transport",
    description: "View and manage First Tapa transport reports.",
};

export default function FirstReportPage() {
    return (
        <div className="flex flex-col gap-4">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">First Report</h1>
                <p className="text-muted-foreground">
                    Detailed transport reports with allocation breakdowns.
                </p>
            </div>
            <FirstReportTable />
        </div>
    );
}

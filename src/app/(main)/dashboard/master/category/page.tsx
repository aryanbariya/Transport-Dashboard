import { CategoryTable } from "./_components/category-table";

export const metadata = {
    title: "Category Master | PDS-Transport",
    description: "Manage system categories and their statuses.",
};

export default function CategoryMasterPage() {
    return (
        <div className="flex flex-col gap-4">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Categories</h1>
                <p className="text-muted-foreground">
                    Manage your transport categories and their operational status.
                </p>
            </div>
            <CategoryTable />
        </div>
    );
}

import type { ColumnDef } from "@tanstack/react-table";
import type { DOAllocation } from "./schema";

export type AllocationRow = DOAllocation & { display_do_info?: string };

export function getDOAllocationColumns(
    subGodowns: string[],
    pageIndex: number,
    pageSize: number
): ColumnDef<AllocationRow, any>[] {
    const baseColumns: ColumnDef<AllocationRow, any>[] = [
        {
            id: "sr_no",
            header: "Sr. No.",
            cell: (info) => pageIndex * pageSize + info.row.index + 1,
            meta: {
                headerClassName: "sticky left-0 z-5 bg-muted min-w-[60px] max-w-[60px]",
                cellClassName: "sticky left-0 z-4 bg-background min-w-[60px] max-w-[60px]",
            },
        },
        {
            accessorKey: "display_do_info",
            header: "D.O. No.",
            cell: (info) => info.getValue(),
            meta: {
                headerClassName: "sticky left-[60px] z-5 bg-muted min-w-[250px] max-w-[250px]",
                cellClassName: "sticky left-[60px] z-4 bg-background min-w-[250px] max-w-[250px]",
            },
        },
    ];

    const dynamicColumns: ColumnDef<AllocationRow, any>[] = subGodowns.map((name) => ({
        id: `godown_${name}`,
        header: name,
        cell: (info) => {
            const row = info.row.original;
            const godownsArr = Array.isArray(row.godown) ? row.godown : [];
            const idx = godownsArr.findIndex(g => g.trim().toLowerCase() === name.trim().toLowerCase());

            if (idx === -1) return null;

            const quantity = Array.isArray(row.quantity) ? row.quantity[idx] : "";
            const vahtuk = Array.isArray(row.vahtuk) ? row.vahtuk[idx] : "";

            return (
                <div className="flex flex-col">
                    <span className="font-medium text-blue-600">{quantity}</span>
                    <span className="text-[10px] text-muted-foreground uppercase leading-tight font-semibold">
                        {vahtuk}
                    </span>
                </div>
            );
        },
    }));

    return [...baseColumns, ...dynamicColumns];
}

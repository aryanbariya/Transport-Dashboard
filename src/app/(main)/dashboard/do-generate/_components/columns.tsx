import type { ColumnDef } from "@tanstack/react-table";
import { EllipsisVertical } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import type { DOGenerate } from "./schema";

function formatDate(dateStr: string) {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });
}

export const getDOGenerateColumns = (
    onEdit: (doGenerate: DOGenerate) => void,
    mswcMap: Record<string, { godownName: string; godownUnder: string }>,
    grainMap: Record<string, string>,
    schemeMap: Record<string, string>
): ColumnDef<DOGenerate>[] => [
        {
            id: "select",
            header: ({ table }) => (
                <Checkbox
                    checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
                    onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                    aria-label="Select all"
                />
            ),
            cell: ({ row }) => (
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => row.toggleSelected(!!value)}
                    aria-label="Select row"
                />
            ),
            enableSorting: false,
            enableHiding: false,
        },
        {
            accessorKey: "do_no",
            header: ({ column }) => <DataTableColumnHeader column={column} title="D.O. No." />,
            cell: ({ row }) => {
                const doNo = row.original.do_no;
                const godownId = String(row.original.godown_id);
                const godownUnder = mswcMap[godownId]?.godownUnder || "";
                return <div className="font-mono">{doNo}{godownUnder ? ` - ${godownUnder}` : ""}</div>;
            },
        },
        {
            accessorKey: "godown_id",
            header: ({ column }) => <DataTableColumnHeader column={column} title="Base Godown" />,
            cell: ({ row }) => {
                const godownId = String(row.getValue("godown_id"));
                const godownName = mswcMap[godownId]?.godownName || godownId;
                return <div className="font-medium">{godownName}</div>;
            },
        },
        {
            accessorKey: "do_date",
            header: ({ column }) => <DataTableColumnHeader column={column} title="D.O. Date" />,
            cell: ({ row }) => <div>{formatDate(row.getValue("do_date"))}</div>,
        },
        {
            accessorKey: "cota",
            header: ({ column }) => <DataTableColumnHeader column={column} title="Quota Validity Date" />,
            cell: ({ row }) => <div>{formatDate(row.getValue("cota"))}</div>,
        },
        {
            accessorKey: "scheme_id",
            header: ({ column }) => <DataTableColumnHeader column={column} title="Scheme" />,
            cell: ({ row }) => {
                const schemeId = String(row.getValue("scheme_id"));
                const schemeName = schemeMap[schemeId] || schemeId;
                return <div>{schemeName}</div>;
            },
        },
        {
            accessorKey: "grain_id",
            header: ({ column }) => <DataTableColumnHeader column={column} title="Grain" />,
            cell: ({ row }) => {
                const grainId = String(row.getValue("grain_id"));
                const grainName = grainMap[grainId] || grainId;
                return <div>{grainName}</div>;
            },
        },
        {
            accessorKey: "quantity",
            header: ({ column }) => <DataTableColumnHeader column={column} title="Quantity" />,
            cell: ({ row }) => <div className="font-mono">{row.getValue("quantity")}</div>,
        },
        {
            id: "actions",
            cell: ({ row }) => {
                const doGenerate = row.original;

                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="size-8 p-0" size="icon">
                                <span className="sr-only">Open menu</span>
                                <EllipsisVertical className="size-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(String(doGenerate.stock_id))}>
                                Copy Stock ID
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>View details</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onEdit(doGenerate)}>Edit</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
        },
    ];

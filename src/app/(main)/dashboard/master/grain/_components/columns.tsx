import type { ColumnDef } from "@tanstack/react-table";
import { EllipsisVertical } from "lucide-react";
import { format } from "date-fns";

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
import type { Grain } from "./schema";

const formatDate = (dateStr: string) => {
    try {
        return format(new Date(dateStr), "dd-MM-yyyy HH:mm");
    } catch (error) {
        return dateStr;
    }
};

export const grainColumns: ColumnDef<Grain>[] = [
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
        accessorKey: "grain_id",
        header: ({ column }) => <DataTableColumnHeader column={column} title="ID" />,
        cell: ({ row }) => <div className="text-sm">{row.getValue("grain_id")}</div>,
    },
    {
        accessorKey: "grainName",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Grain Name" />,
        cell: ({ row }) => <div className="font-bold text-base">{row.getValue("grainName")}</div>,
    },
    {
        accessorKey: "godownName",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Godown" />,
        cell: ({ row }) => <div className="text-sm font-medium">{row.getValue("godownName")}</div>,
    },
    {
        accessorKey: "last_modified",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Last Modified" />,
        cell: ({ row }) => <div className="text-sm font-medium">{formatDate(row.getValue("last_modified"))}</div>,
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const grain = row.original;

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
                        <DropdownMenuItem onClick={() => navigator.clipboard.writeText(grain.uuid)}>
                            Copy UUID
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>View details</DropdownMenuItem>
                        <DropdownMenuItem>Edit Grain</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];

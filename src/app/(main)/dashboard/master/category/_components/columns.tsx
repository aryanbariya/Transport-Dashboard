import type { ColumnDef } from "@tanstack/react-table";
import { CircleCheck, CircleX, EllipsisVertical } from "lucide-react";
import { format } from "date-fns";

import { Badge } from "@/components/ui/badge";
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
import type { Category } from "./schema";

const formatDate = (dateStr: string) => {
    try {
        return format(new Date(dateStr), "dd-MM-yyyy HH:mm");
    } catch (error) {
        return dateStr;
    }
};

export const categoryColumns: ColumnDef<Category>[] = [
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
        accessorKey: "category_id",
        header: ({ column }) => <DataTableColumnHeader column={column} title="ID" />,
        cell: ({ row }) => <div className="text-sm">{row.getValue("category_id")}</div>,
    },
    {
        accessorKey: "category_name",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Category Name" />,
        cell: ({ row }) => <div className="font-bold text-base">{row.getValue("category_name")}</div>,
    },
    {
        accessorKey: "status",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
        cell: ({ row }) => {
            const status = row.getValue("status") as string;
            const isActive = status === "Active";
            return (
                <Badge variant="outline" className="gap-1.5 px-1.5 text-muted-foreground">
                    {isActive ? (
                        <CircleCheck className="size-3.5 fill-green-500 stroke-border dark:fill-green-400" />
                    ) : (
                        <CircleX className="size-3.5 fill-red-500 stroke-border dark:fill-red-400" />
                    )}
                    {status}
                </Badge>
            );
        },
    },
    {
        accessorKey: "last_modified",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Last Modified" />,
        cell: ({ row }) => <div className="text-sm font-medium">{formatDate(row.getValue("last_modified"))}</div>,
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const category = row.original;

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
                        <DropdownMenuItem onClick={() => navigator.clipboard.writeText(String(category.category_id))}>
                            Copy ID
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>View details</DropdownMenuItem>
                        <DropdownMenuItem>Edit Category</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];

import type { ColumnDef } from "@tanstack/react-table";
import { CircleCheck, CircleX, EllipsisVertical } from "lucide-react";

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
import type { Driver } from "./schema";

export const driverColumns: ColumnDef<Driver>[] = [
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
        accessorKey: "driver_id",
        header: ({ column }) => <DataTableColumnHeader column={column} title="ID" />,
        cell: ({ row }) => <div className="text-sm">{row.getValue("driver_id")}</div>,
    },
    {
        accessorKey: "driver_name",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Driver Name" />,
        cell: ({ row }) => <div className="font-bold text-base">{row.getValue("driver_name")}</div>,
    },
    {
        accessorKey: "contact",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Contact" />,
        cell: ({ row }) => <div className="text-sm">{row.getValue("contact") || "N/A"}</div>,
    },
    {
        accessorKey: "aadhar_card_no",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Aadhar Card" />,
        cell: ({ row }) => <div className="text-sm font-medium">{row.getValue("aadhar_card_no") || "N/A"}</div>,
    },
    {
        accessorKey: "driving_license_no",
        header: ({ column }) => <DataTableColumnHeader column={column} title="License No" />,
        cell: ({ row }) => <div className="text-sm font-medium">{row.getValue("driving_license_no") || "N/A"}</div>,
    },
    {
        accessorKey: "status",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
        cell: ({ row }) => {
            const status = row.getValue("status") as string;
            return (
                <Badge variant="outline" className="gap-1.5 px-1.5 text-muted-foreground">
                    {status === "Active" ? (
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
        id: "actions",
        cell: ({ row }) => {
            const driver = row.original;

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
                        <DropdownMenuItem onClick={() => navigator.clipboard.writeText(driver.uuid)}>
                            Copy UUID
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>View details</DropdownMenuItem>
                        <DropdownMenuItem>Edit Driver</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];

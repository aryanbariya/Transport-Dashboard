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
import type { Truck } from "./schema";

const formatDate = (dateStr: string) => {
    try {
        return format(new Date(dateStr), "dd-MM-yyyy");
    } catch (error) {
        return dateStr;
    }
};

export const truckColumns: ColumnDef<Truck>[] = [
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
        accessorKey: "truck_id",
        header: ({ column }) => <DataTableColumnHeader column={column} title="ID" />,
        cell: ({ row }) => <div>{row.getValue("truck_id")}</div>,
    },
    {
        accessorKey: "truck_name",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Truck Info" />,
        cell: ({ row }) => {
            const truck = row.original;
            return (
                <div className="flex flex-col gap-1">
                    <span className="font-bold uppercase">{truck.truck_name}</span>
                    <div className="flex gap-2 items-center">
                        <Badge variant="outline" className="gap-1.5 px-1.5 text-xs text-muted-foreground">
                            {truck.status === "Active" ? (
                                <CircleCheck className="size-3 fill-green-500 stroke-border dark:fill-green-400" />
                            ) : (
                                <CircleX className="size-3 fill-red-500 stroke-border dark:fill-red-400" />
                            )}
                            {truck.status}
                        </Badge>
                        <span className="text-[10px] text-muted-foreground uppercase border px-1 rounded">Sale: {truck.direct_sale}</span>
                    </div>
                </div>
            );
        },
    },
    {
        accessorKey: "truck_owner_name",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Owner & Company" />,
        cell: ({ row }) => {
            const truck = row.original;
            return (
                <div className="flex flex-col gap-0.5">
                    <span className="font-bold text-base">{truck.truck_owner_name}</span>
                    <span className="text-muted-foreground text-sm tracking-tight">{truck.company || "N/A"}</span>
                </div>
            );
        },
    },
    {
        header: "Weights",
        cell: ({ row }) => {
            const truck = row.original;
            return (
                <div className="flex flex-col text-sm">
                    <span>Empty Weight: <span className="font-semibold">{truck.empty_weight}</span></span>
                    <span>Gross Weight: <span className="font-semibold">{truck.gvw}</span></span>
                </div>
            );
        },
    },
    {
        header: "Validity",
        cell: ({ row }) => {
            const truck = row.original;
            return (
                <div className="grid grid-cols-1 gap-1 text-sm">
                    <span className="text-muted-foreground text-nowrap">Tax Validity: <span className="text-foreground font-bold">{formatDate(truck.tax_validity)}</span></span>
                    <span className="text-muted-foreground text-nowrap">Insurance Validity: <span className="text-foreground font-bold">{formatDate(truck.insurance_validity)}</span></span>
                    <span className="text-muted-foreground text-nowrap">Fitness Validity: <span className="text-foreground font-bold">{formatDate(truck.fitness_validity)}</span></span>
                    <span className="text-muted-foreground text-nowrap">Permit Validity: <span className="text-foreground font-bold">{formatDate(truck.permit_validity)}</span></span>
                </div>
            );
        },
    },
    {
        accessorKey: "reg_date",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Reg Date" />,
        cell: ({ row }) => <div className="text-base font-bold">{formatDate(row.getValue("reg_date"))}</div>,
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const truck = row.original;

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
                        <DropdownMenuItem onClick={() => navigator.clipboard.writeText(truck.uuid)}>
                            Copy UUID
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>View details</DropdownMenuItem>
                        <DropdownMenuItem>Edit Truck</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];

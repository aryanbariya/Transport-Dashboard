import type { ColumnDef } from "@tanstack/react-table";
import { CircleCheck, CircleX, EllipsisVertical, Eye } from "lucide-react";

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
import type { Transport } from "./schema";

export const getTransportColumns = (
    onEdit: (transport: Transport) => void,
    onToggleStatus: (transport: Transport) => void,
    statusFilter: string,
    onStatusFilterChange: (status: string) => void
): ColumnDef<Transport>[] => [
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
            size: 40,
            minSize: 40,
        },
        {
            id: "srNo",
            header: ({ column }) => <DataTableColumnHeader column={column} title="Sr.No" />,
            cell: ({ row, table }) => {
                const pageIndex = table.getState().pagination.pageIndex;
                const pageSize = table.getState().pagination.pageSize;
                return <div>{pageIndex * pageSize + row.index + 1}</div>;
            },
            size: 60,
            minSize: 60,
        },
        {
            id: "viewTp",
            header: "View TP",
            cell: () => (
                <Button variant="ghost" size="icon" className="size-8">
                    <Eye className="size-4" />
                </Button>
            ),
            size: 80,
            minSize: 80,
        },
        {
            accessorKey: "tpNo",
            header: ({ column }) => <DataTableColumnHeader column={column} title="TP No" />,
            size: 100,
            minSize: 100,
        },
        {
            accessorKey: "dispatchDate",
            header: ({ column }) => <DataTableColumnHeader column={column} title="Dispatch Date" />,
            cell: ({ row }) => {
                const date = row.getValue("dispatchDate") as string;
                return date ? new Date(date).toLocaleDateString() : "-";
            }
        },
        {
            accessorKey: "baseDepoName",
            header: ({ column }) => <DataTableColumnHeader column={column} title="Base Depo" />,
            size: 150,
            minSize: 150,
        },
        {
            accessorKey: "truckName",
            header: ({ column }) => <DataTableColumnHeader column={column} title="Truck No" />,
            size: 120,
            minSize: 120,
        },
        {
            accessorKey: "donumber",
            header: ({ column }) => <DataTableColumnHeader column={column} title="D.O Number" />,
            size: 120,
            minSize: 120,
        },
        {
            accessorKey: "quota",
            header: ({ column }) => <DataTableColumnHeader column={column} title="Quota" />,
            cell: ({ row }) => {
                const date = row.getValue("quota") as string;
                return date ? new Date(date).toLocaleDateString() : "-";
            }
        },
        {
            accessorKey: "schemeName",
            header: ({ column }) => <DataTableColumnHeader column={column} title="Scheme" />,
            size: 150,
            minSize: 150,
        },
        {
            accessorKey: "noOfBags",
            header: ({ column }) => <DataTableColumnHeader column={column} title="No of Bags" />,
            size: 100,
            minSize: 100,
        },
        {
            accessorKey: "packagingName",
            header: ({ column }) => <DataTableColumnHeader column={column} title="Packaging" />,
            size: 150,
            minSize: 150,
        },
        {
            accessorKey: "grossWeight",
            header: ({ column }) => <DataTableColumnHeader column={column} title="Gross Weight" />,
            size: 120,
            minSize: 120,
        },
        {
            accessorKey: "emptyWeight",
            header: ({ column }) => <DataTableColumnHeader column={column} title="Tare Weight" />,
            size: 120,
            minSize: 120,
        },
        {
            accessorKey: "status",
            header: ({ column }) => (
                <div className="flex items-center space-x-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="-ml-3 h-8 data-[state=open]:bg-accent">
                                <span className="capitalize">{statusFilter === "all" ? "Status" : statusFilter}</span>
                                <EllipsisVertical className="ml-2 size-3.5" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start">
                            <DropdownMenuItem onClick={() => onStatusFilterChange("all")}>
                                All
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onStatusFilterChange("active")}>
                                Active
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onStatusFilterChange("inactive")}>
                                Inactive
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            ),
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
            size: 130,
            minSize: 130,
        },
        {
            id: "actions",
            cell: ({ row }) => {
                const transport = row.original;

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
                            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(transport.uuid)}>
                                Copy UUID
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => onEdit(transport)}>
                                Edit Transport
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => onToggleStatus(transport)}
                                className={transport.status === "Active" ? "text-red-500 focus:text-red-500" : "text-green-500 focus:text-green-500"}
                            >
                                Mark as {transport.status === "Active" ? "Inactive" : "Active"}
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
            size: 60,
            minSize: 60,
        },
    ];

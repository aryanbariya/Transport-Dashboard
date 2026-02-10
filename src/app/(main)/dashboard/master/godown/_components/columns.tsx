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
import type { Godown } from "./schema";

export const godownColumns = (
    onEdit: (godown: Godown) => void,
    onToggleStatus: (godown: Godown) => void,
    statusFilter: string,
    onStatusFilterChange: (status: string) => void
): ColumnDef<Godown>[] => [
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
            accessorKey: "subgodown_id",
            header: ({ column }) => <DataTableColumnHeader column={column} title="ID" />,
            cell: ({ row }) => <div>{row.getValue("subgodown_id")}</div>,
        },
        {
            accessorKey: "subGodown",
            header: ({ column }) => <DataTableColumnHeader column={column} title="Sub Godown" />,
            cell: ({ row }) => <div className="font-medium">{row.getValue("subGodown")}</div>,
        },
        {
            accessorKey: "parentGodown",
            header: ({ column }) => <DataTableColumnHeader column={column} title="Parent Godown" />,
            cell: ({ row }) => <div>{row.getValue("parentGodown")}</div>,
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
        },
        {
            id: "actions",
            cell: ({ row }) => {
                const godown = row.original;

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
                            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(godown.uuid)}>
                                Copy UUID
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>View details</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onEdit(godown)}>Edit Godown</DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => onToggleStatus(godown)}
                                className={godown.status === "Active" ? "text-red-500 focus:text-red-500" : "text-green-500 focus:text-green-500"}
                            >
                                {godown.status === "Active" ? "Inactive" : "Active"}
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
        },
    ];

import type { ColumnDef } from "@tanstack/react-table";
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
import { CircleCheck, CircleX, EllipsisVertical } from "lucide-react";
import type { Employee } from "./schema";

export const getEmployeeColumns = (
    onEdit: (employee: Employee) => void,
    onToggleStatus: (employee: Employee) => void,
    statusFilter: string,
    onStatusFilterChange: (status: string) => void
): ColumnDef<Employee>[] => [
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
            accessorKey: "order_number",
            header: ({ column }) => <DataTableColumnHeader column={column} title="Sr. No" />,
            cell: ({ row }) => <div>{row.getValue("order_number")}</div>,
        },
        {
            accessorKey: "category",
            header: ({ column }) => <DataTableColumnHeader column={column} title="Category" />,
            cell: ({ row }) => {
                const employee = row.original;
                return (
                    <div className="flex flex-col text-sm">
                        <span className="font-bold">{employee.category}</span>
                        <span className="text-muted-foreground">Godown:<span className="font-semibold text-foreground">{employee.subGodown}</span></span>
                    </div>
                );
            },
        },
        {
            id: "employeeInfo",
            header: ({ column }) => <DataTableColumnHeader column={column} title="Employee" />,
            cell: ({ row }) => {
                const employee = row.original;
                return (
                    <div className="flex flex-col text-sm max-w-[300px]">
                        <span>Name:<span className="font-bold"> {employee.fullName}</span></span>
                        <span className="whitespace-normal">Address:<span className="font-semibold"> {employee.address}</span></span>
                        <span>Contact:<span className="font-semibold"> {employee.contact}</span></span>
                        <span>Pan No:<span className="font-semibold"> {employee.panNo}</span></span>
                    </div>
                );
            },
        },
        {
            id: "loginInfo",
            header: ({ column }) => <DataTableColumnHeader column={column} title="Login Info" />,
            cell: ({ row }) => {
                const employee = row.original;
                return (
                    <div className="flex flex-col text-sm">
                        <span>Username:<span className="font-bold"> {employee.username}</span></span>
                        <span>Password:</span>
                    </div>
                );
            },
        },
        {
            id: "bankInfo",
            header: ({ column }) => <DataTableColumnHeader column={column} title="Bank Info" />,
            cell: ({ row }) => {
                const employee = row.original;
                return (
                    <div className="flex flex-col text-sm">
                        <span>Bank:<span className="font-bold"> {employee.bankName}</span></span>
                        <span>A/C No:<span className="font-bold"> {employee.accountNumber}</span></span>
                        <span>IFSC:<span className="font-bold"> {employee.ifscCode}</span></span>
                        <span>Branch:<span className="font-bold"> {employee.branchName}</span></span>
                    </div>
                );
            },
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
                const employee = row.original;

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
                            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(employee.uuid)}>
                                Copy UUID
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>View details</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onEdit(employee)}>Edit employee</DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => onToggleStatus(employee)}
                                className={employee.status === "Active" ? "text-red-500 focus:text-red-500" : "text-green-500 focus:text-green-500"}
                            >
                                {employee.status === "Active" ? "Inactive" : "Active"}
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
        },
    ];

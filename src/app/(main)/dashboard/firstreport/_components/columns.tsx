import type { ColumnDef } from "@tanstack/react-table";
import { ChevronDown, ChevronRight, EllipsisVertical, Eye } from "lucide-react";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import type { FirstReport } from "./schema";
import { generateTransportPDF } from "@/lib/pdf-utils";

export const getFirstReportColumns = (
    expandedRows: Record<string, boolean>,
    toggleRow: (id: string) => void
): ColumnDef<FirstReport>[] => [
        {
            id: "expander",
            header: () => null,
            cell: ({ row }) => {
                return (
                    <Button
                        variant="ghost"
                        size="sm"
                        className="p-0 size-8"
                        onClick={(e) => {
                            e.stopPropagation();
                            const id = row.id;
                            console.log("Expander click for ID:", id);
                            toggleRow(id);
                        }}
                    >
                        {expandedRows[row.id] ? (
                            <ChevronDown className="size-4" />
                        ) : (
                            <ChevronRight className="size-4" />
                        )}
                    </Button>
                );
            },
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
            cell: ({ row }) => (
                <Button
                    variant="default"
                    size="sm"
                    onClick={() => generateTransportPDF(row.original)}
                >
                    View
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
            id: "allocation",
            header: "Allocation",
            cell: ({ row }) => (
                <Button
                    variant="link"
                    className="p-0 h-auto text-blue-500 underline"
                    onClick={(e) => {
                        e.stopPropagation();
                        const id = row.id;
                        console.log("Allocation click for ID:", id);
                        toggleRow(id);
                    }}
                >
                    {expandedRows[row.id] ? "Hide Allocation" : "See Allocation"}
                </Button>
            ),
            size: 120,
            minSize: 120,
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
            accessorKey: "do_id",
            header: ({ column }) => <DataTableColumnHeader column={column} title="D.O Number" />,
            size: 120,
            minSize: 120,
        },
        {
            accessorKey: "quota",
            header: ({ column }) => <DataTableColumnHeader column={column} title="Quota" />,
            cell: ({ row }) => {
                const date = row.getValue("quota") as string;
                return date ? format(new Date(date), "dd/MM/yyyy") : "-";
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
            accessorKey: "grossWeight",
            header: ({ column }) => <DataTableColumnHeader column={column} title="Gross Weight" />,
            size: 120,
            minSize: 120,
        },
        {
            accessorKey: "netWeight",
            header: ({ column }) => <DataTableColumnHeader column={column} title="Net Weight" />,
            size: 120,
            minSize: 120,
        },
        {
            accessorKey: "loadedNetWeight",
            header: ({ column }) => <DataTableColumnHeader column={column} title="Loaded Net Weight" />,
            size: 120,
            minSize: 120,
        },
        {
            id: "actions",
            header: "Actions",
            cell: () => "Start",
            size: 80,
            minSize: 80,
        },
    ];

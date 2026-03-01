"use client";

import * as React from "react";
import { flexRender, type Table as TanStackTable } from "@tanstack/react-table";
import { cn } from "@/lib/utils";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import type { TransformedFirstReport } from "./transformed-type";

interface DataTableFirstReportProps<TData> {
    table: TanStackTable<TData>;
    expandedRows: Record<string, boolean>;
}

function RowExpansionLogger({ row, isExpanded }: { row: any; isExpanded: boolean }) {
    React.useEffect(() => {
        if (isExpanded) {
            console.log("Expanding row:", row.id, row.original);
        }
    }, [row.id, row.original, isExpanded]);
    return null;
}

export function DataTableFirstReport<TData>({
    table,
    expandedRows,
}: DataTableFirstReportProps<TData>) {
    return (
        <div className="relative rounded-md border bg-background overflow-hidden">
            <div className="overflow-auto max-h-[700px] w-full max-w-full">
                <Table className="w-full border-separate border-spacing-0">
                    <TableHeader className="sticky top-0 z-10 bg-muted">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id} className="hover:bg-transparent">
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead
                                            key={header.id}
                                            colSpan={header.colSpan}
                                            className="h-10 border-b border-r px-4 text-left align-middle font-medium whitespace-nowrap"
                                        >
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <React.Fragment key={row.id}>
                                    <TableRow
                                        data-state={row.getIsSelected() && "selected"}
                                        className={cn(expandedRows[row.id] && "bg-muted/30")}
                                    >
                                        {row.getVisibleCells().map((cell) => {
                                            return (
                                                <TableCell
                                                    key={cell.id}
                                                    className="border-b border-r px-4 py-2 align-middle whitespace-nowrap"
                                                >
                                                    {flexRender(
                                                        cell.column.columnDef.cell,
                                                        cell.getContext()
                                                    )}
                                                </TableCell>
                                            );
                                        })}
                                    </TableRow>
                                    {expandedRows[row.id] && (
                                        <TableRow className="bg-muted/20 hover:bg-muted/20">
                                            <TableCell
                                                colSpan={row.getVisibleCells().length}
                                                className="p-4 border-b border-r"
                                            >
                                                <RowExpansionLogger row={row} isExpanded={expandedRows[row.id]} />
                                                <div className="text-sm">
                                                    <h4 className="font-semibold mb-2">Allocation Details:</h4>
                                                    {((row.original as TransformedFirstReport).godowns?.length > 0 && (row.original as TransformedFirstReport).godowns[0] !== "") ? (
                                                        <ul className="list-disc list-inside space-y-1 ml-2">
                                                            {(row.original as TransformedFirstReport).godowns.map((g, i) => (
                                                                <li key={i} className="text-sm">
                                                                    Godown: <span className="font-bold">{g}</span>,
                                                                    Vahtuk: <span className="font-bold">{(row.original as TransformedFirstReport).vahtuks[i]}</span>,
                                                                    Quantity: <span className="font-bold">{(row.original as TransformedFirstReport).quantities[i]}</span>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    ) : (
                                                        <p className="text-muted-foreground italic">No allocation details available for this record.</p>
                                                    )}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </React.Fragment>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={table.getAllColumns().length}
                                    className="h-24 text-center"
                                >
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}

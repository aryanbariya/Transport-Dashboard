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

interface DataTableAllocationProps<TData> {
    table: TanStackTable<TData>;
}

export function DataTableAllocation<TData>({
    table,
}: DataTableAllocationProps<TData>) {
    return (
        <div className="relative rounded-md border bg-background overflow-hidden">
            <div className="overflow-auto max-h-[600px] w-full max-w-full">
                <Table className="w-full border-separate border-spacing-0">
                    <TableHeader className="sticky top-0 z-5 bg-muted">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id} className="hover:bg-transparent">
                                {headerGroup.headers.map((header) => {
                                    const meta = header.column.columnDef.meta as {
                                        headerClassName?: string;
                                    } | undefined;

                                    return (
                                        <TableHead
                                            key={header.id}
                                            colSpan={header.colSpan}
                                            className={cn(
                                                "h-10 border-b border-r px-4 text-left align-middle font-medium whitespace-nowrap",
                                                meta?.headerClassName
                                            )}
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
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                >
                                    {row.getVisibleCells().map((cell) => {
                                        const meta = cell.column.columnDef.meta as {
                                            cellClassName?: string;
                                        } | undefined;

                                        return (
                                            <TableCell
                                                key={cell.id}
                                                className={cn(
                                                    "border-b border-r px-4 py-2 align-middle whitespace-nowrap",
                                                    meta?.cellClassName
                                                )}
                                            >
                                                {flexRender(
                                                    cell.column.columnDef.cell,
                                                    cell.getContext()
                                                )}
                                            </TableCell>
                                        );
                                    })}
                                </TableRow>
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

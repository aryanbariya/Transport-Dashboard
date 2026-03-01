"use client";

import * as React from "react";
import {
    getCoreRowModel,
    getExpandedRowModel,
    getPaginationRowModel,
    useReactTable,
} from "@tanstack/react-table";

import { DataTablePagination } from "@/components/data-table/data-table-pagination";
import { DataTableFirstReport } from "./data-table-first-report";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import { useFirstReport } from "@/hooks/use-first-report";
import { getFirstReportColumns } from "./columns";
import type { FirstReport } from "./schema";
import type { TransformedFirstReport } from "./transformed-type";

export function FirstReportTable() {
    const [pagination, setPagination] = React.useState({
        pageIndex: 0,
        pageSize: 10,
    });
    const [statusFilter, setStatusFilter] = React.useState("all");
    const [globalFilter, setGlobalFilter] = React.useState("");
    const [expandedRows, setExpandedRows] = React.useState<Record<string, boolean>>({});

    const toggleRow = React.useCallback((id: string) => {
        setExpandedRows(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    }, []);

    const { data: response, isLoading, isError } = useFirstReport({
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
        status: statusFilter,
    });

    const transformedData = React.useMemo(() => {
        const rawData = Array.isArray(response) ? response : response?.data;
        console.log("Raw Report Data:", rawData);
        if (!rawData) return [];

        return rawData.map((tp: FirstReport) => {
            const godowns = tp.godown?.split("|") || [];
            const vahtuks = tp.vahtuk?.split("|") || [];
            const quantities = tp.quantity?.split("|") || [];

            return {
                ...tp,
                godowns,
                vahtuks,
                quantities,
            };
        }) as TransformedFirstReport[];
    }, [response]);

    console.log("Transformed Data Sample:", transformedData[0]);

    const columns = React.useMemo(() => getFirstReportColumns(expandedRows, toggleRow), [expandedRows, toggleRow]);

    const table = useReactTable({
        data: transformedData,
        columns,
        state: {
            pagination,
            globalFilter,
        },
        onPaginationChange: setPagination,
        onGlobalFilterChange: setGlobalFilter,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getExpandedRowModel: getExpandedRowModel(),
        getRowCanExpand: () => true,
        manualPagination: !Array.isArray(response),
        rowCount: (Array.isArray(response) ? response.length : response?.pagination?.total) ?? 0,
        getRowId: (row, index) => {
            const id = row.uuid || row.trans_id?.toString() || `row-${index}`;
            return id;
        },
        debugTable: true,
    });

    if (isLoading) {
        return (
            <div className="space-y-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-[400px] w-full" />
                <Skeleton className="h-10 w-full" />
            </div>
        );
    }

    if (isError) {
        return (
            <div className="flex h-[400px] items-center justify-center rounded-md border border-dashed text-destructive">
                Failed to load report data. Please try again later.
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4 w-full">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex flex-1 items-center gap-2 w-full sm:max-w-sm">
                    <Input
                        placeholder="Search report..."
                        value={globalFilter}
                        onChange={(e) => setGlobalFilter(e.target.value)}
                        className="h-9 w-full"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <Select
                        value={statusFilter}
                        onValueChange={(value) => {
                            setStatusFilter(value);
                            setPagination((prev) => ({ ...prev, pageIndex: 0 }));
                        }}
                    >
                        <SelectTrigger className="h-9 w-[150px]">
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="inactive">Inactive</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <div className="w-full overflow-hidden">
                <DataTableFirstReport table={table} expandedRows={expandedRows} />
            </div>
            <DataTablePagination table={table} />
        </div>
    );
}

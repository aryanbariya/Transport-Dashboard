"use client";

import * as React from "react";
import {
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
    type SortingState,
    type VisibilityState,
} from "@tanstack/react-table";

import { Input } from "@/components/ui/input";
import { DataTable as DataTableCore } from "@/components/data-table/data-table";
import { DataTablePagination } from "@/components/data-table/data-table-pagination";
import { DataTableViewOptions } from "@/components/data-table/data-table-view-options";
import { Skeleton } from "@/components/ui/skeleton";

import { getDOGenerateColumns } from "./columns";
import type { DOGenerate } from "./schema";
import { useDOGenerate } from "../../../../../hooks/use-do-generate";
import { useMSWC } from "@/hooks/use-mswc";
import { useGrains } from "@/hooks/use-grains";
import { useSchemes } from "@/hooks/use-schemes";

export function DOGenerateTable() {
    const [editingDO, setEditingDO] = React.useState<DOGenerate | null>(null);

    // Internal state for the table to ensure maximum reactivity
    const [rowSelection, setRowSelection] = React.useState({});
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
    const [globalFilter, setGlobalFilter] = React.useState("");
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [pagination, setPagination] = React.useState({
        pageIndex: 0,
        pageSize: 10,
    });

    const handleEdit = React.useCallback((doGenerate: DOGenerate) => {
        setEditingDO(doGenerate);
        // Form handling can be added later
        console.log("Edit DO Generate:", doGenerate);
    }, []);

    // Fetch all MSWC data to build godown_id -> godownName & godownUnder lookup
    const { data: mswcResponse } = useMSWC({ page: 1, limit: 1000 });
    const mswcMap = React.useMemo(() => {
        const map: Record<string, { godownName: string; godownUnder: string }> = {};
        if (mswcResponse?.data) {
            for (const mswc of mswcResponse.data) {
                map[String(mswc.mswc_id)] = {
                    godownName: mswc.godownName,
                    godownUnder: mswc.godownUnder,
                };
            }
        }
        return map;
    }, [mswcResponse]);

    // Fetch all Grains data to build grain_id -> grainName lookup
    const { data: grainResponse } = useGrains({ page: 1, limit: 1000 });
    const grainMap = React.useMemo(() => {
        const map: Record<string, string> = {};
        if (grainResponse?.data) {
            for (const grain of grainResponse.data) {
                map[String(grain.grain_id)] = grain.grainName;
            }
        }
        return map;
    }, [grainResponse]);

    // Fetch all Schemes data to build scheme_id -> scheme_name lookup
    const { data: schemeResponse } = useSchemes({ page: 1, limit: 1000 });
    const schemeMap = React.useMemo(() => {
        const map: Record<string, string> = {};
        if (schemeResponse?.data) {
            for (const scheme of schemeResponse.data) {
                map[String(scheme.scheme_id)] = scheme.scheme_name;
            }
        }
        return map;
    }, [schemeResponse]);

    // Memoize columns to ensure reference stability
    const columns = React.useMemo(() => getDOGenerateColumns(handleEdit, mswcMap, grainMap, schemeMap), [handleEdit, mswcMap, grainMap, schemeMap]);

    const { data: response, isLoading, isError } = useDOGenerate({
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
    });

    const data = React.useMemo(() => response?.data ?? [], [response]);
    const totalCount = response?.pagination.total ?? 0;

    const table = useReactTable({
        data,
        columns,
        state: {
            sorting,
            columnVisibility,
            rowSelection,
            pagination,
            globalFilter,
        },
        enableRowSelection: true,
        getRowId: (row) => String(row.stock_id),
        onRowSelectionChange: setRowSelection,
        onSortingChange: setSorting,
        onColumnVisibilityChange: setColumnVisibility,
        onGlobalFilterChange: setGlobalFilter,
        onPaginationChange: setPagination,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        manualPagination: true,
        rowCount: totalCount,
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
                Failed to load DO Generate data. Please try again later.
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between gap-4">
                <div className="flex flex-1 items-center gap-2">
                    <Input
                        placeholder="Search DO records..."
                        value={globalFilter ?? ""}
                        onChange={(event) => setGlobalFilter(event.target.value)}
                        className="h-9 w-full max-w-sm"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <DataTableViewOptions table={table} />
                </div>
            </div>
            <div className="rounded-md border">
                <DataTableCore table={table} columns={columns} />
            </div>
            <DataTablePagination table={table} />
        </div>
    );
}

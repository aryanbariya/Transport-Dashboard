"use client";

import * as React from "react";
import {
    getCoreRowModel,
    getPaginationRowModel,
    useReactTable,
} from "@tanstack/react-table";

import { DataTablePagination } from "@/components/data-table/data-table-pagination";
import { DataTableAllocation } from "./data-table-allocation";
import { Skeleton } from "@/components/ui/skeleton";

import { useDOAllocation } from "@/hooks/use-do-allocation";
import { useGodowns } from "@/hooks/use-godowns";
import { useDOGenerate } from "@/hooks/use-do-generate";
import { useMSWC } from "@/hooks/use-mswc";
import { getDOAllocationColumns, type AllocationRow } from "./columns";
import type { DOAllocation } from "./schema";
import type { DOGenerate } from "@/app/(main)/dashboard/do-generate/_components/schema";
import type { Godown } from "@/app/(main)/dashboard/master/godown/_components/schema";

function formatDate(dateStr: string) {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });
}

export function DOAllocationTable() {
    const [pagination, setPagination] = React.useState({
        pageIndex: 0,
        pageSize: 10,
    });

    // Fetch allocations
    const { data: allocResponse, isLoading: isAllocLoading } = useDOAllocation({
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
    });

    // Fetch subgodowns for columns
    const { data: subGodownsResponse, isLoading: isSubGodownsLoading } = useGodowns({
        page: 1,
        limit: 1000
    });

    // Fetch DO Generate records for lookups
    const { data: doGenerateResponse, isLoading: isDOLoading } = useDOGenerate({
        page: 1,
        limit: 1000,
    });

    // Fetch MSWC data for godownUnder lookup
    const { data: mswcResponse } = useMSWC({ page: 1, limit: 1000 });

    const mswcMap = React.useMemo(() => {
        const map: Record<string, string> = {};
        if (mswcResponse?.data) {
            for (const item of mswcResponse.data) {
                map[String(item.mswc_id)] = item.godownUnder;
            }
        }
        return map;
    }, [mswcResponse]);

    const subGodowns = React.useMemo(() => {
        return (subGodownsResponse?.data || []).map((sg: Godown) => sg.subGodown);
    }, [subGodownsResponse]);

    const transformedData = React.useMemo(() => {
        if (!allocResponse?.data) return [];

        return allocResponse.data.map((entry: DOAllocation) => {
            const godownsArr = typeof entry.godown === 'string' ? (entry.godown as string).split("|") : (entry.godown as string[]);
            const vahtukArr = typeof entry.vahtuk === 'string' ? (entry.vahtuk as string).split("|") : (entry.vahtuk as string[]);
            const quantityArr = typeof entry.quantity === 'string' ? (entry.quantity as string).split("|") : (entry.quantity as string[]);

            // Find group under and quota date from DO records
            const doInfo = (doGenerateResponse?.data || []).find((d: DOGenerate) => String(d.do_no) === String(entry.do_id));
            const groupUnder = doInfo ? mswcMap[String(doInfo.godown_id)] : "Unknown";
            const quotaDate = doInfo ? formatDate(doInfo.cota) : "Unknown";
            const display_do_info = `${entry.do_id} - ${groupUnder} - ${quotaDate}`;

            return {
                ...entry,
                godown: godownsArr,
                vahtuk: vahtukArr,
                quantity: quantityArr,
                display_do_info
            };
        }) as AllocationRow[];
    }, [allocResponse, doGenerateResponse, mswcMap]);

    const columns = React.useMemo(
        () => getDOAllocationColumns(subGodowns, pagination.pageIndex, pagination.pageSize),
        [subGodowns, pagination.pageIndex, pagination.pageSize]
    );

    const table = useReactTable({
        data: transformedData,
        columns,
        state: {
            pagination,
        },
        onPaginationChange: setPagination,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        manualPagination: true,
        rowCount: allocResponse?.pagination.total ?? 0,
    });

    if (isAllocLoading || isSubGodownsLoading || isDOLoading) {
        return (
            <div className="space-y-4 min-w-0">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-[400px] w-full" />
                <Skeleton className="h-10 w-full" />
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4 min-w-0 w-full">
            <div className="flex items-center justify-between gap-4 min-w-0">
                <div className="flex flex-1 items-center gap-2 min-w-0">
                    <div className="h-9 w-full max-w-sm rounded-md border bg-muted/50 px-3 py-1 text-sm text-muted-foreground flex items-center overflow-hidden">
                        Search allocations...
                    </div>
                </div>
            </div>
            <div className="min-w-0 w-full overflow-hidden">
                <DataTableAllocation table={table} />
            </div>
            <DataTablePagination table={table} />
        </div>
    );
}

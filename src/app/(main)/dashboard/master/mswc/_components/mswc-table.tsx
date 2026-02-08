"use client";

import * as React from "react";
import { Plus } from "lucide-react";
import {
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
    type SortingState,
    type VisibilityState,
} from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTable as DataTableCore } from "@/components/data-table/data-table";
import { DataTablePagination } from "@/components/data-table/data-table-pagination";
import { DataTableViewOptions } from "@/components/data-table/data-table-view-options";
import { Skeleton } from "@/components/ui/skeleton";

import { getMSWCColumns } from "./columns";
import { useMSWC } from "@/hooks/use-mswc";
import { MSWCForm } from "./mswc-form";
import type { MSWC } from "./schema";
import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

export function MSWCTable() {
    const queryClient = useQueryClient();
    const [editingMSWC, setEditingMSWC] = React.useState<MSWC | null>(null);
    const [open, setOpen] = React.useState(false);

    const [rowSelection, setRowSelection] = React.useState({});
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
    const [globalFilter, setGlobalFilter] = React.useState("");
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [pagination, setPagination] = React.useState({
        pageIndex: 0,
        pageSize: 10,
    });

    const [statusFilter, setStatusFilter] = React.useState("all");

    const handleEdit = React.useCallback((mswc: MSWC) => {
        setEditingMSWC(mswc);
        setOpen(true);
    }, []);

    const handleToggleStatus = React.useCallback(async (mswc: MSWC) => {
        try {
            await axios.put(`/api/mswc/${mswc.uuid}`, { ...mswc, status: mswc.status === "Active" ? "Inactive" : "Active" });
            toast.success(`MSWC status updated to ${mswc.status === "Active" ? "Inactive" : "Active"}`);
            queryClient.invalidateQueries({ queryKey: ["mswc"] });
        } catch (error) {
            console.error("Failed to toggle MSWC status:", error);
            toast.error("Failed to update MSWC status");
        }
    }, [queryClient]);

    const handleAdd = React.useCallback(() => {
        setEditingMSWC(null);
        setOpen(true);
    }, []);

    const handleStatusFilterChange = React.useCallback((status: string) => {
        setStatusFilter(status);
        setPagination((prev) => ({ ...prev, pageIndex: 0 }));
    }, []);

    const columns = React.useMemo(() => getMSWCColumns(handleEdit, handleToggleStatus, statusFilter, handleStatusFilterChange), [handleEdit, handleToggleStatus, statusFilter, handleStatusFilterChange]);

    const { data: response, isLoading, isError } = useMSWC({
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
        status: statusFilter,
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
        getRowId: (row) => row.uuid,
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
                Failed to load MSWC data. Please try again later.
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between gap-4">
                <div className="flex flex-1 items-center gap-2">
                    <Input
                        placeholder="Search godowns..."
                        value={globalFilter ?? ""}
                        onChange={(event) => setGlobalFilter(event.target.value)}
                        className="h-9 w-full max-w-sm"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <DataTableViewOptions table={table} />
                    <Dialog open={open} onOpenChange={setOpen}>
                        <DialogTrigger asChild>
                            <Button size="sm" onClick={handleAdd}>
                                <Plus className="mr-2 size-4" />
                                Add MSWC
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-2xl">
                            <DialogHeader>
                                <DialogTitle>{editingMSWC ? "Edit MSWC" : "Add New MSWC"}</DialogTitle>
                            </DialogHeader>
                            <MSWCForm
                                onSuccess={() => setOpen(false)}
                                onCancel={() => setOpen(false)}
                                initialData={editingMSWC ?? undefined}
                            />
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
            <div className="rounded-md border">
                <DataTableCore table={table} columns={columns} />
            </div>
            <DataTablePagination table={table} />
        </div>
    );
}

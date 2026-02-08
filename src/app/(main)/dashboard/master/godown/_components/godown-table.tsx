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

import { godownColumns } from "./columns";
import { useGodowns } from "@/hooks/use-godowns";
import { GodownForm } from "./godown-form";
import type { Godown } from "./schema";
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

export function GodownTable() {
    const queryClient = useQueryClient();
    const [editingGodown, setEditingGodown] = React.useState<Godown | null>(null);
    const [open, setOpen] = React.useState(false);
    const [statusFilter, setStatusFilter] = React.useState("all");

    const [rowSelection, setRowSelection] = React.useState({});
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
    const [globalFilter, setGlobalFilter] = React.useState("");
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [pagination, setPagination] = React.useState({
        pageIndex: 0,
        pageSize: 10,
    });

    const handleEdit = React.useCallback((godown: Godown) => {
        setEditingGodown(godown);
        setOpen(true);
    }, []);

    const handleToggleStatus = React.useCallback(async (godown: Godown) => {
        try {
            await axios.put(`/api/subgodowns/${godown.uuid}`, { ...godown, status: godown.status === "Active" ? "Inactive" : "Active" });
            toast.success(`Godown status updated to ${godown.status === "Active" ? "Inactive" : "Active"}`);
            queryClient.invalidateQueries({ queryKey: ["godowns"] });
        } catch (error) {
            console.error("Failed to toggle godown status:", error);
            toast.error("Failed to update godown status");
        }
    }, [queryClient]);

    const handleAdd = React.useCallback(() => {
        setEditingGodown(null);
        setOpen(true);
    }, []);

    const handleStatusFilterChange = React.useCallback((status: string) => {
        setStatusFilter(status);
        setPagination((prev) => ({ ...prev, pageIndex: 0 }));
    }, []);

    const columns = React.useMemo(() => godownColumns(handleEdit, handleToggleStatus, statusFilter, handleStatusFilterChange), [handleEdit, handleToggleStatus, statusFilter, handleStatusFilterChange]);

    const { data: response, isLoading, isError } = useGodowns({
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
                Failed to load godown data. Please try again later.
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
                        className="h-9 w-full max-sm:max-w-xs"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <DataTableViewOptions table={table} />
                    <Dialog open={open} onOpenChange={setOpen}>
                        <DialogTrigger asChild>
                            <Button size="sm" onClick={handleAdd}>
                                <Plus className="mr-2 size-4" />
                                Add Godown
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-2xl">
                            <DialogHeader>
                                <DialogTitle>{editingGodown ? "Edit Godown" : "Add New Godown"}</DialogTitle>
                            </DialogHeader>
                            <GodownForm
                                onSuccess={() => setOpen(false)}
                                onCancel={() => setOpen(false)}
                                initialData={editingGodown ?? undefined}
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

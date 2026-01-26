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

import { getOwnerColumns } from "./columns";
import type { Owner } from "./schema";
import { useOwners } from "@/hooks/use-owners";
import { Skeleton } from "@/components/ui/skeleton";
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
import { OwnerForm } from "./owner-form";

export function OwnerTable() {
    const queryClient = useQueryClient();
    const [editingOwner, setEditingOwner] = React.useState<Owner | null>(null);
    const [open, setOpen] = React.useState(false);
    const [statusFilter, setStatusFilter] = React.useState("all");

    // Internal state for the table to ensure maximum reactivity
    const [rowSelection, setRowSelection] = React.useState({});
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
    const [globalFilter, setGlobalFilter] = React.useState("");
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [pagination, setPagination] = React.useState({
        pageIndex: 0,
        pageSize: 10,
    });

    const handleEdit = React.useCallback((owner: Owner) => {
        setEditingOwner(owner);
        setOpen(true);
    }, []);

    const handleToggleStatus = React.useCallback(async (owner: Owner) => {
        try {
            await axios.patch(`/api/owners/${owner.uuid}/status`);
            toast.success(`Owner status updated to ${owner.status === "Active" ? "Inactive" : "Active"}`);
            queryClient.invalidateQueries({ queryKey: ["owners"] });
        } catch (error) {
            console.error("Failed to toggle owner status:", error);
            toast.error("Failed to update owner status");
        }
    }, [queryClient]);

    const handleAdd = React.useCallback(() => {
        setEditingOwner(null);
        setOpen(true);
    }, []);

    const handleStatusFilterChange = React.useCallback((status: string) => {
        setStatusFilter(status);
        setPagination((prev) => ({ ...prev, pageIndex: 0 })); // Reset to first page on filter change
    }, []);

    // Memoize columns to ensure reference stability
    const columns = React.useMemo(() => getOwnerColumns(handleEdit, handleToggleStatus, statusFilter, handleStatusFilterChange), [handleEdit, handleToggleStatus, statusFilter, handleStatusFilterChange]);

    const { data: response, isLoading, isError } = useOwners({
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
                Failed to load owners. Please try again later.
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between gap-4">
                <div className="flex flex-1 items-center gap-2">
                    <Input
                        placeholder="Search owners..."
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
                                Add Owner
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                                <DialogTitle>{editingOwner ? "Edit Owner" : "Add New Owner"}</DialogTitle>
                            </DialogHeader>
                            <OwnerForm
                                onSuccess={() => setOpen(false)}
                                onCancel={() => setOpen(false)}
                                initialData={editingOwner ?? undefined}
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

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

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

import { getTransportColumns } from "./columns";
import type { Transport } from "./schema";
import { useTransports } from "@/hooks/use-transports";
import { Skeleton } from "@/components/ui/skeleton";
import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import { TransportForm } from "./transport-form";

export function TransportTable() {
    const queryClient = useQueryClient();
    const [editingTransport, setEditingTransport] = React.useState<Transport | null>(null);
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

    const handleEdit = React.useCallback((transport: Transport) => {
        setEditingTransport(transport);
        setOpen(true);
    }, []);

    const handleToggleStatus = React.useCallback(async (transport: Transport) => {
        try {
            await axios.patch(`/api/transports/${transport.uuid}/status`);
            toast.success(`Transport status updated to ${transport.status === "Active" ? "Inactive" : "Active"}`);
            queryClient.invalidateQueries({ queryKey: ["transports"] });
        } catch (error) {
            console.error("Failed to toggle transport status:", error);
            toast.error("Failed to update transport status");
        }
    }, [queryClient]);

    const handleAdd = React.useCallback(() => {
        setEditingTransport(null);
        setOpen(true);
    }, []);

    const handleStatusFilterChange = React.useCallback((status: string) => {
        setStatusFilter(status);
        setPagination((prev) => ({ ...prev, pageIndex: 0 })); // Reset to first page on filter change
    }, []);

    // Memoize columns to ensure reference stability
    const columns = React.useMemo(() => getTransportColumns(handleEdit, handleToggleStatus, statusFilter, handleStatusFilterChange), [handleEdit, handleToggleStatus, statusFilter, handleStatusFilterChange]);

    const { data: response, isLoading, isError } = useTransports({
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
                Failed to load transport data. Please try again later.
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between gap-4">
                <div className="flex flex-1 items-center gap-2">
                    <Input
                        placeholder="Search transports..."
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
                                Add TP
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[1400px] w-[95vw] max-h-[95vh] overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle>{editingTransport ? "Edit Transport" : "Add New Transport"}</DialogTitle>
                            </DialogHeader>
                            <TransportForm
                                onSuccess={() => setOpen(false)}
                                onCancel={() => setOpen(false)}
                                initialData={editingTransport ?? undefined}
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

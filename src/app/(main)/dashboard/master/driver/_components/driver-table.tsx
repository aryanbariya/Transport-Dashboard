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

import { getDriverColumns } from "./columns";
import type { Driver } from "./schema";
import { useDrivers } from "@/hooks/use-drivers";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { DriverForm } from "./driver-form";

import axios from "axios";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

export function DriverTable() {
    const queryClient = useQueryClient();
    const [open, setOpen] = React.useState(false);
    const [editingDriver, setEditingDriver] = React.useState<Driver | null>(null);
    const [statusFilter, setStatusFilter] = React.useState("all");

    const handleEdit = React.useCallback((driver: Driver) => {
        setEditingDriver(driver);
        setOpen(true);
    }, []);

    const handleToggleStatus = React.useCallback(async (driver: Driver) => {
        try {
            await axios.patch(`/api/drivers/${driver.uuid}/status`);
            toast.success(`Driver status updated to ${driver.status === "Active" ? "Inactive" : "Active"}`);
            queryClient.invalidateQueries({ queryKey: ["drivers"] });
        } catch (error) {
            console.error("Failed to toggle driver status:", error);
            toast.error("Failed to update driver status");
        }
    }, [queryClient]);

    const handleAdd = React.useCallback(() => {
        setEditingDriver(null);
        setOpen(true);
    }, []);

    const handleStatusFilterChange = React.useCallback((status: string) => {
        setStatusFilter(status);
        setPagination((prev) => ({ ...prev, pageIndex: 0 }));
    }, []);

    const columns = React.useMemo(() => getDriverColumns(handleEdit, handleToggleStatus, statusFilter, handleStatusFilterChange), [handleEdit, handleToggleStatus, statusFilter, handleStatusFilterChange]);

    const [rowSelection, setRowSelection] = React.useState({});
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
    const [globalFilter, setGlobalFilter] = React.useState("");
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [pagination, setPagination] = React.useState({
        pageIndex: 0,
        pageSize: 10,
    });

    const { data: response, isLoading, isError } = useDrivers({
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
                Failed to load driver data. Please try again later.
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between gap-4">
                <div className="flex flex-1 items-center gap-2">
                    <Input
                        placeholder="Search drivers..."
                        value={globalFilter ?? ""}
                        onChange={(event) => setGlobalFilter(event.target.value)}
                        className="h-9 w-full max-w-sm"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <DataTableViewOptions table={table} />
                    <Button size="sm" onClick={handleAdd}>
                        <Plus className="mr-2 size-4" />
                        Add Driver
                    </Button>
                    <Dialog open={open} onOpenChange={setOpen}>
                        <DialogContent className="sm:max-w-xl">
                            <DialogHeader>
                                <DialogTitle>{editingDriver ? "Edit Driver" : "Add New Driver"}</DialogTitle>
                            </DialogHeader>
                            <DriverForm
                                onSuccess={() => setOpen(false)}
                                onCancel={() => setOpen(false)}
                                initialData={editingDriver ?? undefined}
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

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

import { truckColumns } from "./columns";
import { useTrucks } from "@/hooks/use-trucks";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { TruckForm } from "./truck-form";
import { type Truck } from "./schema";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

export function TruckTable() {
    const [rowSelection, setRowSelection] = React.useState({});
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
    const [globalFilter, setGlobalFilter] = React.useState("");
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [pagination, setPagination] = React.useState({
        pageIndex: 0,
        pageSize: 10,
    });
    const [status, setStatus] = React.useState<string>("all");

    const [open, setOpen] = React.useState(false);
    const [editingTruck, setEditingTruck] = React.useState<Truck | null>(null);

    const handleEdit = React.useCallback((truck: Truck) => {
        setEditingTruck(truck);
        setOpen(true);
    }, []);

    const columns = React.useMemo(() => truckColumns(handleEdit), [handleEdit]);

    const { data: response, isLoading, isError } = useTrucks({
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
        status: status,
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
                Failed to load truck data. Please try again later.
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between gap-4">
                <div className="flex flex-1 items-center gap-2">
                    <Input
                        placeholder="Search trucks..."
                        value={globalFilter ?? ""}
                        onChange={(event) => setGlobalFilter(event.target.value)}
                        className="h-9 w-full max-w-sm"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <Select value={status} onValueChange={(value) => {
                        setStatus(value);
                        setPagination(prev => ({ ...prev, pageIndex: 0 }));
                    }}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Filter by Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="Active">Active</SelectItem>
                            <SelectItem value="Inactive">Inactive</SelectItem>
                        </SelectContent>
                    </Select>
                    <DataTableViewOptions table={table} />
                    <Dialog open={open} onOpenChange={setOpen}>
                        <DialogTrigger asChild>
                            <Button size="sm" onClick={() => setEditingTruck(null)}>
                                <Plus className="mr-2 size-4" />
                                Add Truck
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle>{editingTruck ? "Edit Truck" : "Add New Truck"}</DialogTitle>
                                <DialogDescription>
                                    {editingTruck
                                        ? "Update the truck details below."
                                        : "Fill in the details to add a new truck."}
                                </DialogDescription>
                            </DialogHeader>
                            <TruckForm
                                onSuccess={() => setOpen(false)}
                                onCancel={() => setOpen(false)}
                                initialData={editingTruck || undefined}
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

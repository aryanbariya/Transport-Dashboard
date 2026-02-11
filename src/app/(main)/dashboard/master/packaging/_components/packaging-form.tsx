"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { createPackagingSchema, type Packaging } from "./schema";

interface PackagingFormProps {
    onSuccess: () => void;
    onCancel: () => void;
    initialData?: Packaging;
}

export function PackagingForm({ onSuccess, onCancel, initialData }: PackagingFormProps) {
    const queryClient = useQueryClient();
    const form = useForm<Packaging>({
        resolver: zodResolver(createPackagingSchema),
        defaultValues: {
            material_name: initialData?.material_name || "",
            weight: initialData?.weight || 0,
            status: initialData?.status || "Active",
        },
    });

    const isEditing = !!initialData;

    const onSubmit = async (values: Packaging) => {
        try {
            if (isEditing) {
                await axios.put("/api/packaging", {
                    ...values,
                    uuid: initialData.uuid,
                });
                toast.success("Packaging updated successfully");
            } else {
                await axios.post("/api/packaging", values);
                toast.success("Packaging created successfully");
            }
            queryClient.invalidateQueries({ queryKey: ["packaging"] });
            onSuccess();
        } catch (error) {
            console.error("Failed to save packaging:", error);
            toast.error(isEditing ? "Failed to update packaging" : "Failed to create packaging");
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="material_name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Packaging Material</FormLabel>
                            <FormControl>
                                <Input placeholder="Enter material name" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="weight"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Weight</FormLabel>
                            <FormControl>
                                <Input
                                    type="number"
                                    placeholder="Enter weight"
                                    {...field}
                                    onChange={(e) => field.onChange(parseFloat(e.target.value))}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Status</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="Active">Active</SelectItem>
                                    <SelectItem value="Inactive">Inactive</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={onCancel}>
                        Cancel
                    </Button>
                    <Button type="submit">
                        {isEditing ? "Update" : "Create"}
                    </Button>
                </div>
            </form>
        </Form>
    );
}

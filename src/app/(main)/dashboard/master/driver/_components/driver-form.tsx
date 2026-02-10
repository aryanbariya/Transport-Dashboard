"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";

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

import { createDriverSchema, type CreateDriverInput, type Driver } from "./schema";

interface DriverFormProps {
    onSuccess?: () => void;
    onCancel?: () => void;
    initialData?: Driver;
}

export function DriverForm({ onSuccess, onCancel, initialData }: DriverFormProps) {
    const queryClient = useQueryClient();
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const isEdit = !!initialData;

    const form = useForm<CreateDriverInput>({
        resolver: zodResolver(createDriverSchema),
        defaultValues: {
            driver_name: initialData?.driver_name || "",
            contact: initialData?.contact || "",
            aadhar_card_no: initialData?.aadhar_card_no || "",
            driving_license_no: initialData?.driving_license_no || "",
            status: (initialData?.status as "Active" | "Inactive") || "Active",
        },
    });

    const onSubmit = async (data: CreateDriverInput) => {
        setIsSubmitting(true);
        try {
            if (isEdit && initialData?.uuid) {
                await axios.put(`/api/drivers`, { ...data, uuid: initialData.uuid });
                toast.success("Driver updated successfully!");
            } else {
                await axios.post("/api/drivers", data);
                toast.success("Driver added successfully!");
            }
            queryClient.invalidateQueries({ queryKey: ["drivers"] });
            form.reset();
            onSuccess?.();
        } catch (error) {
            console.error(isEdit ? "Error updating driver:" : "Error creating driver:", error);
            toast.error(isEdit ? "Failed to update driver." : "Failed to add driver.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>, onChange: (val: string) => void) => {
        const value = e.target.value;
        const formattedValue = value
            .toLowerCase()
            .split(" ")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");
        onChange(formattedValue);
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
                <FormField
                    control={form.control}
                    name="driver_name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Driver Name <span className="text-destructive">*</span></FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Enter driver name"
                                    {...field}
                                    onChange={(e) => handleNameChange(e, field.onChange)}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <FormField
                        control={form.control}
                        name="contact"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Contact Number</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter contact number" {...field} value={field.value || ""} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="aadhar_card_no"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Aadhar Number</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter Aadhar number" {...field} value={field.value || ""} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <FormField
                        control={form.control}
                        name="driving_license_no"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>License Number</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter license number" {...field} value={field.value || ""} />
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
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                </div>

                <div className="flex justify-end gap-3 pt-4">
                    <Button type="button" variant="outline" onClick={onCancel} className="w-full sm:w-auto">
                        Cancel
                    </Button>
                    <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
                        {isSubmitting ? "Submitting..." : isEdit ? "Update Driver" : "Add Driver"}
                    </Button>
                </div>
            </form>
        </Form>
    );
}

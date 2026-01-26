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
import { Textarea } from "@/components/ui/textarea";
import { createOwnerSchema, type CreateOwnerInput, type Owner } from "./schema";

interface OwnerFormProps {
    onSuccess?: () => void;
    onCancel?: () => void;
    initialData?: Owner;
}

export function OwnerForm({ onSuccess, onCancel, initialData }: OwnerFormProps) {
    const queryClient = useQueryClient();
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const isEdit = !!initialData;

    const form = useForm<CreateOwnerInput>({
        resolver: zodResolver(createOwnerSchema),
        defaultValues: {
            ownerName: initialData?.ownerName || "",
            emailID: initialData?.emailID || "",
            contact: initialData?.contact || "",
            address: initialData?.address || "",
            status: initialData?.status || "Active",
        },
    });

    const onSubmit = async (data: CreateOwnerInput) => {
        setIsSubmitting(true);
        try {
            if (isEdit && initialData) {
                await axios.put(`/api/owners/${initialData.uuid}`, data);
                toast.success("Owner updated successfully!");
            } else {
                await axios.post("/api/owners", data);
                toast.success("Owner added successfully!");
            }
            queryClient.invalidateQueries({ queryKey: ["owners"] });
            form.reset();
            onSuccess?.();
        } catch (error) {
            console.error(isEdit ? "Error updating owner:" : "Error creating owner:", error);
            toast.error(isEdit ? "Failed to update owner." : "Failed to add owner.");
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

    const handleContactChange = (e: React.ChangeEvent<HTMLInputElement>, onChange: (val: string) => void) => {
        const value = e.target.value.replace(/\D/g, "").slice(0, 10);
        onChange(value);
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
                <FormField
                    control={form.control}
                    name="ownerName"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Owner Name <span className="text-destructive">*</span></FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Enter owner name"
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
                                <FormLabel>Contact Number <span className="text-destructive">*</span></FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="10-digit mobile"
                                        {...field}
                                        onChange={(e) => handleContactChange(e, field.onChange)}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="emailID"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email Address</FormLabel>
                                <FormControl>
                                    <Input type="email" placeholder="example@mail.com" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Address</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Enter physical address"
                                    className="resize-none"
                                    {...field}
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

                <div className="flex justify-end gap-3 pt-4">
                    <Button type="button" variant="outline" onClick={onCancel} className="w-full sm:w-auto">
                        Cancel
                    </Button>
                    <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
                        {isSubmitting ? "Submitting..." : isEdit ? "Update Owner" : "Add Owner"}
                    </Button>
                </div>
            </form>
        </Form>
    );
}

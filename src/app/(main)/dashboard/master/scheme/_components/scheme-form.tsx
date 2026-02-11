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

import { createSchemeSchema, type CreateSchemeInput, type Scheme } from "./schema";

interface SchemeFormProps {
    onSuccess?: () => void;
    onCancel?: () => void;
    initialData?: Scheme;
}

export function SchemeForm({ onSuccess, onCancel, initialData }: SchemeFormProps) {
    const queryClient = useQueryClient();
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const isEdit = !!initialData;

    const form = useForm<CreateSchemeInput>({
        resolver: zodResolver(createSchemeSchema),
        defaultValues: {
            scheme_name: initialData?.scheme_name || "",
            scheme_status: (initialData?.scheme_status as "Start" | "Pending" | "Completed") || "Start",
        },
    });

    const onSubmit = async (data: CreateSchemeInput) => {
        setIsSubmitting(true);
        try {
            if (isEdit && initialData?.uuid) {
                await axios.put(`/api/schemes`, { ...data, uuid: initialData.uuid });
                toast.success("Scheme updated successfully!");
            } else {
                await axios.post("/api/schemes", data);
                toast.success("Scheme added successfully!");
            }
            queryClient.invalidateQueries({ queryKey: ["schemes"] });
            form.reset();
            onSuccess?.();
        } catch (error) {
            console.error(isEdit ? "Error updating scheme:" : "Error creating scheme:", error);
            toast.error(isEdit ? "Failed to update scheme." : "Failed to add scheme.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>, onChange: (val: string) => void) => {
        const value = e.target.value;
        // Capitalize first letter of each word
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
                    name="scheme_name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Scheme Name <span className="text-destructive">*</span></FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Enter scheme name"
                                    {...field}
                                    onChange={(e) => handleNameChange(e, field.onChange)}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="scheme_status"
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
                                    <SelectItem value="Start">Start</SelectItem>
                                    <SelectItem value="Pending">Pending</SelectItem>
                                    <SelectItem value="Completed">Completed</SelectItem>
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
                        {isSubmitting ? "Submitting..." : isEdit ? "Update Scheme" : "Add Scheme"}
                    </Button>
                </div>
            </form>
        </Form>
    );
}

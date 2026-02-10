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
import { createMSWCSchema, updateMSWCSchema, type CreateMSWCInput, type MSWC } from "./schema";

interface MSWCFormProps {
    onSuccess?: () => void;
    onCancel?: () => void;
    initialData?: MSWC;
}

export function MSWCForm({ onSuccess, onCancel, initialData }: MSWCFormProps) {
    const queryClient = useQueryClient();
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const isEdit = !!initialData;

    const form = useForm<CreateMSWCInput>({
        resolver: zodResolver(isEdit ? updateMSWCSchema : createMSWCSchema),
        defaultValues: {
            godownName: initialData?.godownName || "",
            godownUnder: initialData?.godownUnder || "",
            status: initialData?.status || "Active",
        },
    });

    const onSubmit = async (data: CreateMSWCInput) => {
        setIsSubmitting(true);
        try {
            if (isEdit && initialData) {
                await axios.put(`/api/mswc/${initialData.uuid}`, data);
                toast.success("MSWC updated successfully!");
            } else {
                await axios.post("/api/mswc", data);
                toast.success("MSWC added successfully!");
            }
            queryClient.invalidateQueries({ queryKey: ["mswc"] });
            form.reset();
            onSuccess?.();
        } catch (error) {
            console.error(isEdit ? "Error updating MSWC:" : "Error creating MSWC:", error);
            toast.error(isEdit ? "Failed to update MSWC." : "Failed to add MSWC.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <FormField
                        control={form.control}
                        name="godownName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>MSWC Godown Name <span className="text-destructive">*</span></FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter MSWC Godown Name" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="godownUnder"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Godown Under <span className="text-destructive">*</span></FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter Godown Under" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="mt-8 flex justify-end gap-3 border-t pt-4">
                    <Button type="button" variant="outline" onClick={onCancel} className="w-full sm:w-auto">
                        Cancel
                    </Button>
                    <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
                        {isSubmitting ? "Submitting..." : isEdit ? "Update MSWC" : "Add MSWC"}
                    </Button>
                </div>
            </form>
        </Form>
    );
}

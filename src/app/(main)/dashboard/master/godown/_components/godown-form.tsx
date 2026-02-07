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
import { useMSWC } from "@/hooks/use-mswc";
import { createGodownSchema, type CreateGodownInput, type Godown } from "./schema";

interface GodownFormProps {
    onSuccess?: () => void;
    onCancel?: () => void;
    initialData?: Godown;
}

export function GodownForm({ onSuccess, onCancel, initialData }: GodownFormProps) {
    const queryClient = useQueryClient();
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const isEdit = !!initialData;

    // Fetch MSWCs for the dropdown
    const { data: mswcResponse } = useMSWC({ page: 1, limit: 1000 });
    const mswcs = mswcResponse?.data ?? [];

    const form = useForm<CreateGodownInput>({
        resolver: zodResolver(createGodownSchema),
        defaultValues: {
            parentGodown: initialData?.parentGodown || "",
            subGodown: initialData?.subGodown || "",
        },
    });

    const onSubmit = async (data: CreateGodownInput) => {
        setIsSubmitting(true);
        try {
            if (isEdit && initialData) {
                await axios.put(`/api/subgodowns/${initialData.uuid}`, data);
                toast.success("Godown updated successfully!");
            } else {
                await axios.post("/api/godowns", data);
                toast.success("Godown added successfully!");
            }
            queryClient.invalidateQueries({ queryKey: ["godowns"] });
            form.reset();
            onSuccess?.();
        } catch (error) {
            console.error(isEdit ? "Error updating godown:" : "Error creating godown:", error);
            toast.error(isEdit ? "Failed to update godown." : "Failed to add godown.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
                <FormField
                    control={form.control}
                    name="parentGodown"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>MSWC (Parent Godown) <span className="text-destructive">*</span></FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select MSWC Godown" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {mswcs.map((mswc) => (
                                        <SelectItem key={mswc.uuid} value={mswc.godownName}>
                                            {mswc.godownName}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="subGodown"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Sub Godown Name <span className="text-destructive">*</span></FormLabel>
                            <FormControl>
                                <Input placeholder="Enter sub godown name" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="flex justify-end gap-3 pt-4">
                    <Button type="button" variant="outline" onClick={onCancel} className="w-full sm:w-auto">
                        Cancel
                    </Button>
                    <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
                        {isSubmitting ? "Submitting..." : isEdit ? "Update Godown" : "Add Godown"}
                    </Button>
                </div>
            </form>
        </Form>
    );
}

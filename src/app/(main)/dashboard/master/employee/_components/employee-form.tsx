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
import { createEmployeeSchema, updateEmployeeSchema, type CreateEmployeeInput, type Employee } from "./schema";
import { useCategories } from "@/hooks/use-categories";
import { useGodowns } from "@/hooks/use-godowns";

interface EmployeeFormProps {
    onSuccess?: () => void;
    onCancel?: () => void;
    initialData?: Employee;
}

export function EmployeeForm({ onSuccess, onCancel, initialData }: EmployeeFormProps) {
    const queryClient = useQueryClient();
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const isEdit = !!initialData;

    const { data: categoriesResponse } = useCategories({ page: 1, limit: 100 });
    const { data: godownsResponse } = useGodowns({ page: 1, limit: 100 });

    const categories = categoriesResponse?.data || [];
    const godowns = godownsResponse?.data || [];

    const form = useForm<CreateEmployeeInput>({
        resolver: zodResolver(isEdit ? updateEmployeeSchema : createEmployeeSchema),
        defaultValues: {
            fullName: initialData?.fullName || "",
            username: initialData?.username || "",
            password: "",
            contact: initialData?.contact || "",
            address: initialData?.address || "",
            category: initialData?.category || "",
            subGodown: initialData?.subGodown || "",
            aadharNo: initialData?.aadharNo || "",
            panNo: initialData?.panNo || "",
            bankName: initialData?.bankName || "",
            accountNumber: initialData?.accountNumber || "",
            ifscCode: initialData?.ifscCode || "",
            branchName: initialData?.branchName || "",
            status: initialData?.status || "Active",
        },
    });



    const onSubmit = async (data: CreateEmployeeInput) => {
        setIsSubmitting(true);
        try {
            if (isEdit && initialData) {
                await axios.put(`/api/employees/${initialData.uuid}`, data);
                toast.success("Employee updated successfully!");
            } else {
                await axios.post("/api/employees", data);
                toast.success("Employee added successfully!");
            }
            queryClient.invalidateQueries({ queryKey: ["employees"] });
            form.reset();
            onSuccess?.();
        } catch (error) {
            console.error(isEdit ? "Error updating employee:" : "Error creating employee:", error);
            toast.error(isEdit ? "Failed to update employee." : "Failed to add employee.");
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
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-4">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                    {/* Column 1: Basic Information */}
                    <div className="space-y-4">
                        <div className="border-b pb-2">
                            <h3 className="font-semibold text-foreground">Basic Information</h3>
                        </div>
                        <FormField
                            control={form.control}
                            name="category"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Category <span className="text-destructive">*</span></FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select category" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {categories.map((cat: any, index: number) => (
                                                <SelectItem key={`${cat.category_id}-${index}`} value={cat.category_name}>
                                                    {cat.category_name}
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
                            name="fullName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Full Name <span className="text-destructive">*</span></FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Enter full name"
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
                            name="address"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Address</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Enter physical address"
                                            className="min-h-[100px] resize-none"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    {/* Column 2: Login Information */}
                    <div className="space-y-4">
                        <div className="border-b pb-2">
                            <h3 className="font-semibold text-foreground">Login Information</h3>
                        </div>
                        <FormField
                            control={form.control}
                            name="username"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Username <span className="text-destructive">*</span></FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter username" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {!isEdit && (
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Password <span className="text-destructive">*</span></FormLabel>
                                        <FormControl>
                                            <Input type="password" placeholder="••••••••" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        )}
                        <FormField
                            control={form.control}
                            name="subGodown"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Sub Godown <span className="text-destructive">*</span></FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select godown" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {godowns.map((godown: any, index: number) => (
                                                <SelectItem key={`${godown.uuid}-${index}`} value={godown.subGodown}>
                                                    {godown.subGodown}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    {/* Column 3: Identification & Bank */}
                    <div className="space-y-4">
                        <div className="border-b pb-2">
                            <h3 className="font-semibold text-foreground">Bank & KYC Information</h3>
                        </div>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <FormField
                                control={form.control}
                                name="bankName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Bank Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Bank Name" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="accountNumber"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>A/C Number</FormLabel>
                                        <FormControl>
                                            <Input placeholder="A/C No" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <FormField
                                control={form.control}
                                name="ifscCode"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>IFSC Code</FormLabel>
                                        <FormControl>
                                            <Input placeholder="IFSC" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="branchName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Branch Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Branch" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <FormField
                            control={form.control}
                            name="aadharNo"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Aadhar Number</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter aadhar number" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="panNo"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>PAN Number</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter PAN number" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>

                <div className="mt-8 flex justify-end gap-3 border-t pt-4">
                    <Button type="button" variant="outline" onClick={onCancel} className="w-full sm:w-auto">
                        Cancel
                    </Button>
                    <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
                        {isSubmitting ? "Submitting..." : isEdit ? "Update Employee" : "Add Employee"}
                    </Button>
                </div>
            </form>
        </Form>
    );
}

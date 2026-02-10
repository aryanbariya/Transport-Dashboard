"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { format } from "date-fns";
import { CalendarIcon, Check, ChevronsUpDown } from "lucide-react";

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
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { useOwners } from "@/hooks/use-owners";
import { createTruckSchema, type CreateTruckInput, type Truck } from "./schema";

interface TruckFormProps {
    onSuccess?: () => void;
    onCancel?: () => void;
    initialData?: Truck;
}

export function TruckForm({ onSuccess, onCancel, initialData }: TruckFormProps) {
    const queryClient = useQueryClient();
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [openOwner, setOpenOwner] = React.useState(false);
    const isEdit = !!initialData;

    // Fetch Owners for the dropdown
    const { data: ownersResponse } = useOwners({ page: 1, limit: 1000, status: "Active" });
    const owners = ownersResponse?.data ?? [];

    const form = useForm<CreateTruckInput>({
        resolver: zodResolver(createTruckSchema),
        defaultValues: {
            truck_name: initialData?.truck_name || "",
            empty_weight: initialData?.empty_weight || "",
            company: initialData?.company || "",
            gvw: initialData?.gvw || "",
            reg_date: initialData?.reg_date ? new Date(initialData.reg_date) : undefined,
            truck_owner: initialData?.truck_owner_name || "",
            tax_validity: initialData?.tax_validity ? new Date(initialData.tax_validity) : undefined,
            insurance_validity: initialData?.insurance_validity ? new Date(initialData.insurance_validity) : undefined,
            fitness_validity: initialData?.fitness_validity ? new Date(initialData.fitness_validity) : undefined,
            permit_validity: initialData?.permit_validity ? new Date(initialData.permit_validity) : undefined,
        },
    });

    const onSubmit = async (data: CreateTruckInput) => {
        setIsSubmitting(true);
        try {
            // Find owner id based on name
            const selectedOwner = owners.find(o => o.ownerName === data.truck_owner);

            const payload = {
                truck_name: data.truck_name,
                empty_weight: data.empty_weight,
                company: data.company,
                gvw: data.gvw,
                reg_date: data.reg_date ? format(data.reg_date, "yyyy-MM-dd") : null,
                truck_owner_name: data.truck_owner,
                owner_id: selectedOwner ? selectedOwner.owner_id : undefined,
                tax_validity_date: data.tax_validity ? format(data.tax_validity, "yyyy-MM-dd") : null,
                insurance_validity_date: data.insurance_validity ? format(data.insurance_validity, "yyyy-MM-dd") : null,
                fitness_validity_date: data.fitness_validity ? format(data.fitness_validity, "yyyy-MM-dd") : null,
                permit_validity_date: data.permit_validity ? format(data.permit_validity, "yyyy-MM-dd") : null,
                direct_sale: "No",
            };

            if (isEdit && initialData) {
                await axios.put(`/api/trucks/${initialData.uuid}`, payload);
                toast.success("Truck updated successfully!");
            } else {
                await axios.post("/api/trucks", payload);
                toast.success("Truck added successfully!");
            }
            queryClient.invalidateQueries({ queryKey: ["trucks"] });
            form.reset();
            onSuccess?.();
        } catch (error) {
            console.error(isEdit ? "Error updating truck:" : "Error creating truck:", error);
            toast.error(isEdit ? "Failed to update truck." : "Failed to add truck.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-4">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    {/* Basic Information */}
                    <div className="space-y-4">
                        <h3 className="font-medium text-muted-foreground">Basic Information</h3>
                        <FormField
                            control={form.control}
                            name="truck_name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Truck Number <span className="text-destructive">*</span></FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter Truck Number" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="empty_weight"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Empty Weight <span className="text-destructive">*</span></FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter Empty Weight" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="company"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Company <span className="text-destructive">*</span></FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter Company" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="gvw"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>GVW <span className="text-destructive">*</span></FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter GVW" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    {/* Registration Information */}
                    <div className="space-y-4">
                        <h3 className="font-medium text-muted-foreground">Registration Information</h3>
                        <FormField
                            control={form.control}
                            name="reg_date"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>Registration Date <span className="text-destructive">*</span></FormLabel>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                    variant={"outline"}
                                                    className={cn(
                                                        "w-full pl-3 text-left font-normal",
                                                        !field.value && "text-muted-foreground"
                                                    )}
                                                >
                                                    {field.value ? (
                                                        format(field.value, "PPP")
                                                    ) : (
                                                        <span>Pick a date</span>
                                                    )}
                                                    <CalendarIcon className="ml-auto size-4 opacity-50" />
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={field.value}
                                                onSelect={field.onChange}
                                                disabled={(date) =>
                                                    date > new Date() || date < new Date("1900-01-01")
                                                }
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="truck_owner"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>Truck Owner <span className="text-destructive">*</span></FormLabel>
                                    <Popover open={openOwner} onOpenChange={setOpenOwner}>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <div className="relative">
                                                    <Input
                                                        placeholder="Search Truck Owner"
                                                        {...field}
                                                        onChange={(e) => {
                                                            field.onChange(e);
                                                            setOpenOwner(true);
                                                        }}
                                                        onClick={() => setOpenOwner((prev) => !prev)}
                                                        autoComplete="off"
                                                        className="pr-10"
                                                    />
                                                    <ChevronsUpDown
                                                        className="absolute right-3 top-2.5 size-4 cursor-pointer opacity-50 hover:opacity-100"
                                                        onClick={() => setOpenOwner((prev) => !prev)}
                                                    />
                                                </div>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent
                                            className="w-[--radix-popover-trigger-width] p-0"
                                            onOpenAutoFocus={(e) => e.preventDefault()}
                                        >
                                            <Command shouldFilter={false}>
                                                <CommandList>
                                                    <CommandGroup>
                                                        {owners.filter(owner =>
                                                            !field.value ||
                                                            owner.ownerName.toLowerCase().includes(field.value.toLowerCase())
                                                        ).length === 0 && (
                                                                <CommandEmpty>No owner found.</CommandEmpty>
                                                            )}
                                                        {owners.filter(owner =>
                                                            !field.value ||
                                                            owner.ownerName.toLowerCase().includes(field.value.toLowerCase())
                                                        ).map((owner) => (
                                                            <CommandItem
                                                                value={owner.ownerName}
                                                                key={owner.owner_id}
                                                                onSelect={() => {
                                                                    form.setValue("truck_owner", owner.ownerName);
                                                                    setOpenOwner(false);
                                                                }}
                                                            >
                                                                <Check
                                                                    className={cn(
                                                                        "mr-2 size-4",
                                                                        owner.ownerName === field.value
                                                                            ? "opacity-100"
                                                                            : "opacity-0"
                                                                    )}
                                                                />
                                                                {owner.ownerName}
                                                            </CommandItem>
                                                        ))}
                                                    </CommandGroup>
                                                </CommandList>
                                            </Command>
                                        </PopoverContent>
                                    </Popover>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    {/* Validity Information */}
                    <div className="space-y-4">
                        <h3 className="font-medium text-muted-foreground">Validity Information</h3>
                        <FormField
                            control={form.control}
                            name="tax_validity"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>Tax Validity</FormLabel>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                    variant={"outline"}
                                                    className={cn(
                                                        "w-full pl-3 text-left font-normal",
                                                        !field.value && "text-muted-foreground"
                                                    )}
                                                >
                                                    {field.value ? (
                                                        format(field.value, "PPP")
                                                    ) : (
                                                        <span>Pick a date</span>
                                                    )}
                                                    <CalendarIcon className="ml-auto size-4 opacity-50" />
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={field.value}
                                                onSelect={field.onChange}
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="insurance_validity"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>Insurance Validity</FormLabel>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                    variant={"outline"}
                                                    className={cn(
                                                        "w-full pl-3 text-left font-normal",
                                                        !field.value && "text-muted-foreground"
                                                    )}
                                                >
                                                    {field.value ? (
                                                        format(field.value, "PPP")
                                                    ) : (
                                                        <span>Pick a date</span>
                                                    )}
                                                    <CalendarIcon className="ml-auto size-4 opacity-50" />
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={field.value}
                                                onSelect={field.onChange}
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="fitness_validity"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>Fitness Validity</FormLabel>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                    variant={"outline"}
                                                    className={cn(
                                                        "w-full pl-3 text-left font-normal",
                                                        !field.value && "text-muted-foreground"
                                                    )}
                                                >
                                                    {field.value ? (
                                                        format(field.value, "PPP")
                                                    ) : (
                                                        <span>Pick a date</span>
                                                    )}
                                                    <CalendarIcon className="ml-auto size-4 opacity-50" />
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={field.value}
                                                onSelect={field.onChange}
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="permit_validity"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>Permit Validity</FormLabel>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                    variant={"outline"}
                                                    className={cn(
                                                        "w-full pl-3 text-left font-normal",
                                                        !field.value && "text-muted-foreground"
                                                    )}
                                                >
                                                    {field.value ? (
                                                        format(field.value, "PPP")
                                                    ) : (
                                                        <span>Pick a date</span>
                                                    )}
                                                    <CalendarIcon className="ml-auto size-4 opacity-50" />
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={field.value}
                                                onSelect={field.onChange}
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                    <Button type="button" variant="outline" onClick={onCancel} className="w-full sm:w-auto">
                        Cancel
                    </Button>
                    <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
                        {isSubmitting ? "Submitting..." : isEdit ? "Update Truck" : "Add Truck"}
                    </Button>
                </div>
            </form>
        </Form>
    );
}

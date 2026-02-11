"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { z } from "zod";

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
    Command,
    CommandEmpty,
    CommandGroup,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";
import { useMSWC } from "@/hooks/use-mswc";
import { useGrains } from "@/hooks/use-grains";
import { useSchemes } from "@/hooks/use-schemes";
import type { DOGenerate } from "./schema";

const doFormSchema = z.object({
    do_no: z.union([z.string(), z.number()]),
    godown_id: z.string().min(1, "Base Depo is required"),
    do_date: z.string().min(1, "DO Date is required"),
    cota: z.string().min(1, "Quota Date is required"),
    scheme_id: z.string().min(1, "Scheme is required"),
    grain_id: z.string().min(1, "Grain is required"),
    quantity: z.string().min(1, "Quantity is required").regex(/^\d+(\.\d+)?$/, "Please enter a valid number"),
});

type DOFormInput = z.infer<typeof doFormSchema>;

interface DOGenerateFormProps {
    onSuccess?: () => void;
    onCancel?: () => void;
    initialData?: DOGenerate;
}

export function DOGenerateForm({ onSuccess, onCancel, initialData }: DOGenerateFormProps) {
    const queryClient = useQueryClient();
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [schemeOpen, setSchemeOpen] = React.useState(false);
    const [grainOpen, setGrainOpen] = React.useState(false);
    const [depoOpen, setDepoOpen] = React.useState(false);
    const isEdit = !!initialData;

    // Fetch MSWC data for Base Depo dropdown
    const { data: mswcResponse } = useMSWC({ page: 1, limit: 1000 });
    const mswcs = mswcResponse?.data ?? [];

    // Fetch Grains for dropdown
    const { data: grainResponse } = useGrains({ page: 1, limit: 1000 });
    const grains = grainResponse?.data ?? [];

    // Fetch Schemes for dropdown
    const { data: schemeResponse } = useSchemes({ page: 1, limit: 1000 });
    const schemes = schemeResponse?.data ?? [];

    const form = useForm<DOFormInput>({
        resolver: zodResolver(doFormSchema),
        defaultValues: {
            do_no: initialData?.do_no || "",
            godown_id: initialData?.godown_id ? String(initialData.godown_id) : "",
            do_date: initialData?.do_date ? initialData.do_date.split("T")[0] : "",
            cota: initialData?.cota ? initialData.cota.split("T")[0] : "",
            scheme_id: initialData?.scheme_id ? String(initialData.scheme_id) : "",
            grain_id: initialData?.grain_id ? String(initialData.grain_id) : "",
            quantity: initialData?.quantity ? String(initialData.quantity) : "",
        },
    });

    // Fetch next DO number on mount (only for new entries)
    React.useEffect(() => {
        if (!isEdit) {
            axios.get("/api/do-generate/next-do")
                .then((res) => {
                    const nextDo = res.data?.next_do_no;
                    if (nextDo !== undefined && nextDo !== null) {
                        form.setValue("do_no", String(nextDo));
                    }
                })
                .catch((err) => {
                    console.error("Failed to fetch next DO number:", err);
                });
        }
    }, [isEdit, form]);

    const onSubmit = async (data: DOFormInput) => {
        setIsSubmitting(true);
        try {
            if (isEdit && initialData) {
                await axios.put("/api/do-generate", {
                    ...data,
                    stock_id: initialData.stock_id,
                });
                toast.success("DO record updated successfully!");
            } else {
                await axios.post("/api/do-generate", data);
                toast.success("DO record created successfully!");
            }
            queryClient.invalidateQueries({ queryKey: ["do-generate"] });
            form.reset();
            onSuccess?.();
        } catch (error) {
            console.error(isEdit ? "Error updating DO:" : "Error creating DO:", error);
            toast.error(isEdit ? "Failed to update DO record." : "Failed to create DO record.");
        } finally {
            setIsSubmitting(false);
        }
    };

    // Helper to get display name for selected ID
    const getSelectedSchemeName = (id: string) => {
        const scheme = schemes.find((s) => String(s.scheme_id) === id);
        return scheme?.scheme_name || "";
    };

    const getSelectedGrainName = (id: string) => {
        const grain = grains.find((g) => String(g.grain_id) === id);
        return grain?.grainName || "";
    };

    const getSelectedDepoName = (id: string) => {
        const mswc = mswcs.find((m) => String(m.mswc_id) === id);
        return mswc?.godownName || "";
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
                {/* DO Number - auto-fetched, read-only for new */}
                <FormField
                    control={form.control}
                    name="do_no"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>D.O. No. <span className="text-destructive">*</span></FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Loading..."
                                    {...field}
                                    value={String(field.value)}
                                    readOnly={!isEdit}
                                    className={!isEdit ? "bg-muted" : ""}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Base Depo - searchable dropdown from MSWC */}
                <FormField
                    control={form.control}
                    name="godown_id"
                    render={({ field }) => (
                        <FormItem className="flex flex-col">
                            <FormLabel>Base Depo <span className="text-destructive">*</span></FormLabel>
                            <Popover open={depoOpen} onOpenChange={setDepoOpen}>
                                <PopoverTrigger asChild>
                                    <FormControl>
                                        <div className="relative">
                                            <Input
                                                placeholder="Select Base Depo"
                                                value={getSelectedDepoName(field.value) || field.value}
                                                onClick={() => setDepoOpen((prev) => !prev)}
                                                readOnly
                                                autoComplete="off"
                                                className="pr-10 cursor-pointer"
                                            />
                                            <ChevronsUpDown
                                                className="absolute right-3 top-2.5 size-4 cursor-pointer opacity-50 hover:opacity-100"
                                                onClick={() => setDepoOpen((prev) => !prev)}
                                            />
                                        </div>
                                    </FormControl>
                                </PopoverTrigger>
                                <PopoverContent
                                    className="w-[--radix-popover-trigger-width] p-0"
                                    onOpenAutoFocus={(e) => e.preventDefault()}
                                >
                                    <Command>
                                        <CommandList>
                                            <CommandGroup>
                                                {mswcs.length === 0 && (
                                                    <CommandEmpty>No Depo found.</CommandEmpty>
                                                )}
                                                {mswcs.map((mswc) => (
                                                    <CommandItem
                                                        value={mswc.godownName}
                                                        key={mswc.uuid}
                                                        onSelect={() => {
                                                            form.setValue("godown_id", String(mswc.mswc_id));
                                                            setDepoOpen(false);
                                                        }}
                                                    >
                                                        <Check
                                                            className={cn(
                                                                "mr-2 size-4",
                                                                String(mswc.mswc_id) === field.value
                                                                    ? "opacity-100"
                                                                    : "opacity-0"
                                                            )}
                                                        />
                                                        {mswc.godownName}
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

                {/* DO Date */}
                <FormField
                    control={form.control}
                    name="do_date"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>D.O. Date <span className="text-destructive">*</span></FormLabel>
                            <FormControl>
                                <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Quota Date */}
                <FormField
                    control={form.control}
                    name="cota"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Quota Date <span className="text-destructive">*</span></FormLabel>
                            <FormControl>
                                <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Scheme - dropdown */}
                <FormField
                    control={form.control}
                    name="scheme_id"
                    render={({ field }) => (
                        <FormItem className="flex flex-col">
                            <FormLabel>Scheme <span className="text-destructive">*</span></FormLabel>
                            <Popover open={schemeOpen} onOpenChange={setSchemeOpen}>
                                <PopoverTrigger asChild>
                                    <FormControl>
                                        <div className="relative">
                                            <Input
                                                placeholder="Select Scheme"
                                                value={getSelectedSchemeName(field.value) || field.value}
                                                onClick={() => setSchemeOpen((prev) => !prev)}
                                                readOnly
                                                autoComplete="off"
                                                className="pr-10 cursor-pointer"
                                            />
                                            <ChevronsUpDown
                                                className="absolute right-3 top-2.5 size-4 cursor-pointer opacity-50 hover:opacity-100"
                                                onClick={() => setSchemeOpen((prev) => !prev)}
                                            />
                                        </div>
                                    </FormControl>
                                </PopoverTrigger>
                                <PopoverContent
                                    className="w-[--radix-popover-trigger-width] p-0"
                                    onOpenAutoFocus={(e) => e.preventDefault()}
                                >
                                    <Command>
                                        <CommandList>
                                            <CommandGroup>
                                                {schemes.length === 0 && (
                                                    <CommandEmpty>No Scheme found.</CommandEmpty>
                                                )}
                                                {schemes.map((scheme) => (
                                                    <CommandItem
                                                        value={scheme.scheme_name}
                                                        key={scheme.uuid}
                                                        onSelect={() => {
                                                            form.setValue("scheme_id", String(scheme.scheme_id));
                                                            setSchemeOpen(false);
                                                        }}
                                                    >
                                                        <Check
                                                            className={cn(
                                                                "mr-2 size-4",
                                                                String(scheme.scheme_id) === field.value
                                                                    ? "opacity-100"
                                                                    : "opacity-0"
                                                            )}
                                                        />
                                                        {scheme.scheme_name}
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

                {/* Grain - dropdown */}
                <FormField
                    control={form.control}
                    name="grain_id"
                    render={({ field }) => (
                        <FormItem className="flex flex-col">
                            <FormLabel>Grain <span className="text-destructive">*</span></FormLabel>
                            <Popover open={grainOpen} onOpenChange={setGrainOpen}>
                                <PopoverTrigger asChild>
                                    <FormControl>
                                        <div className="relative">
                                            <Input
                                                placeholder="Select Grain"
                                                value={getSelectedGrainName(field.value) || field.value}
                                                onClick={() => setGrainOpen((prev) => !prev)}
                                                readOnly
                                                autoComplete="off"
                                                className="pr-10 cursor-pointer"
                                            />
                                            <ChevronsUpDown
                                                className="absolute right-3 top-2.5 size-4 cursor-pointer opacity-50 hover:opacity-100"
                                                onClick={() => setGrainOpen((prev) => !prev)}
                                            />
                                        </div>
                                    </FormControl>
                                </PopoverTrigger>
                                <PopoverContent
                                    className="w-[--radix-popover-trigger-width] p-0"
                                    onOpenAutoFocus={(e) => e.preventDefault()}
                                >
                                    <Command>
                                        <CommandList>
                                            <CommandGroup>
                                                {grains.length === 0 && (
                                                    <CommandEmpty>No Grain found.</CommandEmpty>
                                                )}
                                                {grains.map((grain) => (
                                                    <CommandItem
                                                        value={grain.grainName}
                                                        key={grain.uuid}
                                                        onSelect={() => {
                                                            form.setValue("grain_id", String(grain.grain_id));
                                                            setGrainOpen(false);
                                                        }}
                                                    >
                                                        <Check
                                                            className={cn(
                                                                "mr-2 size-4",
                                                                String(grain.grain_id) === field.value
                                                                    ? "opacity-100"
                                                                    : "opacity-0"
                                                            )}
                                                        />
                                                        {grain.grainName}
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

                {/* Quantity - number only */}
                <FormField
                    control={form.control}
                    name="quantity"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Quantity <span className="text-destructive">*</span></FormLabel>
                            <FormControl>
                                <Input
                                    type="number"
                                    placeholder="Enter quantity"
                                    {...field}
                                    onKeyDown={(e) => {
                                        if (["e", "E", "+", "-"].includes(e.key)) {
                                            e.preventDefault();
                                        }
                                    }}
                                />
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
                        {isSubmitting ? "Submitting..." : isEdit ? "Update DO" : "Add DO"}
                    </Button>
                </div>
            </form>
        </Form>
    );
}

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
import { useGodowns } from "@/hooks/use-godowns";
import type { DOGenerate, DOEntry } from "./schema";

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
    const [step, setStep] = React.useState(1);
    const [entries, setEntries] = React.useState<DOEntry[]>(initialData?.entries || []);

    // Update entries if initialData changes (e.g. after async fetch in table)
    React.useEffect(() => {
        if (initialData?.entries) {
            setEntries(initialData.entries);
        } else {
            setEntries([]);
        }
    }, [initialData]);
    const [currentEntry, setCurrentEntry] = React.useState<DOEntry>({ godown: "", vahtuk: "", quantity: "" });

    const [schemeOpen, setSchemeOpen] = React.useState(false);
    const [grainOpen, setGrainOpen] = React.useState(false);
    const [depoOpen, setDepoOpen] = React.useState(false);
    const [subGodownOpen, setSubGodownOpen] = React.useState(false);
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

    // Fetch Sub Godowns for Step 2
    const { data: godownResponse } = useGodowns({ page: 1, limit: 1000 });
    const subGodowns = godownResponse?.data ?? [];

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
        if (step === 1) {
            setStep(2);
            return;
        }

        if (entries.length === 0) {
            toast.error("Please add at least one godown entry.");
            return;
        }

        setIsSubmitting(true);
        try {
            const payload = {
                doNo: data.do_no,
                baseDepot: data.godown_id,
                doDate: data.do_date,
                doExpiryDate: data.cota,
                scheme: data.scheme_id,
                grain: data.grain_id,
                quantity: data.quantity,
                quintal: data.quantity,
                total_amount: 0,
                expire_date: data.cota,
                entries
            };

            if (isEdit && initialData) {
                await axios.put("/api/do-generate", {
                    ...payload,
                    stock_id: initialData.stock_id,
                });
                toast.success("DO record updated successfully!");
            } else {
                await axios.post("/api/do-generate", payload);
                toast.success("DO record created successfully!");
            }
            queryClient.invalidateQueries({ queryKey: ["do-generate"] });
            form.reset();
            setEntries([]);
            onSuccess?.();
            setStep(1);
        } catch (error) {
            console.error(isEdit ? "Error updating DO:" : "Error creating DO:", error);
            toast.error(isEdit ? "Failed to update DO record." : "Failed to create DO record.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleAddEntry = () => {
        if (!currentEntry.godown || !currentEntry.vahtuk || !currentEntry.quantity) {
            toast.error("Please fill all entry fields");
            return;
        }
        setEntries([...entries, currentEntry]);
        setCurrentEntry({ godown: "", vahtuk: "", quantity: "" });
    };

    const handleRemoveEntry = (index: number) => {
        setEntries(entries.filter((_, i) => i !== index));
    };

    const handleBack = () => setStep(1);

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
                {step === 1 ? (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                        </div>

                        <div className="flex justify-end gap-3 pt-4 border-t">
                            <Button type="button" variant="outline" onClick={onCancel}>
                                Cancel
                            </Button>
                            <Button type="submit">
                                Save & Next
                            </Button>
                        </div>
                    </>
                ) : (
                    <div className="space-y-6">
                        {/* Summary of Step 1 */}
                        <div className="bg-muted p-4 rounded-md">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm font-medium opacity-70">DO Number</p>
                                    <p className="text-lg font-semibold">{form.getValues("do_no")}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium opacity-70">Total Quantity</p>
                                    <p className="text-lg font-semibold">{form.getValues("quantity")}</p>
                                </div>
                            </div>
                        </div>

                        {/* Step 2 Inputs */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <FormItem className="flex flex-col">
                                <FormLabel>Godown</FormLabel>
                                <Popover open={subGodownOpen} onOpenChange={setSubGodownOpen}>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <div className="relative">
                                                <Input
                                                    placeholder="Select Godown"
                                                    value={currentEntry.godown}
                                                    onClick={() => setSubGodownOpen((prev) => !prev)}
                                                    readOnly
                                                    autoComplete="off"
                                                    className="pr-10 cursor-pointer"
                                                />
                                                <ChevronsUpDown
                                                    className="absolute right-3 top-2.5 size-4 cursor-pointer opacity-50 hover:opacity-100"
                                                    onClick={() => setSubGodownOpen((prev) => !prev)}
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
                                                    {subGodowns.length === 0 && (
                                                        <CommandEmpty>No Godown found.</CommandEmpty>
                                                    )}
                                                    {subGodowns.map((sg) => (
                                                        <CommandItem
                                                            value={sg.subGodown}
                                                            key={sg.uuid}
                                                            onSelect={() => {
                                                                setCurrentEntry({ ...currentEntry, godown: sg.subGodown });
                                                                setSubGodownOpen(false);
                                                            }}
                                                        >
                                                            <Check
                                                                className={cn(
                                                                    "mr-2 size-4",
                                                                    sg.subGodown === currentEntry.godown
                                                                        ? "opacity-100"
                                                                        : "opacity-0"
                                                                )}
                                                            />
                                                            {sg.subGodown}
                                                        </CommandItem>
                                                    ))}
                                                </CommandGroup>
                                            </CommandList>
                                        </Command>
                                    </PopoverContent>
                                </Popover>
                            </FormItem>

                            <FormItem>
                                <FormLabel>Vahtuk</FormLabel>
                                <FormControl>
                                    <select
                                        className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                        value={currentEntry.vahtuk}
                                        onChange={(e) => setCurrentEntry({ ...currentEntry, vahtuk: e.target.value })}
                                    >
                                        <option value="">Select Vahtuk</option>
                                        <option value="Thet">Thet</option>
                                        <option value="Godown">Godown</option>
                                    </select>
                                </FormControl>
                            </FormItem>

                            <FormItem>
                                <FormLabel>Quantity</FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        placeholder="Quantity"
                                        value={currentEntry.quantity}
                                        onChange={(e) => setCurrentEntry({ ...currentEntry, quantity: e.target.value })}
                                    />
                                </FormControl>
                            </FormItem>
                        </div>

                        <div className="flex justify-end">
                            <Button type="button" onClick={handleAddEntry} variant="secondary">
                                Add Entry
                            </Button>
                        </div>

                        {/* Entries Table */}
                        {entries.length > 0 && (
                            <div className="border rounded-md overflow-hidden">
                                <table className="min-w-full divide-y divide-border">
                                    <thead className="bg-muted">
                                        <tr>
                                            <th className="px-4 py-2 text-left text-xs font-medium uppercase">Sr.</th>
                                            <th className="px-4 py-2 text-left text-xs font-medium uppercase">Godown</th>
                                            <th className="px-4 py-2 text-left text-xs font-medium uppercase">Vahtuk</th>
                                            <th className="px-4 py-2 text-left text-xs font-medium uppercase">Qty</th>
                                            <th className="px-4 py-2 text-right text-xs font-medium uppercase">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-background divide-y divide-border">
                                        {entries.map((entry, index) => (
                                            <tr key={index}>
                                                <td className="px-4 py-2 text-sm">{index + 1}</td>
                                                <td className="px-4 py-2 text-sm">{entry.godown}</td>
                                                <td className="px-4 py-2 text-sm">{entry.vahtuk}</td>
                                                <td className="px-4 py-2 text-sm">{entry.quantity}</td>
                                                <td className="px-4 py-2 text-sm text-right">
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        className="text-destructive h-8 px-2"
                                                        onClick={() => handleRemoveEntry(index)}
                                                    >
                                                        Remove
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        <div className="flex justify-end gap-3 pt-4 border-t">
                            <Button type="button" variant="outline" onClick={handleBack}>
                                Back
                            </Button>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? "Submitting..." : isEdit ? "Update DO" : "Submit"}
                            </Button>
                        </div>
                    </div>
                )}
            </form>
        </Form>
    );
}

"use client";

import * as React from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useDOGenerate } from "@/hooks/use-do-generate";
import { useDrivers } from "@/hooks/use-drivers";
import { useGodowns } from "@/hooks/use-godowns";
import { useMSWC } from "@/hooks/use-mswc";
import { useOwners } from "@/hooks/use-owners";
import { usePackaging } from "@/hooks/use-packaging";
import { useSchemes } from "@/hooks/use-schemes";
import { useTrucks } from "@/hooks/use-trucks";
import { post, put } from "@/lib/axios";

import { type Transport, type TransportFormValues, transportFormSchema } from "./schema";

interface TransportFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  initialData?: Transport;
}

export function TransportForm({ onSuccess, onCancel, initialData }: TransportFormProps) {
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const isEdit = !!initialData;

  // Correctly map initialData (from API) to Form Values
  // The API might return fields like baseDepo_id or just use different names than the display schema
  const form = useForm<TransportFormValues>({
    resolver: zodResolver(transportFormSchema),
    defaultValues: {
      baseDepo: initialData ? String((initialData as any).baseDepo || (initialData as any).baseDepoId || "") : "",
      doNo: initialData ? String((initialData as any).doNo || (initialData as any).donumber || "") : "",
      godown: initialData ? String((initialData as any).godown || (initialData as any).godownId || "") : "",
      truck: initialData ? String((initialData as any).truck || (initialData as any).truckId || "") : "",
      owner: initialData ? String((initialData as any).owner || (initialData as any).ownerId || "") : "",
      driver: initialData ? String((initialData as any).driver || (initialData as any).driverId || "") : "",
      emptyWeight: initialData ? String(initialData.emptyWeight || "0") : "0",
      grossWeight: initialData ? String(initialData.grossWeight || "0") : "0",
      scheme: initialData ? String((initialData as any).scheme || (initialData as any).schemeId || "") : "",
      packaging: initialData ? String((initialData as any).packaging || (initialData as any).packId || "") : "",
      noOfBags: initialData ? String(initialData.noOfBags || "") : "",
      bardanWeight: initialData ? String((initialData as any).bardanWeight || "0") : "0",
      loadedNetWeight: initialData ? String((initialData as any).loadedNetWeight || "0") : "0",
      netWeight: initialData ? String((initialData as any).netWeight || "0") : "0",
      dispatchDate: initialData?.dispatchDate ? new Date(initialData.dispatchDate).toISOString().split("T")[0] : "",
      quota: initialData?.quota ? new Date(initialData.quota).toISOString().split("T")[0] : "",
      tpNo: initialData?.tpNo || "",
      allocation: initialData ? String((initialData as any).allocation || "") : "",
      status: initialData?.status || "Active",
    },
  });

  // Fetch dropdown data
  const { data: mswcData } = useMSWC({ page: 1, limit: 1000, status: "Active" });
  const { data: doData } = useDOGenerate({ page: 1, limit: 1000 });
  const { data: godownData } = useGodowns({ page: 1, limit: 1000, status: "Active" });
  const { data: truckData } = useTrucks({ page: 1, limit: 1000, status: "Active" });
  const { data: ownerData } = useOwners({ page: 1, limit: 1000, status: "Active" });
  const { data: driverData } = useDrivers({ page: 1, limit: 1000, status: "Active" });
  const { data: schemeData } = useSchemes({ page: 1, limit: 1000 });
  const { data: packagingData } = usePackaging({ page: 1, limit: 1000 });

  const watchedValues = useWatch({ control: form.control });

  // Auto-calculate logic
  React.useEffect(() => {
    const truckId = watchedValues.truck;
    if (truckId && truckData?.data) {
      const selectedTruck = truckData.data.find(
        (t: any) => String(t.truck_id) === String(truckId) || String(t.uuid) === String(truckId),
      );
      if (selectedTruck) {
        form.setValue("emptyWeight", String(selectedTruck.empty_weight || 0));
      }
    }
  }, [watchedValues.truck, truckData, form]);

  React.useEffect(() => {
    const pkgId = watchedValues.packaging;
    const bags = parseInt(watchedValues.noOfBags || "0", 10);

    if (pkgId && packagingData?.data) {
      const selectedPkg = packagingData.data.find(
        (p: any) => String(p.pack_id) === String(pkgId) || String(p.uuid) === String(pkgId),
      );
      if (selectedPkg) {
        const weightPerBag = Number(selectedPkg.weight || 0);
        const totalBardanWeight = (bags * weightPerBag).toFixed(2);
        form.setValue("bardanWeight", totalBardanWeight);
      }
    } else {
      form.setValue("bardanWeight", "0");
    }
  }, [watchedValues.packaging, watchedValues.noOfBags, packagingData, form]);

  React.useEffect(() => {
    const gross = parseFloat(watchedValues.grossWeight || "0");
    const empty = parseFloat(watchedValues.emptyWeight || "0");
    const bardan = parseFloat(watchedValues.bardanWeight || "0");

    const loadedNet = (gross - empty - bardan).toFixed(2);
    const net = (parseFloat(loadedNet) - bardan).toFixed(2);

    form.setValue("loadedNetWeight", loadedNet);
    form.setValue("netWeight", net);
  }, [watchedValues.grossWeight, watchedValues.emptyWeight, watchedValues.bardanWeight, form]);

  const onSubmit = async (data: TransportFormValues) => {
    setIsSubmitting(true);
    const payload = {
      ...data,
      emptyWeight: data.emptyWeight || "0",
      grossWeight: data.grossWeight || "0",
    };

    console.log("Submitting transport payload:", payload);

    try {
      if (isEdit && initialData) {
        await put(`/api/transports/${initialData.uuid}`, payload);
        toast.success("Transport updated successfully!");
      } else {
        await post("/api/transports", payload);
        toast.success("Transport added successfully!");
      }
      queryClient.invalidateQueries({ queryKey: ["transports"] });
      onSuccess?.();
    } catch (error: any) {
      console.error(isEdit ? "Error updating transport:" : "Error creating transport:", error.response?.data || error);

      const errorMessage =
        typeof error.response?.data?.error === "string"
          ? error.response.data.error
          : typeof error.response?.data === "string"
            ? error.response.data
            : error.response?.data?.message || (isEdit ? "Failed to update transport." : "Failed to add transport.");

      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10 py-6 px-4">
        <div className="flex flex-col xl:flex-row gap-12">
          {/* Basic Info Section */}
          <div className="flex-1 space-y-6">
            <div className="space-y-1">
              <h3 className="text-base font-bold text-foreground">Basic Information</h3>
              <p className="text-xs text-muted-foreground">Depo, DO and scheduling details.</p>
            </div>
            <Separator />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="baseDepo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-semibold">
                      Base Depo <span className="text-destructive">*</span>
                    </FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-10">
                          <SelectValue placeholder="Select Depo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {mswcData?.data?.map((m: any, index: number) => (
                          <SelectItem key={`mswc-${m.uuid || m.mswc_id || index}`} value={String(m.mswc_id)}>
                            {m.godownName}
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
                name="doNo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-semibold">
                      DO Number <span className="text-destructive">*</span>
                    </FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-10">
                          <SelectValue placeholder="Select DO" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {doData?.data?.map((d: any, index: number) => (
                          <SelectItem key={`do-${d.uuid || d.stock_id || index}`} value={String(d.stock_id)}>
                            {d.do_no}
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
                name="godown"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-semibold">Godown</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-10">
                          <SelectValue placeholder="Select Godown" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {godownData?.data?.map((g: any, index: number) => (
                          <SelectItem
                            key={`godown-${g.uuid || g.subgodown_id || index}`}
                            value={String(g.subgodown_id)}
                          >
                            {g.subGodown}
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
                name="dispatchDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-semibold">
                      Dispatch Date <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input type="date" className="h-10" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="quota"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-semibold">Quota Date</FormLabel>
                    <FormControl>
                      <Input type="date" className="h-10" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="scheme"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-semibold">Scheme</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-10">
                          <SelectValue placeholder="Select Scheme" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {schemeData?.data?.map((s: any, index: number) => (
                          <SelectItem key={`scheme-${s.uuid || s.scheme_id || index}`} value={String(s.scheme_id)}>
                            {s.scheme_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Vehicle Info Section */}
          <div className="flex-1 space-y-6">
            <div className="space-y-1">
              <h3 className="text-base font-bold text-foreground">Vehicle Information</h3>
              <p className="text-xs text-muted-foreground">Truck, owner and driver assignments.</p>
            </div>
            <Separator />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="truck"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-semibold">
                      Truck <span className="text-destructive">*</span>
                    </FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-10">
                          <SelectValue placeholder="Select Truck" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {truckData?.data?.map((t: any, index: number) => (
                          <SelectItem key={`truck-${t.uuid || t.truck_id || index}`} value={String(t.truck_id)}>
                            {t.truck_name}
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
                name="owner"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-semibold">Owner</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-10">
                          <SelectValue placeholder="Select Owner" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {ownerData?.data?.map((o: any, index: number) => (
                          <SelectItem key={`owner-${o.uuid || o.owner_id || index}`} value={String(o.owner_id)}>
                            {o.ownerName}
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
                name="driver"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-semibold">Driver</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-10">
                          <SelectValue placeholder="Select Driver" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {driverData?.data?.map((d: any, index: number) => (
                          <SelectItem key={`driver-${d.uuid || d.driver_id || index}`} value={String(d.driver_id)}>
                            {d.driver_name}
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
                name="tpNo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-semibold">TP Number</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter TP No" className="h-10" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="emptyWeight"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-semibold">Empty Weight (kg)</FormLabel>
                    <FormControl>
                      <Input type="number" className="h-10" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="grossWeight"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-semibold">Gross Weight (kg)</FormLabel>
                    <FormControl>
                      <Input type="number" className="h-10" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Cargo & Weight Analysis */}
          <div className="flex-1 space-y-6">
            <div className="space-y-1">
              <h3 className="text-base font-bold text-foreground">Cargo Details</h3>
              <p className="text-xs text-muted-foreground">Packaging and final weight analysis.</p>
            </div>
            <Separator />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="packaging"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-semibold">Packaging Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-10">
                          <SelectValue placeholder="Select Pkg" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {packagingData?.data?.map((p: any, index: number) => (
                          <SelectItem key={`pkg-${p.uuid || p.pack_id || index}`} value={String(p.pack_id)}>
                            {p.material_name}
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
                name="noOfBags"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-semibold">Bags Count</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-10">
                          <SelectValue placeholder="Count" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {[10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 200, 300, 400, 500].map((val) => (
                          <SelectItem key={`bags-${val}`} value={String(val)}>
                            {val}
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
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-semibold">Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-10">
                          <SelectValue placeholder="Status" />
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

            <div className="bg-primary/5 rounded-lg p-6 space-y-4 border border-primary/10 mt-4">
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/60">
                Live Weight Analysis
              </h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">Bardan Total</span>
                  <span className="font-mono font-bold">{watchedValues.bardanWeight || "0.00"} kg</span>
                </div>
                <div className="flex justify-between items-center py-3 border-y border-primary/10">
                  <span className="text-xs font-bold text-primary">Loaded Net</span>
                  <span className="font-mono text-xl font-black text-primary">
                    {watchedValues.loadedNetWeight || "0.00"} kg
                  </span>
                </div>
                <div className="flex justify-between items-center pt-1">
                  <span className="text-xs font-bold text-foreground">Final Net</span>
                  <span className="font-mono text-2xl font-black text-foreground underline decoration-primary/30 underline-offset-4">
                    {watchedValues.netWeight || "0.00"} kg
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4 border-t pt-8">
          <Button type="button" variant="ghost" onClick={onCancel} disabled={isSubmitting} className="h-12 px-8">
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting} className="h-12 px-12 font-bold shadow-xl shadow-primary/20">
            {isSubmitting ? "Saving..." : isEdit ? "Update Transport" : "Create Transport"}
          </Button>
        </div>
      </form>
    </Form>
  );
}

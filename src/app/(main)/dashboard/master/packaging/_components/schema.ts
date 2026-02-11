import { z } from "zod";

export const packagingSchema = z.object({
    uuid: z.string().optional(),
    material_name: z.string().min(1, "Material name is required"),
    weight: z.number().min(0, "Weight must be positive"),
    status: z.enum(["Active", "Inactive"]).default("Active"),
});

export type Packaging = z.infer<typeof packagingSchema>;

export const createPackagingSchema = packagingSchema;

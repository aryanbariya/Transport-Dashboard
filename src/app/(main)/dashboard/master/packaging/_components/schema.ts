import { z } from "zod";

export const packagingSchema = z.object({
    uuid: z.string(),
    pack_id: z.number(),
    material_name: z.string(),
    weight: z.string(),
    status: z.enum(["Active", "Inactive"]),
});

export type Packaging = z.infer<typeof packagingSchema>;

export interface PackagingResponse {
    data: Packaging[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

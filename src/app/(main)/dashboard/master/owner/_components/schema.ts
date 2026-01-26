import { z } from "zod";

export const ownerSchema = z.object({
    uuid: z.string(),
    owner_id: z.number(),
    ownerName: z.string().min(1, "Owner Name is required"),
    emailID: z.string().email("Invalid email format").optional().or(z.literal("")),
    contact: z.string().regex(/^\d{10}$/, "Contact must be exactly 10 digits"),
    address: z.string().optional().or(z.literal("")),
    status: z.enum(["Active", "Inactive"]),
});

export const createOwnerSchema = ownerSchema.omit({
    uuid: true,
    owner_id: true,
    status: true, // Status might be defaulted on backend or managed separately
}).extend({
    status: z.enum(["Active", "Inactive"]).default("Active"),
});

export type Owner = z.infer<typeof ownerSchema>;
export type CreateOwnerInput = z.infer<typeof createOwnerSchema>;

export interface OwnerResponse {
    data: Owner[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

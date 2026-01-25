import { z } from "zod";

export const ownerSchema = z.object({
    uuid: z.string(),
    owner_id: z.number(),
    ownerName: z.string(),
    emailID: z.string().email(),
    contact: z.string(),
    address: z.string().optional(),
    status: z.enum(["Active", "Inactive"]),
});

export type Owner = z.infer<typeof ownerSchema>;

export interface OwnerResponse {
    data: Owner[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

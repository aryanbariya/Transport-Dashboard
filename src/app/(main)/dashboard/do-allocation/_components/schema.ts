import { z } from "zod";

export const doAllocationSchema = z.object({
    do_id: z.union([z.string(), z.number()]),
    godown: z.union([z.string(), z.array(z.string())]),
    vahtuk: z.union([z.string(), z.array(z.string())]),
    quantity: z.union([z.string(), z.array(z.string())]),
});

export type DOAllocation = z.infer<typeof doAllocationSchema>;

export interface DOAllocationResponse {
    data: DOAllocation[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

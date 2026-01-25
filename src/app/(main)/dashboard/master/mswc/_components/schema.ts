import { z } from "zod";

export const mswcSchema = z.object({
    uuid: z.string(),
    godownName: z.string(),
    godownUnder: z.string(),
    mswc_id: z.number(),
    status: z.enum(["Active", "Inactive"]),
});

export type MSWC = z.infer<typeof mswcSchema>;

export interface MSWCResponse {
    data: MSWC[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

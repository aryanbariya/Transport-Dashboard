import { z } from "zod";

export const schemeSchema = z.object({
    uuid: z.string(),
    scheme_id: z.number(),
    scheme_name: z.string(),
    scheme_status: z.string(),
});

export type Scheme = z.infer<typeof schemeSchema>;

export interface SchemeResponse {
    data: Scheme[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

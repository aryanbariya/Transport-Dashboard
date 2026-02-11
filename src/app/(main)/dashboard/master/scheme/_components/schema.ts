import { z } from "zod";

export const schemeSchema = z.object({
    uuid: z.string().optional(),
    scheme_id: z.number().optional(),
    scheme_name: z.string().min(1, "Scheme Name is required"),
    scheme_status: z.enum(["Start", "Pending", "Completed"]),
});

export const createSchemeSchema = schemeSchema.omit({
    uuid: true,
    scheme_id: true,
}).extend({
    scheme_status: z.enum(["Start", "Pending", "Completed"]).default("Start"),
});

export type Scheme = z.infer<typeof schemeSchema>;
export type CreateSchemeInput = z.infer<typeof createSchemeSchema>;

export interface SchemeResponse {
    data: Scheme[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

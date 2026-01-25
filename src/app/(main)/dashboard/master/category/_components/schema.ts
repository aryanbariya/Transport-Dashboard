import { z } from "zod";

export const categorySchema = z.object({
    category_id: z.number(),
    category_name: z.string(),
    status: z.enum(["Active", "Deactive"]),
    last_modified: z.string(),
});

export type Category = z.infer<typeof categorySchema>;

export interface CategoryResponse {
    data: Category[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

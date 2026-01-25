import { z } from "zod";

export const godownSchema = z.object({
    uuid: z.string(),
    parentGodown: z.string(),
    subGodown: z.string(),
    status: z.enum(["Active", "Inactive"]),
    subgodown_id: z.number(),
});

export type Godown = z.infer<typeof godownSchema>;

export interface GodownResponse {
    data: Godown[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

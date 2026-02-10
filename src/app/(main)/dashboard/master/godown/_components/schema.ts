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

export const createGodownSchema = z.object({
    parentGodown: z.string().min(1, "Parent Godown is required"),
    subGodown: z.string().min(1, "Sub Godown Name is required"),
});

export type CreateGodownInput = z.infer<typeof createGodownSchema>;

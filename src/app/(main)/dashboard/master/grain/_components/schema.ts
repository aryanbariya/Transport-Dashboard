import { z } from "zod";

export const grainSchema = z.object({
    uuid: z.string(),
    grainName: z.string(),
    godownName: z.string(),
    grain_id: z.number(),
    last_modified: z.string(),
});

export type Grain = z.infer<typeof grainSchema>;

export interface GrainResponse {
    data: Grain[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

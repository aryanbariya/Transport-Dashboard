import { z } from "zod";

export const doGenerateSchema = z.object({
    stock_id: z.number(),
    do_no: z.number(),
    scheme_id: z.string(),
    cota: z.string(),
    do_date: z.string(),
    godown_id: z.string(),
    grain_id: z.number(),
    quintal: z.string(),
    quantity: z.string(),
    total_amount: z.string(),
    expire_date: z.string(),
});

export type DOGenerate = z.infer<typeof doGenerateSchema>;

export interface DOGenerateResponse {
    data: DOGenerate[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

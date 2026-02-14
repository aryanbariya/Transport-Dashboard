import { z } from "zod";

export interface DOEntry {
    godown: string;
    vahtuk: string;
    quantity: string;
}

export const doGenerateSchema = z.object({
    stock_id: z.number().optional(),
    do_no: z.union([z.string(), z.number()]),
    scheme_id: z.string(),
    cota: z.string(),
    do_date: z.string(),
    godown_id: z.string(),
    grain_id: z.union([z.string(), z.number()]),
    quintal: z.string().optional(),
    quantity: z.string(),
    total_amount: z.union([z.string(), z.number()]).optional(),
    expire_date: z.string().optional(),
    entries: z.array(z.object({
        godown: z.string(),
        vahtuk: z.string(),
        quantity: z.string(),
    })).optional(),
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

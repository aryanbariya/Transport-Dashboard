import { z } from "zod";

export const firstReportSchema = z.object({
    trans_id: z.number().optional(),
    uuid: z.string(),
    tpNo: z.string(),
    baseDepoName: z.string().nullable(),
    truckName: z.string().nullable(),
    do_id: z.union([z.string(), z.number()]).nullable(),
    donumber: z.string().nullable().optional(),
    quota: z.string().nullable(),
    schemeName: z.string().nullable(),
    noOfBags: z.union([z.number(), z.string()]).nullable(),
    grossWeight: z.union([z.number(), z.string()]).nullable(),
    netWeight: z.union([z.number(), z.string()]).nullable(),
    loadedNetWeight: z.union([z.number(), z.string()]).nullable(),
    godown: z.string().nullable().optional(),
    vahtuk: z.string().nullable().optional(),
    quantity: z.string().nullable().optional(),
    status: z.string().optional(),
});

export type FirstReport = z.infer<typeof firstReportSchema>;

export type FirstReportResponse = {
    success: boolean;
    data: FirstReport[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
} | FirstReport[];

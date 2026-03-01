import { z } from "zod";

// Shared status enum
const statusEnum = z.enum(["Active", "Inactive"]);

// Schema for the table view (matches unified API response)
export const transportSchema = z.object({
    uuid: z.string(),
    srNo: z.number().optional(),
    tpNo: z.string().nullable(),
    dispatchDate: z.string().nullable(),
    baseDepoName: z.string().nullable(),
    baseDepo: z.union([z.string(), z.number()]).optional(),
    truckName: z.string().nullable(),
    truck: z.union([z.string(), z.number()]).optional(),
    donumber: z.union([z.string(), z.number()]).nullable(),
    doNo: z.union([z.string(), z.number()]).optional(),
    quota: z.string().nullable(),
    schemeName: z.string().nullable(),
    scheme: z.union([z.string(), z.number()]).optional(),
    noOfBags: z.number().nullable(),
    packagingName: z.string().nullable(),
    packaging: z.union([z.string(), z.number()]).optional(),
    grossWeight: z.union([z.string(), z.number()]).nullable(),
    emptyWeight: z.union([z.string(), z.number()]).nullable(),
    owner: z.union([z.string(), z.number()]).optional(),
    driver: z.union([z.string(), z.number()]).optional(),
    godown: z.union([z.string(), z.number()]).optional(),
    status: statusEnum,
    createdAt: z.string().optional(),
    updatedAt: z.string().optional(),
});

export type Transport = z.infer<typeof transportSchema>;

// Schema for the creation/update form
export const transportFormSchema = z.object({
    baseDepo: z.string().min(1, "Base Depo is required"),
    doNo: z.string().min(1, "DO Number is required"),
    godown: z.string().optional(),
    truck: z.string().min(1, "Truck is required"),
    owner: z.string().optional(),
    driver: z.string().optional(),
    emptyWeight: z.string().min(1, "Empty weight is required"),
    grossWeight: z.string().min(1, "Gross weight is required"),
    scheme: z.string().optional(),
    packaging: z.string().optional(),
    noOfBags: z.string().optional(),
    bardanWeight: z.string().optional(),
    loadedNetWeight: z.string().optional(),
    netWeight: z.string().optional(),
    dispatchDate: z.string().min(1, "Dispatch date is required"),
    quota: z.string().optional(),
    tpNo: z.string().optional(),
    allocation: z.string().optional(),
    status: statusEnum.default("Active"),
});

export type TransportFormValues = z.infer<typeof transportFormSchema>;

export interface TransportResponse {
    success: boolean;
    data: Transport[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

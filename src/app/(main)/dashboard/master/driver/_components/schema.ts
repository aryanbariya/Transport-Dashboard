import { z } from "zod";

export const driverSchema = z.object({
    uuid: z.string(),
    driver_name: z.string(),
    aadhar_card_no: z.string().nullable(),
    contact: z.string().nullable(),
    driving_license_no: z.string().nullable(),
    status: z.enum(["Active", "Inactive"]),
    driver_id: z.number(),
});

export type Driver = z.infer<typeof driverSchema>;

export interface DriverResponse {
    data: Driver[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

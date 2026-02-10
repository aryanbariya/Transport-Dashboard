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

export const createDriverSchema = driverSchema.omit({
    uuid: true,
    driver_id: true,
}).extend({
    driver_name: z.string().min(1, "Driver Name is required"),
    contact: z.string().min(10, "Contact must be at least 10 digits").nullable(),
    status: z.enum(["Active", "Inactive"]).default("Active"),
});

export type Driver = z.infer<typeof driverSchema>;
export type CreateDriverInput = z.infer<typeof createDriverSchema>;

export interface DriverResponse {
    data: Driver[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

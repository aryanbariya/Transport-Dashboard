import { z } from "zod";

export const truckSchema = z.object({
    uuid: z.string(),
    truck_name: z.string(),
    status: z.enum(["Active", "Inactive"]),
    empty_weight: z.string(),
    company: z.string(),
    gvw: z.string(),
    reg_date: z.string(),
    truck_owner_name: z.string(),
    owner_id: z.number(),
    tax_validity: z.string(),
    insurance_validity: z.string(),
    fitness_validity: z.string(),
    permit_validity: z.string(),
    direct_sale: z.enum(["Yes", "No"]),
    truck_id: z.number(),
});

export type Truck = z.infer<typeof truckSchema>;

export const createTruckSchema = z.object({
    truck_name: z.string().min(1, "Truck number is required"),
    empty_weight: z.string().min(1, "Empty weight is required"),
    company: z.string().min(1, "Company is required"),
    gvw: z.string().min(1, "GVW is required"),
    reg_date: z.date({ required_error: "Registration date is required" }),
    truck_owner: z.string().min(1, "Truck owner is required"),
    tax_validity: z.date().optional(),
    insurance_validity: z.date().optional(),
    fitness_validity: z.date().optional(),
    permit_validity: z.date().optional(),
});

export type CreateTruckInput = z.infer<typeof createTruckSchema>;

export interface TruckResponse {
    data: Truck[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

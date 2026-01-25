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

export interface TruckResponse {
    data: Truck[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

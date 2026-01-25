import { z } from "zod";

export const employeeSchema = z.object({
    uuid: z.string(),
    category: z.string(),
    fullName: z.string(),
    username: z.string(),
    address: z.string(),
    aadharNo: z.string(),
    panNo: z.string(),
    bankName: z.string(),
    accountNumber: z.string(),
    ifscCode: z.string(),
    branchName: z.string(),
    subGodown: z.string(),
    contact: z.string(),
    order_number: z.number(),
});

export type Employee = z.infer<typeof employeeSchema>;

export interface EmployeeResponse {
    data: Employee[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

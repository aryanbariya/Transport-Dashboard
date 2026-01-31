import { z } from "zod";

export const employeeSchema = z.object({
    uuid: z.string(),
    category: z.string().min(1, "Category is required"),
    fullName: z.string().min(1, "Full Name is required"),
    username: z.string().min(1, "Username is required"),
    password: z.string().min(1, "Password is required").optional(), // Optional for edit, required for create
    address: z.string().optional().or(z.literal("")),
    aadharNo: z.string().optional().or(z.literal("")),
    panNo: z.string().optional().or(z.literal("")),
    bankName: z.string().optional().or(z.literal("")),
    accountNumber: z.string().optional().or(z.literal("")),
    ifscCode: z.string().optional().or(z.literal("")),
    branchName: z.string().optional().or(z.literal("")),
    subGodown: z.string().min(1, "Sub Godown is required"),
    contact: z.string().min(10, "Contact must be at least 10 digits").max(10, "Contact must be 10 digits"),
    order_number: z.number().optional(),
    status: z.enum(["Active", "Inactive"]).default("Active"),
});

const passwordSchema = z.string().min(6, "Password must be at least 6 characters");

export const createEmployeeSchema = employeeSchema.omit({
    uuid: true,
    order_number: true,
}).extend({
    password: passwordSchema,
});

export const updateEmployeeSchema = employeeSchema.omit({
    uuid: true,
    order_number: true,
}).extend({
    password: passwordSchema.optional().or(z.literal("")),
});

export type Employee = z.infer<typeof employeeSchema>;
export type CreateEmployeeInput = z.infer<typeof createEmployeeSchema>;

export interface EmployeeResponse {
    data: Employee[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

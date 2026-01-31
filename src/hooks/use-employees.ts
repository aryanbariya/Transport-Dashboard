import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import type { EmployeeResponse } from "@/app/(main)/dashboard/master/employee/_components/schema";

interface UseEmployeesProps {
    page: number;
    limit: number;
    status?: string;
}

export function useEmployees({ page, limit, status }: UseEmployeesProps) {
    return useQuery({
        queryKey: ["employees", page, limit, status],
        queryFn: async () => {
            const statusParam = status && status !== "all" ? `&status=${status}` : "";
            const { data } = await axios.get<EmployeeResponse>(
                `/api/employees/unified?page=${page}&limit=${limit}${statusParam}`
            );
            return data;
        },
        placeholderData: (previousData) => previousData,
    });
}

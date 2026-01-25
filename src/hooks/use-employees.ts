import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import type { EmployeeResponse } from "@/app/(main)/dashboard/master/employee/_components/schema";

interface UseEmployeesProps {
    page: number;
    limit: number;
}

export function useEmployees({ page, limit }: UseEmployeesProps) {
    return useQuery({
        queryKey: ["employees", page, limit],
        queryFn: async () => {
            const { data } = await axios.get<EmployeeResponse>(
                `/api/employees?page=${page}&limit=${limit}`
            );
            return data;
        },
        placeholderData: (previousData) => previousData,
    });
}

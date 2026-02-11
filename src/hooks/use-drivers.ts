import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import type { DriverResponse } from "@/app/(main)/dashboard/master/driver/_components/schema";

interface UseDriversProps {
    page: number;
    limit: number;
    status?: string;
}

export function useDrivers({ page, limit, status }: UseDriversProps) {
    return useQuery({
        queryKey: ["drivers", page, limit, status],
        queryFn: async () => {
            const statusParam = status && status !== "all" ? `&status=${status}` : "";
            const { data } = await axios.get<DriverResponse>(
                `/api/drivers/unified?page=${page}&limit=${limit}${statusParam}`
            );
            return data;
        },
        placeholderData: (previousData) => previousData,
    });
}

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import type { DriverResponse } from "@/app/(main)/dashboard/master/driver/_components/schema";

interface UseDriversProps {
    page: number;
    limit: number;
}

export function useDrivers({ page, limit }: UseDriversProps) {
    return useQuery({
        queryKey: ["drivers", page, limit],
        queryFn: async () => {
            const { data } = await axios.get<DriverResponse>(
                `/api/drivers?page=${page}&limit=${limit}`
            );
            return data;
        },
        placeholderData: (previousData) => previousData,
    });
}

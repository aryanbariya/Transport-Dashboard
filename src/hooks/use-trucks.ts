import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import type { TruckResponse } from "@/app/(main)/dashboard/master/truck/_components/schema";

interface UseTrucksProps {
    page: number;
    limit: number;
    status?: string;
}

export function useTrucks({ page, limit, status }: UseTrucksProps) {
    return useQuery({
        queryKey: ["trucks", page, limit, status],
        queryFn: async () => {
            const statusParam = status && status !== "all" ? `&status=${status}` : "";
            const { data } = await axios.get<TruckResponse>(
                `/api/trucks/unified?page=${page}&limit=${limit}${statusParam}`
            );
            return data;
        },
        placeholderData: (previousData) => previousData,
    });
}

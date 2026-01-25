import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import type { TruckResponse } from "@/app/(main)/dashboard/master/truck/_components/schema";

interface UseTrucksProps {
    page: number;
    limit: number;
}

export function useTrucks({ page, limit }: UseTrucksProps) {
    return useQuery({
        queryKey: ["trucks", page, limit],
        queryFn: async () => {
            const { data } = await axios.get<TruckResponse>(
                `/api/trucks?page=${page}&limit=${limit}`
            );
            return data;
        },
        placeholderData: (previousData) => previousData,
    });
}

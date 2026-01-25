import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import type { MSWCResponse } from "@/app/(main)/dashboard/master/mswc/_components/schema";

interface UseMSWCProps {
    page: number;
    limit: number;
}

export function useMSWC({ page, limit }: UseMSWCProps) {
    return useQuery({
        queryKey: ["mswc", page, limit],
        queryFn: async () => {
            const { data } = await axios.get<MSWCResponse>(
                `/api/mswc?page=${page}&limit=${limit}`
            );
            return data;
        },
        placeholderData: (previousData) => previousData,
    });
}

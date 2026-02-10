import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import type { MSWCResponse } from "@/app/(main)/dashboard/master/mswc/_components/schema";

interface UseMSWCProps {
    page: number;
    limit: number;
    status?: string;
}

export function useMSWC({ page, limit, status }: UseMSWCProps) {
    return useQuery({
        queryKey: ["mswc", page, limit, status],
        queryFn: async () => {
            const statusParam = status && status !== "all" ? `&status=${status}` : "";
            const { data } = await axios.get<MSWCResponse>(
                `/api/mswc/unified?page=${page}&limit=${limit}${statusParam}`
            );
            return data;
        },
        placeholderData: (previousData) => previousData,
    });
}

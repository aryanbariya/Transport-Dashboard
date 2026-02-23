import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import type { TransportResponse } from "@/app/(main)/dashboard/firsttapa/_components/schema";

interface UseTransportsProps {
    page: number;
    limit: number;
    status?: string;
}

export function useTransports({ page, limit, status }: UseTransportsProps) {
    return useQuery({
        queryKey: ["transports", page, limit, status],
        queryFn: async () => {
            const statusParam = status && status !== "all" ? `&status=${status}` : "";
            const { data } = await axios.get<TransportResponse>(
                `/api/transports/unified?page=${page}&limit=${limit}${statusParam}`
            );
            return data;
        },
        placeholderData: (previousData) => previousData,
    });
}

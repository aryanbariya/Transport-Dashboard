import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import type { FirstReportResponse } from "@/app/(main)/dashboard/firstreport/_components/schema";

interface UseFirstReportProps {
    page: number;
    limit: number;
    status?: string;
}

export function useFirstReport({ page, limit, status }: UseFirstReportProps) {
    return useQuery({
        queryKey: ["firstreport", page, limit, status],
        queryFn: async () => {
            const statusParam = status && status !== "all" ? `&status=${status}` : "";
            const { data } = await axios.get<FirstReportResponse>(
                `/api/firstreport?page=${page}&limit=${limit}${statusParam}`
            );
            return data;
        },
        placeholderData: (previousData) => previousData,
    });
}

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import type { GodownResponse } from "@/app/(main)/dashboard/master/godown/_components/schema";

interface UseGodownsProps {
    page: number;
    limit: number;
    status?: string;
}

export function useGodowns({ page, limit, status }: UseGodownsProps) {
    return useQuery({
        queryKey: ["godowns", page, limit, status],
        queryFn: async () => {
            const statusParam = status && status !== "all" ? `&status=${status}` : "";
            const { data } = await axios.get<GodownResponse>(
                `/api/subgodowns/unified?page=${page}&limit=${limit}${statusParam}`
            );
            return data;
        },
        placeholderData: (previousData) => previousData,
    });
}

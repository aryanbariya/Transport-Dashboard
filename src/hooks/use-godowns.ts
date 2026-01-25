import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import type { GodownResponse } from "@/app/(main)/dashboard/master/godown/_components/schema";

interface UseGodownsProps {
    page: number;
    limit: number;
}

export function useGodowns({ page, limit }: UseGodownsProps) {
    return useQuery({
        queryKey: ["godowns", page, limit],
        queryFn: async () => {
            const { data } = await axios.get<GodownResponse>(
                `/api/godowns?page=${page}&limit=${limit}`
            );
            return data;
        },
        placeholderData: (previousData) => previousData,
    });
}

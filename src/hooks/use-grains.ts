import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import type { GrainResponse } from "@/app/(main)/dashboard/master/grain/_components/schema";

interface UseGrainsProps {
    page: number;
    limit: number;
}

export function useGrains({ page, limit }: UseGrainsProps) {
    return useQuery({
        queryKey: ["grains", page, limit],
        queryFn: async () => {
            const { data } = await axios.get<GrainResponse>(
                `/api/grains?page=${page}&limit=${limit}`
            );
            return data;
        },
        placeholderData: (previousData) => previousData,
    });
}

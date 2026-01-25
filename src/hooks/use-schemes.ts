import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import type { SchemeResponse } from "@/app/(main)/dashboard/master/scheme/_components/schema";

interface UseSchemesProps {
    page: number;
    limit: number;
}

export function useSchemes({ page, limit }: UseSchemesProps) {
    return useQuery({
        queryKey: ["schemes", page, limit],
        queryFn: async () => {
            const { data } = await axios.get<SchemeResponse>(
                `/api/schemes?page=${page}&limit=${limit}`
            );
            return data;
        },
        placeholderData: (previousData) => previousData,
    });
}

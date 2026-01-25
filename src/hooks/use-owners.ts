import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import type { OwnerResponse } from "@/app/(main)/dashboard/master/owner/_components/schema";

interface UseOwnersProps {
    page: number;
    limit: number;
}

export function useOwners({ page, limit }: UseOwnersProps) {
    return useQuery({
        queryKey: ["owners", page, limit],
        queryFn: async () => {
            const { data } = await axios.get<OwnerResponse>(
                `/api/owners?page=${page}&limit=${limit}`
            );
            return data;
        },
        placeholderData: (previousData) => previousData,
    });
}

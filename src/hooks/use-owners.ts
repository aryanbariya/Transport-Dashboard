import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import type { OwnerResponse } from "@/app/(main)/dashboard/master/owner/_components/schema";

interface UseOwnersProps {
    page: number;
    limit: number;
    status?: string;
}

export function useOwners({ page, limit, status }: UseOwnersProps) {
    return useQuery({
        queryKey: ["owners", page, limit, status],
        queryFn: async () => {
            const statusParam = status && status !== "all" ? `&status=${status}` : "";
            const { data } = await axios.get<OwnerResponse>(
                `/api/owners/unified?page=${page}&limit=${limit}${statusParam}`
            );
            return data;
        },
        placeholderData: (previousData) => previousData,
    });
}

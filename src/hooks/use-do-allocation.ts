import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import type { DOAllocationResponse } from "../app/(main)/dashboard/do-allocation/_components/schema";

interface UseDOAllocationProps {
    page: number;
    limit: number;
}

export function useDOAllocation({ page, limit }: UseDOAllocationProps) {
    return useQuery({
        queryKey: ["do-allocation", page, limit],
        queryFn: async () => {
            const { data } = await axios.get<DOAllocationResponse>(
                `/api/do-allocation?page=${page}&limit=${limit}`
            );
            return data;
        },
    });
}

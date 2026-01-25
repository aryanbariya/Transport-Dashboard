import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import type { PackagingResponse } from "@/app/(main)/dashboard/master/packaging/_components/schema";

interface UsePackagingProps {
    page: number;
    limit: number;
}

export function usePackaging({ page, limit }: UsePackagingProps) {
    return useQuery({
        queryKey: ["packaging", page, limit],
        queryFn: async () => {
            const { data } = await axios.get<PackagingResponse>(
                `/api/packaging?page=${page}&limit=${limit}`
            );
            return data;
        },
        placeholderData: (previousData) => previousData,
    });
}

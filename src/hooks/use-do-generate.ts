import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import type { DOGenerateResponse } from "@/app/(main)/dashboard/do-generate/_components/schema";

interface UseDOGenerateProps {
    page: number;
    limit: number;
}

export function useDOGenerate({ page, limit }: UseDOGenerateProps) {
    return useQuery({
        queryKey: ["do-generate", page, limit],
        queryFn: async () => {
            const { data } = await axios.get<DOGenerateResponse>(
                `/api/do-generate?page=${page}&limit=${limit}`
            );
            return data;
        },
        placeholderData: (previousData) => previousData,
    });
}

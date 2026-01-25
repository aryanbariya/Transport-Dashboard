import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import type { CategoryResponse } from "@/app/(main)/dashboard/master/category/_components/schema";

interface UseCategoriesProps {
    page: number;
    limit: number;
}

export function useCategories({ page, limit }: UseCategoriesProps) {
    return useQuery({
        queryKey: ["categories", page, limit],
        queryFn: async () => {
            const { data } = await axios.get<CategoryResponse>(
                `/api/categories?page=${page}&limit=${limit}`
            );
            return data;
        },
        placeholderData: (previousData) => previousData,
    });
}

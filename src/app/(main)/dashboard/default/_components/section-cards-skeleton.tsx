import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardFooter, CardHeader } from "@/components/ui/card";

export function SectionCardsSkeleton() {
    return (
        <div className="grid @5xl/main:grid-cols-4 @xl/main:grid-cols-2 grid-cols-1 gap-4 *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs dark:*:data-[slot=card]:bg-card">
            {Array.from({ length: 10 }).map((_, index) => (
                <Card className="@container/card" key={index}>
                    <CardHeader>
                        <Skeleton className="h-4 w-24 mb-2" />
                        <Skeleton className="h-8 w-16" />
                        <div className="mt-4">
                            <Skeleton className="h-6 w-32 rounded-full" />
                        </div>
                    </CardHeader>
                    <CardFooter className="flex-col items-start gap-1.5 text-sm">
                        <Skeleton className="h-3 w-20" />
                        <Skeleton className="h-3 w-32" />
                    </CardFooter>
                </Card>
            ))}
        </div>
    );
}

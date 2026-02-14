import { NextRequest, NextResponse } from 'next/server';
import { get } from '@/lib/axios';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    let resolvedParams: { id: string } | null = null;
    try {
        resolvedParams = await params;
        const id = resolvedParams.id;
        const data = await get(`/api/do/${id}`);
        return NextResponse.json(data, { status: 200 });
    } catch (error) {
        console.error(`Error in GET /api/do-generate/${resolvedParams?.id}:`, error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

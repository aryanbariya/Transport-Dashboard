import { NextRequest, NextResponse } from 'next/server';
import { post } from '@/lib/axios';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const data = await post('/api/subgodowns', body);

        return NextResponse.json(data, { status: 201 });
    } catch (error) {
        console.error('Error in POST /api/subgodowns:', error);
        return NextResponse.json(
            { error: 'Failed to create subgodown' },
            { status: 500 }
        );
    }
}

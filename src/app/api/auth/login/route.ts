import { NextRequest, NextResponse } from 'next/server';
import { post } from '@/lib/axios';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { email, password, remember } = body;

        if (!email || !password) {
            return NextResponse.json(
                { error: 'Email and password are required' },
                { status: 400 }
            );
        }

        // Proxy to backend auth endpoint
        const data = await post<{ token: string }>('/auth/signin', { email, password });

        // Set the token as an HTTP-only cookie
        const maxAge = remember ? 30 * 24 * 60 * 60 : 24 * 60 * 60; // 30 days or 1 day

        const response = NextResponse.json(
            { success: true, message: 'Login successful' },
            { status: 200 }
        );

        response.cookies.set('auth_token', data.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge,
            path: '/',
        });

        return response;
    } catch (error: any) {
        console.error('Error in POST /api/auth/login:', error);

        const errorMessage =
            error?.response?.data?.error ||
            error?.response?.data?.message ||
            'Login failed. Please try again.';

        const status = error?.response?.status || 500;

        return NextResponse.json(
            { error: errorMessage },
            { status }
        );
    }
}

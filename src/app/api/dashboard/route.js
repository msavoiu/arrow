import { NextResponse } from 'next/server';
import { jwtVerify } from '@/app/middleware.js';

export async function GET(request) {
    try {
        const response = await jwtVerify(request);
        if (response.valid) {
            return NextResponse.json(
                { user_id: response.payload.user_id },
                { status: 200 }
            );
        } else {
            return NextResponse.redirect('/auth/login');
        }
    } catch (err) {
        return NextResponse.redirect('/auth/login'); //  return user to login page if there was an error during verification
    }
}
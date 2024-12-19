import { NextResponse } from 'next/server';
import { jwtVerify } from '@/app/middleware.js';

export async function GET(request) {
    try {
        const response = await jwtVerify(request); // returns validity bool, payload, and status code
        const data = await response.json();

        if (response.valid) {
            const username = await pool.query(
                "SELECT username FROM users WHERE id = $1",
                [data.payload.user_id]
            );

            return NextResponse.json(
                { valid: true, username },
                { status: 200 }
            );

        } else {
            return NextResponse.json(
                { valid: false, message: "Login failed." },
                { status: 401 }
            );
        }

    } catch (err) {
        return NextResponse.redirect('/auth/login'); //  return user to login page if there was an error during verification
    }
}